---
layout: post
title: Server-Sent Events (SSE)
subtitle: Demo with Flask server (Python)
tags: programming, http, backend, python, flask, server, server-sent events
---

Most commonly on the web, HTTP involves the client repeatedly sending requests, and for each the server sends back responses. This works for most applications, but is not performant enough for real-time applications. The most performance-sensitive applications (like multi-player realtime games) use Web Socket sessions instead of normal stateless HTTP connections. This boosts performance but at the cost of complexity - now the server needs to manage both HTTP and Web Socket sessions, plus the Web Socket sessions are stateful and inherently more complex than HTTP sessions. There's a third option - Server-Sent Events (SSE) which is a middle-ground between these two - they still use HTTP machinery (so there's less complexity), but like Web Sockets they are stateful; they are less performant than Web Sockets but are still fast enough for real-time applications like chat notifications. So there's a complexity vs performance tradeoff, from the simplest to the most complex but performant: normal HTTP -> HTTP Server-Sent Events -> Web Sockets.

Server-Sent Events involve a single long-lived HTTP connection, in which *events* are streamed from each line of the HTTP response body. This is in contrast to HTTP polling approach, in which many short-lived HTTP requests are sent to the server at regular periods (intervals of time). The difference 

![Server-Sent Events](https://bunnyacademy.b-cdn.net/What-is-SSE-Server-Sent-Events-and-how-do-they-work.svg)

https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events

[Github repo](https://github.com/sohang3112/server-sent-events-progress-bar-demo)