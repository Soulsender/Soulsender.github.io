---
layout: post
title:  "Network Topology"
date:   2025-03-25
categories: blog
---

### My Current Network Topology
![](/images/network-topology/homelab.drawio.png)

### Reverse Proxy
This is something I get asked about the most, why do I proxy all my public internet traffic? There are a couple reasons:

1. It masks my public IP. Though it's not a "security risk" per-say, it does expose the general area where I live, so I do this for opsec reasons.
2. It gives me more control than using something like CloudFlare tunnels (I couldn't figure out how to get it working with SSL lol.)
3. It gives me a public IP I can proxy to whatever I want (as opposed to paying for a public IP at home, or using dynamic DNS.)
<br>
Basically there is only one rule, and that's to proxy traffic inbound to the `server` subdomain on port 25565 to the minecraft server through tailscale. If I have another minecraft server running I would replicate the same rule with `25566` instead.

Traffic inbound from the `notes` subdomain goes to nginx running [Perlite](https://github.com/secure-77/Perlite) to expose my obsidian notes.
[See the writeup here.](https://soulsender.me/server/2023/02/15/reverse-proxy.html)

### Promox
I only have one actual server at home. This is a proxmox server and virtualizes both TrueNAS Scale and a Debian LXC container that hosts my docker containers. 
[See the writeup here.](https://soulsender.me/server/2024/10/23/home-server-v2.html)

### Docker
All my services are hosted through docker because it's easier to manage and keep secure.

They are various open source apps, with additionally some of my own apps like my discord bots.
- [Homepage](https://gethomepage.dev)
- [Minecraft](https://github.com/itzg/docker-minecraft-server)
- [Frong Bot](https://github.com/Soulsender/frong-bot)
- [Earth Invader](https://github.com/CosmodiumCS/MK19-EarthInvader)
- [mc-query](https://github.com/Soulsender/mc-query)
