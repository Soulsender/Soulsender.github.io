---
layout: post
title:  "Building a Proxmox Home Server"
date:   2024-10-23
categories: server
---

# Building a Proxmox Home Server
> This is an update to my [previous home server build.](/_posts/2022-12-12-home-server.md)

My server has been kinda borked for the last month because I haven't had time to fix it. When I finally did have time, I decided I wanted to try something new. Proxmox!

### What is Proxmox
Proxmox is what you would call a Type-1 hypervisor. A hypervisor is basically the management platform for virtual machine. There are two kinds, Type-1 and Type-2. 

Type-2 hypervisors are applications that run on an existing host system. Examples of these are VMware, VirtualBox, and the Type-2 version of Hyper-V. These all run on your host OS, usually windows or linux. 

Type-1 hypervisors run directly on the hardware. There is no Linux or Windows host for these, the OS *is* the hypervisor. Examples of these are VMware ESXI, Hyper-V, and of course, Proxmox.

This means that to use Proxmox, I install it on my bare metal server. So that's what I did.

### Post-Install
The installation for Proxmox is pretty simple, it's not that different from a regular Debian or Ubuntu install. After the install you are prompted to navigate to the web UI. Which looks something like this:

![](/images/home-server-v2/promox.png)

This is my current dashboard, and as you can see, I have one VM and one LXC container.

### The VM - TrueNAS
The beauty of Proxmox is that you can virtualize any OS you want without needing to install it on any device. This means you can run a host like a pfSense firewall, OpenWRT router, or a NAS OS like UnRaid, or in my case - TrueNAS Scale.

TrueNAS Scale (im just gonna call it TrueNAS) is a NAS or Network Attached Storage system. It allows you provide a storage server on your network, and give the storage on it redundancy with RAID-1 or RAID-5 or something of the sort. 

If I had multiple disks I would pass them through proxmox to TrueNAS and configure them in a RAID array and then share that storage space over the network with SMB or NFS. In my case I only have the SSD that Proxmox is installed on, so I created a partition and just passed that through to TrueNAS. 

### The LXC Container - Debian
In addition to TrueNAS, I wanted something to run all of my docker services on. My one complaint about Proxmox is that running docker on the actual Proxmox host is a pain, so it's better to create a container and run your docker containers in that. Nested virtualization!

LXC is a kind of Linux container that shares the same kernel as the hypervisor, but everything else is virtualized. This gives it much better performance compared to a traditional VM. In my case, Debian is the OS running in the LXC container. 

Installed on this Debian LXC container is docker containers including a bunch from my [previous home server build](/_posts/2022-12-12-home-server.md). At the moment, this includes:

- Minecraft Server 1
- Minecraft Server 2
- [A Discord Bot](https://github.com/Soulsender/frong-bot)
- [Custom Minecraft Server Query Program](https://github.com/Soulsender/mc-query)
- [Dashboard](https://gethomepage.dev)

![](/images/home-server-v2/homepage.png)

### Virtual Network Traffic Forwarding
Instead of port forwarding my home router, I run a reverse proxy in the cloud which sends traffic through a tailscale tunnel to the Proxmox host. Proxmox then forwards that traffic through a virtual network to the Debian LXC container so it can reach the minecraft server. This is done via a couple iptables rules.

Cloud VPS Reverse Proxy:
```bash
# forward incoming traffic to ip and port
iptables -t nat -A POSTROUTING -d 100.123.123.234 -p tcp --dport 25565 -j MASQUERADE
iptables -t nat -A PREROUTING -i tailscale0 -p tcp --dport 25565 -j DNAT --to-destination 100.123.123.234:25565
netfilter-persistent save

# allow device to forward traffic on this interface
echo "net.ipv4.conf.tailscale0.forwarding=1" | tee -a /etc/sysctl.conf
sysctl -p
```

Proxmox Host (example for Minecraft Server 1):
```bash
# advertise virtual network on tailscale
tailscale up --advertise-routes=192.168.100.0/24

# forward incoming traffic to ip and port
iptables -t nat -A POSTROUTING -d 192.168.100.101 -p tcp --dport 25565 -j MASQUERADE
iptables -t nat -A PREROUTING -i vmbr0 -p tcp --dport 25565 -j DNAT --to-destination 192.168.100.101:25565
netfilter-persistent save

# allow device to forward traffic on this interface
echo "net.ipv4.conf.vmbr0.forwarding=1" | tee -a /etc/sysctl.conf
sysctl -p
```
