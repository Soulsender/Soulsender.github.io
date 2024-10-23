---
layout: post
title:  "Becoming a Sysadmin"
date:   2024-01-02
categories: server
---

## Behind every digital service is a system admin.

There might even be more than once, depending on the scale – but every service has one. They are the people who ensure that a service is always working when you need it. Here's my story of how I came to become my own system admin for my own server.

If you haven't read my other post about my server, you might be missing some context, but the TL;DR of it is that I run my own server in my home that I maintain. This server runs many different services, mostly for my own personal use, but it also runs a Minecraft game server for my friends and I. This is where we can all connect and play together at the same time.

But here's the thing: this server needs to be running all the time. It must host the code that runs the Minecraft game server, so that anyone can decide to join and play, even if the owner (myself) is not online.

Now it's not as simple as starting the game server and walking away. You have to ensure a couple different things.

### Uptime

Uptime is basically how long something is online before it goes down. The objective here is basically to make sure that the service never goes down (at least – that's what the clients believe). Realistically, you cannot have something online forever. It will sometimes need to be taken down for updates or patches. This is why you need to make these updates as least disturbing to the clients as possible.

This is one of the reasons why companies use Linux for a lot of their server infrastructure. Rarely must the server actually be restarted after applying updates – unlike Windows.

### Security

Another factor when running any kind of service is security. You need to protect user information, as well as access to your server. You don't want just anyone being able to use your services.

### Ok So?

So how does any of this relate to a Minecraft game server? Well, just like any other service like a website or file sharing platform, there can be issues and bugs that arise. Here are a couple that I ran into.

### The First Issue

One time, a user reported the game server running poorly. This user would go somewhere in-game, and then be teleported back to where they were a few seconds ago. This is a relatively common issue on any online game and has been given the name "rubber banding" due to how you are moved between two in-game locations because the server and the client report different locations for where the player is.

There are a couple of different causes for this, the most common being an unstable network connection. However, this user reported that their network connection was fine. Another cause was that the server itself was running out of resources. Using a server-side mod called [Spark](https://www.curseforge.com/minecraft/mc-mods/spark), I was able to run a test where I found that the server's resources were being used in this one specific place in-game, where there were too many hostile monsters, and the server could not keep up with rendering them all at once.

Once I had removed them all, everything went back to normal and the issue went away.
