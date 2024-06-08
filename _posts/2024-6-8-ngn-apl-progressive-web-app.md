---
layout: post
title: Offline APL - Making ngn/apl a Mobile PWA
keywords: apl, programming, front end web, javascript, progressive web app, mobile app, open source, github
---

<!-- MAYBE add a subtitle also in above header block, like in Blood Sweat & Pixels post -->

Hey everyone! Recently, my pull request (PR) to add offline Progressive Web App (PWA) capability to ngn/apl was accepted. On this occasion, I wanted to share how I went about making this open source contribution.

For those unfamiliar, APL is a programming language I've recently been exploring. It’s a quirky, concise language that grows on you after a while. It’s even more concise than Python, which says a lot! Fun fact: both NumPy and Pandas were partially inspired by APL, as it was the first array-oriented language.

So, why did I decide to add offline PWA support to ngn/apl? I often find myself with some free time while traveling, and I love to tinker with APL. However, internet connectivity is often unreliable on the go. That's why I wanted ngn/apl to be installable as a PWA that works offline. To get started, I read up on Progressive Web Apps and how to implement them. This involves creating a manifest.json file and figuring out how to cache assets for offline use. Luckily, this was possible with ngn/apl because the server’s role is minimal; it only serves the initial HTML/CSS/JS. The APL interpreter runs entirely in the frontend JavaScript, so no backend APIs are needed. This isn’t the case with other APL interpreters like tryapl.org, which rely on backend APIs for interpretation.

When I decided to implement this feature, I forked the ngn/apl repo and started working on it. Initially, I faced some challenges, particularly with caching not working as expected. This pushed me to dive deeper into service worker JavaScript to ensure everything worked smoothly offline. A few days ago, I shared my fork on an APL Discord community, and the maintainer asked why I hadn’t opened a PR for it. I explained that I thought the original repo was abandoned. He encouraged me to submit a PR, and after making some formatting adjustments to match the original code style, my PR was accepted!

Thanks for reading! If you're interested in more of my work, check out my GitHub and LinkedIn. Be sure to like and comment on this blog post and share it with others who might find it interesting!

