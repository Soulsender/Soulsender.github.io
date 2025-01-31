---
layout: post
title:  "CDN with SSL and S3 Buckets"
date:   2025-01-31
categories: blog
---

# Mac Spoofing and Outplaying a System Admin

Today, as per usual, I was at school. I was working normally when all of a sudden - internet was cut to my laptop.

I run Linux on my laptop, and sometimes the network-manager does not initialize on boot. This is usually fine, I just need to restart the network daemon. This is a pretty simple and self-explanatory command:

```bash
sudo service network-manager restart
```

This command will restart the network manager daemon service run by systemd. I tried this (spoiler alert: it didn't work). The next thing I tried was flushing the DNS cache. This process is also very simple:

```bash
sudo systemd-resolve --flush-caches
resolvectl flush-caches
```

This didn't work either, so I tried one more thing. The MAC Address.

### What is a MAC Address?

MAC stands for Media Access Control address. Every device has a MAC address. A MAC address is used sort of like an IP address, but only on a local area network (LAN). Switches on a network deliver traffic to a device with the correct MAC address. This is done through the ARP (Address Resolution Protocol) which you can sort of think of like the DNS for MAC addresses. A MAC address consists of six hex values, seperated by dashes, periods, or colons. For example: `9C:6A:BD:07:B7:92` is an address I just made up.

Unlike IP addresses, MAC addresses are static and do not change (there are some exceptions but for the most part, they stay the same on all networks). A MAC address will have information about the vendor of the device. For instance, you might be able to tell that a device is an Apple or Dell product based on the MAC address.

### Why is this Important to Know?

Well, every device that connects to a WiFi network, via wireless or ethernet, will give that network its MAC address. This way, the network knows who to give requested traffic to. There are ways to **SPOOF** MAC addresses however, and that's the important part of this story. MAC spoofing is possible on pretty much all operating systems, even iPhones have a built-in way to use a separate MAC address than the real one. This is important to note.

After my discovery of my laptop's MAC address being blocked, I had the idea to generate a new, random address for my laptop. Using a very simple Linux command-line program called `macchanger`, you can generate and use random MAC addresses.

So I used this program to generate a new and random address for my device. It's very easy to do:

```bash
sudo macchanger -r wlp59s0
```

In this case, `wlp59s0` is the name of my wireless card. Usually this can be listed as `wlan0` or something else. You can look this up via the `ip link` command. Using this randomly-generated MAC address worked for a full 15 minutes! ...and then I got blocked again.

One thing that is important to note at this point in the story, is that organization networks work very differently from home networks (duh). This is because organization networks have many devices they need to maintain, such as printers, domain controllers for Windows Active Directory, the user computers, etc. In addition, sometimes they have a special login portal that is hosted locally on the router(s) on the network that asks clients to enter their username and password when they try to connect. Then, this information is stored in a database, and this way the IT admins know that the device with the MAC address of `11:22:33:AA:BB:CC` belongs to Debra the janitor or Ashley the student.

In the case of my school, the router was seeing me connect my computer with two different MAC addresses, but they were both under my user login so it blocked both.

### What Now?

Hm. Well, random MAC addresses didn't work, and my static one was blocked. After this, I tried using MAC addresses from different vendors, such as Apple and Cisco as I hoped the router wouldn't block devices that might be needed for the IT infrastructure, but no bueno. Then I remembered something. Remember that thing earlier how I was talking about how iPhones have a built-in MAC changer thing? I thought about this, and I realized that my phone hadn't been kicked off the network. This meant two things:

1. They only cared about my laptop's MAC.
2. I could steal the MAC address of my phone and use that to get internet, because it was already registered on the network under my user.

After copying and inputting my phone's MAC address into my laptop via:

```bash
sudo macchanger -m {the phone's mac address} wlp59s0
```

I restarted the network manager daemon, and BOOM. I had internet again. Because my iPhone was already registered on the network BEFORE I started messing with my laptop's MAC, it would not look suspicious at all - they would have no way to know the owner of the MAC address had changed. To the network, it was my phone - when in reality, it was my laptop. 

> PS: I got a message from my friend saying that he used this guide because his Linux device was blocked on a MILITARY network. :)