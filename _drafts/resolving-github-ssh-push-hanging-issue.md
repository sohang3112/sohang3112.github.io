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