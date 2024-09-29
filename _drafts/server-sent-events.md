---
layout: post
title: Server-Sent Events (SSE)
subtitle: Demo with FastAPI server (Python)
tags: programming, http, backend, python, fastapi, server, server-sent events
---

Most commonly on the web, HTTP involves the client repeatedly sending requests, and for each the server sends back responses. This works for most applications, but is not performant enough for real-time applications. The most performance-sensitive applications (like multi-player realtime games) use Web Socket sessions instead of normal stateless HTTP connections. This boosts performance but at the cost of complexity - now the server needs to manage both HTTP and Web Socket sessions, plus the Web Socket sessions are stateful and inherently more complex than HTTP sessions. There's a third option - Server-Sent Events (SSE) which is a middle-ground between these two - they still use HTTP machinery (so there's less complexity), but like Web Sockets they are stateful; they are less performant than Web Sockets but are still fast enough for real-time applications like chat notifications. Unlike Web Sockets, SSE is one way (server -> client), however this is sufficient for many applications. So there's a complexity vs performance tradeoff, from the simplest to the most complex but performant: normal HTTP -> HTTP Server-Sent Events -> Web Sockets.

Server-Sent Events involve a single long-lived HTTP connection, in which *events* are streamed from each line of the HTTP response body. This is in contrast to HTTP polling approach, in which many short-lived HTTP requests are sent to the server at regular periods (intervals of time). The difference between the two is illustrated by the following diagram - this image is borrowed from a web article, you can visit the original article by clicking on the image:

