---
layout: post
title: Server-Sent Events (SSE)
subtitle: Demo with FastAPI server (Python)
image: /images/server-sent-events.png
tags: programming, http, backend, python, fastapi, server, server-sent events
---

Most commonly on the web, HTTP involves the client repeatedly sending requests, and for each, the server sends back responses. This works for most applications but is not performant enough for real-time applications. The most performance-sensitive applications (like multi-player real-time games) use WebSocket sessions instead of normal stateless HTTP connections. This boosts performance but at the cost of complexity — now the server needs to manage both HTTP and WebSocket sessions. Plus, the WebSocket sessions are stateful and inherently more complex than HTTP sessions.

There's a third option — **Server-Sent Events (SSE)**, which is a middle ground between these two. SSE still uses HTTP machinery (so there's less complexity), but like WebSockets, they are stateful. They are less performant than WebSockets but still fast enough for real-time applications like chat notifications. Unlike WebSockets, SSE is one-way (server → client), but this is sufficient for many applications.

So there's a complexity vs. performance tradeoff, from the simplest to the most complex and performant:

- Normal HTTP → HTTP Server-Sent Events → WebSockets.

<!--more-->
<!-- Post Excerpt ends here -->

### What Are Server-Sent Events (SSE)?

SSE involves a single long-lived HTTP connection in which *events* are streamed from each line of the HTTP response body. This contrasts with the HTTP polling approach, where many short-lived HTTP requests are sent to the server at regular intervals. The difference between the two is illustrated below:

<a href="https://bunny.net/academy/http/what-is-sse-server-sent-events-and-how-do-they-work/" target="_blank" style="display: flex; justify-content: center">
    <img src="{{ site.baseurl }}/images/server-sent-events.png" width="255" alt="Normal HTTP vs Server-Sent Events">
</a>

To explore more and learn about Server-Sent Events, I built a simple demo on GitHub: [GitHub repo](https://github.com/sohang3112/server-sent-events-progress-bar-demo). This is a simple demo showing a progress bar in the browser of a simulated server action. There's no actual action on the server (since this is just a demo!). The progress bar increases with random increments, but in real-world applications, this technique can be used to show the progress of tasks like file uploads or heavy background processes like image processing or model inference.

### FastAPI Example

Let's dive into the main parts of this demo, focusing on SSE with FastAPI. For those unfamiliar, FastAPI is a popular async server library. You can explore it [here](https://fastapi.tiangolo.com/).

#### HTTP Endpoint

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

This is the first main HTTP endpoint. It serves *index.html* at the `/` endpoint. Every new client gets a unique session ID, which is used to track open SSE sessions. (Note: in a real-world app, you'd consider using the [PRG (Post/Redirect/Get)](https://en.wikipedia.org/wiki/Post/Redirect/Get) design pattern here.)

#### Client-Side JavaScript

```javascript
const session_id = {{ id }};
const progressBar = document.getElementById('demo-progress-bar');
const eventSource = new EventSource(`/progress?session_id=${session_id}`);

eventSource.addEventListener("progress", (event) => {
    const progress = JSON.parse(event.data).progress;
    progressBar.value = progress;
});
```

This script controls the progress bar using server-sent progress values. Each new value comes in the form of a JSON event from the `/progress` endpoint. The event looks like:

```
event: progress
data: {"progress": 10, "id": 2}

event: progress
data: {"progress": 12, "id": 2}
```

Each event is separated by two newlines, and the data is prefixed by `data:`. The custom event name is `progress` in this case (it can be named anything), but if no event is specified, the `onmessage` event handler is used instead by the browser.

#### Server-Side SSE Event Handler

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
        milliseconds = random.randint(100, 2000)
        await asyncio.sleep(milliseconds / 1000)

@app.get("/progress")
async def progress_bar_sse(session_id: int):
    return StreamingResponse(progress_bar(session_id), media_type="text/event-stream")
```

The `progress_bar` function increments progress in a loop from 0 to 100. This progress is streamed to the client in JSON format using the `server_sent_event` helper function. The HTTP response is streamed with the media type `text/event-stream`, signifying SSE.

### Caveats

One caveat is the **complexity added due to stateful SSE sessions**. There is a limit to how many open SSE sessions can be kept in memory, as each session's state (progress) must be tracked. With normal HTTP polling, this isn't an issue since the progress state would be stored externally (e.g., in a database).

Another limitation is on the **client-side**: you can't open too many concurrent SSE sessions in a single browser due to browser restrictions.

In the real world, SSE can be useful for chat notifications or live updates, where the server pushes one-way events to the client.

That’s it for now — feel free to check out and star the [GitHub repo](https://github.com/sohang3112/server-sent-events-progress-bar-demo). For more details, explore the [MDN Resource](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).