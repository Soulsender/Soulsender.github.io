---
layout: post
title:  "Void Linux"
date:   2022-05-29
categories: blog
---

# Entering the Void - My Experience Installing Void Linux

Void Linux is a BSD type Linux distro. I was intrigued by its smaller user base and the fact that I've never tried a BSD-oriented distro before. It's different from other distros by a couple of things:

### Benefits and Drawbacks of Void

Aside from having a cool name, what is Void used for? Well, it has a couple of quirks:

1. **runit** - runit is a different init system from systemd. It's more modern, faster, and effective than systemd. This makes Void even more minimal than Arch, as runit has significantly less code than systemd!

2. **xbps** - xbps (X Binary Package System) is the Void package manager. It's extremely fast and is generally regarded as a very good package manager. It takes a bit of configuring, as the default mirror is all the way in Germany (spoiler alert: I'm not German). It does lack some more proprietary packages, where [xbps-src](https://github.com/void-linux/void-packages) comes in as an extension of xbps-install. You also have third-party tools like [xdeb](https://github.com/toluschr/xdeb) to install Debian `.deb` packages, which is very nice.

3. **muscl** - muscl is also available to be used and is a nice addition and option instead of glibc, though I didn't use it to avoid dealing with programs not working from it.

### The Installation

I decided to go with the base ISO to get the true Minimalist Experience (TM). I had practiced installing and setting up KDE Plasma in a virtual machine, so I knew what I had to do - in theory, anyways. After flashing the ISO to a drive using Rufus (I had some issues with DD on Linux), I booted to the live environment and the welcoming arms of tty1. Void has a nice terminal-gui installer. It runs in a tty, but isn't a real graphical interface.

![](/images/void/after.png)