<!-- ![Server-Sent Events](https://bunnyacademy.b-cdn.net/What-is-SSE-Server-Sent-Events-and-how-do-they-work.svg) -->

<a href="https://bunny.net/academy/http/what-is-sse-server-sent-events-and-how-do-they-work/" target="_blank"
   style="display: flex; justify-content: center">
   <!-- TODO: above style is for centering this image. put it in a CSS class -->
    <img src="{{ site.baseurl }}/images/server-sent-events.png" width="255"
         alt="Normal HTTP vs Server-Sent Events"
    >
</a>

To explore more & learn about Server-Sent Events, I built a simple demo of server-sent events on GitHub: [Github repo](https://github.com/sohang3112/server-sent-events-progress-bar-demo). This is a simple application for learning/demo purpose, which shows a progress bar shown in browser of a simulated action on the server. Right now there's no actual action going on in the server (because this is just for demo!), so it's increasing progress of progress bar with random increments at regular intervals. But in the real world, this technique can be used to show the progress of any backend process like file upload or a heavy background process on server like image processing, inference on deep learning models, etc.

Let's look at the main parts of the demo application. I'll be focusing here on the SSE part, not FastAPI server itself - for those unfamiliar with it, it's a popular async server library that you can explore at the [FastAPI website](https://fastapi.tiangolo.com/).

```python
@app.get("/")
def index(request: Request):
    global next_session_id
    session_id = next_session_id
    next_session_id += 1
    return templates.TemplateResponse(
        request=request, name="index.html", context={"id": session_id}
    )
```

In app.py (server script), this is the first main HTTP endpoint. It's mostly familiar stuff - just like any other HTTP application, we serve *index.html* in `/` endpoint. The important thing to note here is that every new client that requests index.html gets a page with a new session-id. Session-id is shown in the page for demo purpose, but its actual use is for internally keeping track of all open SSE sessions. Note that this violates one convention of HTTP applications - that a GET request should not be stateful so that it can be cached by the browser. Here that doesn't matter so much (it's a demo!), but in a real application this needs to be kept in mind - this could be converted from pure GET to [PRG (Post/Redirect/Get)](https://en.wikipedia.org/wiki/Post/Redirect/Get) web design pattern.

In client-side (index.html), we control an HTML `<progress>` element (progress bar) using server-sent progress values via the following JavaScript code. Here we see the actual use of the unique session id of a page - the JavaScript calls `/progress` endpoint with session id as a parameter to identify itself to the server. This `/progress` endpoint is the long-lived HTTP request that streams progress values from the server within a single request's body.

```javascript
const session_id = {{ id }};
const progressBar = document.getElementById('demo-progress-bar');
const eventSource = new EventSource(`/progress?session_id=${session_id}`);

eventSource.addEventListener("progress", (event) => {
    const progress = JSON.parse(event.data).progress;
    progressBar.value = progress;
});
```

Here we see that we expect each new progress value to come in the form of a JSON event. The event being JSON isn't strictly necessary, but it's convinient as it allows easily adding new parameters in the future if required. The "events" from server are like this in the HTTP response body:

```
event: progress
data: {"progress": 10, "id": 2}

event: progress
data: {"progress": 12, "id": 2}
```

Each event in the response body is seperated by 2 newlines. The actual data is prefixed by `data:`, and the event name is prefixed by `event:`. The event data can also span multiple lines if required - each line should be prefied by `data:`. This is an example of named events, but event line can also be omitted - in that case (no event specified), `onmessage` event handler is called in client-side JavaScript (instead of the custom named event `progress` handler which is used right now).

Now let's have a look at the backend code to handle this `progress` SSE event:

```python
def server_sent_event(data: str, **kwargs: str):
    ans = re.sub("^", "data: ", data, flags=re.MULTILINE)
    if kwargs:
        ans += "\n" + "\n".join([f"{key}: {value}" for key, value in kwargs.items()])
    return ans + "\n\n"

async def progress_bar(session_id: int):
    for progress in range(100):
        data = {"progress": progress}
        print("Id:", session_id, "Progress:", progress, flush=True)
        yield server_sent_event(json.dumps(data), event="progress", id=session_id)
        milliseconds = random.randint(
            100, 2000
        )  # random timeout b/w 0.1 secs to 2 secs
        await asyncio.sleep(milliseconds / 1000)

@app.get("/progress")
async def progress_bar_sse(session_id: int):
    return StreamingResponse(progress_bar(session_id), media_type="text/event-stream")
```

The main work is done by `progress_bar(session_id)` function, which increments progress in a loop from 0 to 100 at random intervals. Timeout is done using `asyncio.sleep` - this prevents the whole server code from pausing, so that HTTP requests from other clients can still be handled. Since async code is used here, that's why FastAPI is used (since FastAPI is designed from the ground-up to be async!). Other server libraries like Flask would be harder to use as they only handle sync code by default, although it can be extended to handle async code also.

The `/progress` endpoint simply starts an event stream (long-lived HTTP response) using `StreamingResponse` and offloads the work to `progress_bar` function. Note the specified media type of the response `text/event-stream` which denotes its purpose.

Here `server_sent_event` helper function actually constructs the data in the format required for SSE. Our event is a JSON-encoded dict having progress and session id. We wrap the event string with `data:` prefix at start and newlines at the end. Multi-line event strings are handled (although not used in this application) by prefixing each line in a multi-line event string with `data:` using `re.sub()`.

Finally the server is run using `uvicorn.run(app, port=8000)` ASGI server (A in ASGI stands for async). It would be even better to use `hypercorn` instead of `uvicorn` as it supports HTTP/2 also, but I had some issues with logging in `hypercorn` so I stuck with `uvicorn` for now.

One big caveat to keep in mind is the complexity added due to stateful SSE sessions (instead of normal stateless HTTP connections). In practice there's a limit (depending on server hardware resources - CPU, RAM) on how many open SSE sessions can be kept in memory. That's because each session is unique and the current state (progress) of each running SSE session loop needs to be stored in memory. This issue won't arise in normal HTTP polling request-response method because there won't be so many in-memory progress loops - instead the progress would be stored externally (most likely in a database) and the progress endpoint would simply fetch & update from the database. The cost of this polling approach would be a bit reduced performance for individual sessions.

Another thing to keep in mind is that you can't open too many concurrent pages of this progress bar demo in a single browser - that's because the browser also imposes limitations on how many open browser tabs can be doing SSE sessions at the same time. So these limits are imposed both on the server and the client-side. In practice the client-side limitation isn't as important, because in a real application we're unlikely to require lots of concurrently open pages of the same web application. The server-side limitation is much more severe, because by definition a server is supposed to serve many different users at the same time.

One real-world application of SSE I mentioned previousy also was in chat / social media apps. Normally the client always has to initiate a communication with the server. But SSE allows the server instead to send one-way events to the client, like chat notifications. Actions by the current user (like sending a message to another user) can be done with normal HTTP requests from client to server.

That's it for now - please star the [Github repo](https://github.com/sohang3112/server-sent-events-progress-bar-demo) of this demo of SSE. For more detailed explanation & nuances, do check out **MSDN Resource**: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events .

