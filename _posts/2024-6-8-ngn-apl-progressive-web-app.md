---
layout: post
title: Offline APL - Making ngn/apl a Mobile PWA
keywords: apl, programming, front end web, javascript, progressive web app, mobile app, open source, github
---

Hey everyone! Recently, [my pull request (PR)](https://github.com/abrudz/ngn-apl/pull/3) to add offline Progressive Web App (PWA) capability to `ngn/apl` was accepted. I wanted to share how I went about making this open source contribution. But before we go further, feel free to check out the [`ngn/apl` website](https://abrudz.github.io/ngn-apl) - you can install it as an offline PWA app [like this](https://support.google.com/chrome/answer/9658361).

For those unfamiliar, [<img src="{{ site.baseurl }}/images/apl_logo.png" width="22" alt="apl-logo"> APL](https://en.wikipedia.org/wiki/APL_(programming_language)) is a niche programming language I've recently been exploring. It’s a quirky, concise language that grows on you after a while. It’s even more concise than Python, which says a lot! You can check out [my notes and APL resources](https://github.com/sohang3112/apl), which I compiled while learning APL.

**Fun Fact⚡:** both NumPy and Pandas were partially inspired by APL, as it was the first array-oriented language. To get an idea of how concise APL can be, check out [Conway's Game of Life in APL](https://aplwiki.com/wiki/Conway%27s_Game_of_Life), in which one line of APL is doing work that would take a page of Python code!

So, why did I decide to add offline PWA support to `ngn/apl`? I often find myself with some free time while traveling, and I love to tinker with APL. However, internet connectivity is often unreliable on the go. That's why I wanted `ngn/apl` to be installable as a PWA that works offline. To get started, I read up on [Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) and how to implement them. This mainly involved creating a [manifest.json](https://github.com/abrudz/ngn-apl/blob/master/manifest.json) file and figuring out how to cache assets for offline use using [serviceWorker.js - check out its code](https://github.com/abrudz/ngn-apl/blob/master/serviceWorker.js). Luckily, this was possible with `ngn/apl` because the server’s role is minimal; it only serves the initial HTML/CSS/JS. The APL interpreter runs entirely in the frontend JavaScript, so no backend APIs are needed. This isn’t the case with other APL interpreters like [TryAPL](https://tryapl.org/), which rely on backend APIs for interpretation.

When I decided to implement this feature, I forked the [`ngn/apl` repo](https://github.com/abrudz/ngn-apl) and started working on it. Initially, I faced some challenges, particularly with caching not working as expected. This pushed me to dive deeper into service worker JavaScript to ensure everything worked smoothly offline. A few days ago, I shared my fork in the [APL Farm (Discord)](https://discord.gg/yHna7nt7zx) community, and the maintainer asked why I hadn’t opened a PR for it. I explained that I thought the original repo was abandoned. He encouraged me to submit a PR, and after making some formatting adjustments to match the original code style, my PR was accepted!

Thanks for reading! If you're interested in more of my work, check out my [GitHub](https://github.com/sohang3112) and [LinkedIn](https://in.linkedin.com/in/sohang-chopra). Be sure to like and comment on this blog post and share it with others who might find it interesting!

