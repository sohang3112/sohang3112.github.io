---
layout: post
title: Resolving GitHub Push Hanging Issue
subtitle: SSH IPv4 vs IPv6
image: 
tags: 
---



### Problem
`git push` and `git pull` hanged (using SSH url).
  
### Investigation
- Enable tracing in git to check what's wrong:
```console
$ GIT_TRACE=1 git push
trace: built-in: git push
trace: run_command: unset GIT_PREFIX; ssh git@github.com 'git-receive-pack '\''sohang3112/machine-learning-practice.git'\'''
trace: start_command: /usr/bin/ssh git@github.com 'git-receive-pack '\''username/repo.git'\'''
```
 
- We're stuck at ssh connection to github, so let's check that seperately (enabling verbose mode for debugging):
```console
$ ssh -vvv -t git@github.com
OpenSSH_9.6p1, OpenSSL 3.2.2 4 Jun 2024
debug1: Reading configuration data /home/sohang/.ssh/config
...
debug1: Connecting to github.com [64:ff9b::14cf:4952] port 22
```

- SSH hanged while connecting to IPv6 address of Github, so let's try IPv4 instead: 
```console
$ ssh -o AddressFamily=inet -T git@github.com
PTY allocation request failed on channel 0
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
Connection to github.com closed.
```

### Solution
Using IPv4 for SSH connection worked (didn't hang)! 
Now let's set this option in SSH config so that it always uses IPv4 only for Github:
```
# add this in ~/.ssh/config file
Host github.com
  AddressFamily inet
```
Now `git push` and `git pull` work without hanging!

### Further Checking Reason
`ping 64:ff9b::14cf:4952` works, but opening `http://[64:ff9b::14cf:4952]` in browser or trying to connect with `curl 64:ff9b::14cf:4952` or ssh hangs. Similarly forcing curl to use IPv6 for connecting to github hangs: `curl -v -6 https://github.com`.

So conclusion? Github IPv6 doesn't seem to be fully working right now, instead use IPv4 for Github.

https://isgithubipv6.live/ (unofficial website?) says Github is NOT IPv6 ready yet.

one factor here is developing countries (including india), pushing aggessively towards ipv6 addresses (a lot more supply means cheaper) rather than scarce and expensive ipv4 addresses (use shared ipv4 if ipv4 is required - confirm this from a source).
https://blog.apnic.net/2023/06/05/four-of-the-worlds-top-10-populous-economies-driving-ipv6-adoption/ - >78% of India's internet traffic is IPv6, driven largely by Reliance Jio (confirm this?). other countries like china, brazil are also pushing towards ipv6 usage.

https://github.com/orgs/community/discussions/10539 - github discussion opened in 2022 re github's ipv6 support (still not there adequately!)


-----------------------

<!-- ChatGPT edited version -->

<!-- Also include: cant just switch to HTTP instead of SSH url because GitHub has disabled HTTP password access now for git push -->

### Title:  
Fixing `git push` Hang with GitHub SSH

### Subtitle:  
Debugging and resolving GitHub's incomplete IPv6 support.

### Blog Post:

It started as a routine `git push`, but my command just hanged, leaving me staring at the terminal. After a bit of digging, I realized that the issue wasn’t with my setup—it was with GitHub's incomplete IPv6 support. Here's the story of how I uncovered the problem and fixed it.

### Problem:
The `git push` and `git pull` commands were freezing indefinitely while using GitHub’s SSH URL. No error messages, no timeout, just... stuck.

### Investigation:

When a problem like this happens, it’s always a good idea to trace what's going on. So, I enabled Git’s trace mode to get more details:

```bash
$ GIT_TRACE=1 git push
trace: built-in: git push
trace: run_command: unset GIT_PREFIX; ssh git@github.com 'git-receive-pack '\''username/repo.git'\'''
trace: start_command: /usr/bin/ssh git@github.com 'git-receive-pack '\''username/repo.git'\'''
```

The trace showed that the issue was happening during the SSH connection, not the Git operation itself. So, I decided to debug the SSH connection more closely:

```bash
$ ssh -vvv -T git@github.com
OpenSSH_9.6p1, OpenSSL 3.2.2 4 Jun 2024
debug1: Reading configuration data /home/sohang/.ssh/config
...
debug1: Connecting to github.com [64:ff9b::14cf:4952] port 22
```

And there it was: the SSH connection was trying to use GitHub’s IPv6 address, and it was stuck. To verify this, I forced SSH to use IPv4 instead:

```bash
$ ssh -o AddressFamily=inet -T git@github.com
PTY allocation request failed on channel 0
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
Connection to github.com closed.
```

Bingo! The connection succeeded when using IPv4.

### Solution:

To avoid manually forcing IPv4 every time, I edited my SSH configuration to make GitHub always use IPv4:

```bash
# ~/.ssh/config
Host github.com
  AddressFamily inet
```

With this simple change, both `git push` and `git pull` worked perfectly, without hanging.

### A Deeper Dive: Why GitHub’s IPv6 Fails

Curious about why GitHub’s IPv6 was hanging, I started testing further. `ping 64:ff9b::14cf:4952` (GitHub’s IPv6 address) responded fine, but when I tried connecting using `curl` or opening it in a browser, it hung again:

```bash
$ curl -v -6 https://github.com
```

This showed me that while GitHub technically supports IPv6 addresses, their network doesn’t seem fully functional with IPv6, at least not for SSH or certain types of requests. This matched what I found in a 2022 discussion thread on GitHub about their incomplete IPv6 support, which is still ongoing.

An unofficial website, [isgithubipv6.live](https://isgithubipv6.live/), even reports that GitHub is not yet fully IPv6 ready.

### The Bigger Picture: Why This Matters

It’s not just a GitHub problem. India, China, and other countries are aggressively adopting IPv6 due to the scarcity and high cost of IPv4 addresses. In India alone, over 78% of internet traffic is now IPv6, driven by telecom giants like Reliance Jio. With such a large shift towards IPv6, services like GitHub lagging behind can cause hiccups like the one I experienced.

### Conclusion:

If your Git commands over SSH hang unexpectedly, the issue might not be your configuration—it could be GitHub’s incomplete IPv6 support. Switching to IPv4 for GitHub connections is a simple and effective fix, at least until GitHub improves its IPv6 handling.