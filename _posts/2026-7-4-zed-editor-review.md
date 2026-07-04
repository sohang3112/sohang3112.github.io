---
layout: post
title: Zed Editor Review (after using it for a couple of weeks)
image: /images/zed-editor-logo.jpeg
tags:
  - editor
  - programming
  - "open source"
---

Zed (an open-source editor) has generated quite a bit of hype in programming circles, especially since it is written in Rust, and also refreshingly it’s not just another VS Code fork.
That being said, it’s still a niche editor.
I mainly use VS Code - decided to try out Zed to see if it lives up to the hype 😀.
As such, I will be comparing Zed with VS Code as that’s the editor I’m most familiar with.
When I encounter a feature, limitation or useful setting in Zed, I update it here: [Zed Editor NOTES](https://gist.github.com/sohang3112/74eaceed5ddbd4e2c193854da70b521e).
This post explores a subset of my experiences with Zed - for the full version, do check out this GitHub Gist and star it if you find it useful :)

**TLDR:** I like Zed (especially its instant loading speed) - it’s especially impressive how much Zed supports out of the box, considering how young the project is.
But for Data Science (Python) work, it’s not yet fully ready to replace VS Code, mainly due to issues with Jupyter Notebook (though it is rapidly getting better).

**Environment I used:** Zed 1.7.2 on Ubuntu 26.04.

<!--more-->

<!-- Post Excerpt ends here -->

Before starting, a bit about me - I work in Data Science & AI, and am also pursuing MTech (AI) from IIT Madras.
The programming language I mainly use is Python, though in my personal time I occasionally dabble in a few others (eg., JavaScript, Rust).
For the last couple of weeks, I have been using Zed while working through my MTech coursework in [my GitHub repo](https://github.com/sohang3112/iit-madras-web-mtech-ai/).
I do code assignments in Python, write my notes in Markdown, and read lecture PDFs provided by Professors - so these are primarily the use cases I’m interested in.

VS Code is one of the most used programming editors - it utilises web technologies and runs using Electron.
This gives VS Code portability and allows it to run easily as both a desktop app & as a web IDE (at [https://vscode.dev](https://vscode.dev)).
But using Electron also means that VS Code is essentially running a stripped-down browser just for code editing!
This puts a fundamental constraint on how fast it can be.
Credit where it’s due - VS Code is heavily optimised and in my experience runs fast enough in most cases despite Electron.

## Zed’s Pros

When I installed Zed, I was pleasantly surprised by how familiar the UI felt.
Most default keyboard shortcuts are the same as VS Code - eg. *Ctrl+Shift+P* brings up the command search panel, *Ctrl+K Ctrl+O* to open a folder.
The default UI has some differences, such as the files panel on the right (unlike the files panel on the left in VS Code) - the left panel in Zed is instead used for AI features.
AI features are ubiquitous now, and Zed also includes it out of the box - the default agent is their custom Zed Agent, but it’s easy to use other options like GitHub Copilot (which is what I use).
I liked this default experience, though if desired, the UI can be customised (eg. files panel placement on left instead), and all AI features can be disabled with a single setting.

Zed lives up to its promise of speed - its loading time is instant even on my older laptop, in contrast to an initial loading delay on opening VS Code.
One of the only other modern GUI editors I use having instant loading time is Notepad++ (on Windows) - it’s impressive that Zed achieves the same while being portable & more featureful.
Zed’s speed is also noticeable in other areas - eg. instant rendering of Jupyter Notebooks unlike a lag in VS Code.
This has the caveat that Jupyter Notebook support is in preview mode (read below).

In VS Code, multiple folders can be opened at once in a workspace.
Zed makes this even more seemless - unlike VS Code, multiple folders can be opened at once directly with *Ctrl+K Ctrl+O* !
Of course, additional folders can also be added to the workspace later - this is also instant in Zed, unlike a lag in VS Code.

Do check out [https://zed.dev/blog/text-manipulation](https://zed.dev/blog/text-manipulation) - it’s a useful guide to many text editing techniques in Zed.
I like Multi Cursors (with *Alt + Shift + Mouse Drag*) to simultaneously edit on multiple lines.
Yes, it’s also available in VS Code - but still I wanted to mention it as it’s very useful.
Related is a feature I haven’t yet tried - Multi-Buffers to edit simultaneously in multiple files (eg. in search result)!
Multi Buffers and Multi Cursors should combine well to unlock even more powerful editing.

## Zed’s Cons

Jupyter Notebooks’ support is in preview - by default raw JSON content of *.ipynb notebook files show which is not useful.
An environment variable `LOCAL_NOTEBOOK_DEV=1` + addition in settings JSON file `"feature_flags": {"tabular-data-preview": "on", "notebooks": "on"}` enable Jupyter Notebook support.
After that, Jupyter Notebooks work pretty well, though with annoyances like no way to delete a cell, run all cells at once, copy text from cell output, etc.
This is the feature that I’m most significantly impacted by as Jupyter Notebooks are very common in Data Science work.
I have documented how I set up Jupyter Notebook support in Ubuntu and the issues I faced [here](https://gist.github.com/sohang3112/74eaceed5ddbd4e2c193854da70b521e#jupyter-notebook-support-still-in-preview-mode).

Some minor issues are:

* No MathJAX support in Markdown documents. MathJAX (`$ ... $`, `$$ ... $$`) renders into math expressions in VS Code and GitHub. It’s significant for me as I write my notes in Markdown, and need to note down many math formulae related to Machine Learning while studying for my MTech course.
* Lack of PDF rendering: Zed instead offers to open a PDF in the native PDF editor. VS Code has extensions to view PDFs. This one is a nice-to-have but not very significant for me.
* Available extensions are fewer. But honestly, so many things are built-in that I did not need to install extensions. Eg., many Python features require extensions in VS Code but are built in in Zed.

## Conclusion

So far, using Zed has been a good experience.
There’s much left for me to explore - [Zed’s blog](https://zed.dev/blog) mentions several features I haven’t yet tried.
The biggest caveat for me is Jupyter Notebooks - they work well in Zed (after one-time setup to enable support), but the annoyances add up - for the best experience I have to return to VS Code.

Other people who have tried Zed, especially those working in Data Science - how has your experience been? Comment below.

