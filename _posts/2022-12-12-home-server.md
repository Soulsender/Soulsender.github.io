---
layout: post
title:  "Running a Laptop Home Server"
date:   2022-12-12
categories: server
---

## Old electronics.

Many people just have old electronics lying around their house collecting dust. Once they get a new laptop or tablet, what use are old devices? Well, there are plenty of different things you can do with them once they've expired past their best before date. One of which is using it as a server.

## Table Of Contents
- [Wait, A Server?](#server)
- [Step 1: Installing and Configuring Ubuntu Server](#ubuntu)
    - [Initial System Checks](#syschecks)
    - [Creating a Static IP](#addressing)
    - [Laptop Server Tricks](#laptop)
    - [Tailscale Mesh VPN](#tailscale)
- [Step 2: Services](#services)
    - [Portainer Docker Container Manager](#portainer)
    - [Jellyfin Media Server](#jellyfin)
    - [Samba File Sharing](#samba)
    - [Server Homepage](#homepage)
    - [Minecraft Server](#minecraft)

### Wait, A Server? {#server}

Yeah. A server doesn't have to be this absolute monster of a machine with 256GB of RAM and fancy SSDs and HDDs. Nope, all it needs to be is a computer that runs some kind of server operating system—such as Windows Server, some variant of Linux, BSD, or any other miscellaneous OS depending on your project such as unRaid or TrueNAS.

In my case, I chose [Ubuntu server 22.04](https://ubuntu.com/download/server). I chose it because it is relatively lightweight, easy to set up, and includes drivers for many things on the device. I considered Proxmox as well, but decided to stick with Ubuntu server which I will set up to use [Portainer](https://www.portainer.io/)—a web GUI for managing docker containers.

#### Hardware

The device I am using is an old Dell Inspirion that my friend graciously gave to me. The screen is falling apart, and you can see the exposed wiring behind the screen, which is a little iffy. One of the corners is smashed up as well. Fortunately, it works great for our use case, as I will not really be using the display for anything aside from the installation of Ubuntu server. The laptop itself has 8GB of RAM, an Intel i3-8145U (2 cores, 4 threads), and a 256GB SSD, as well as an Ethernet port which is great, and not something you find often on laptops anymore.

> As of August 2023, I'm now using an older enterprise Dell Optiplex 5055 as my server. However, much of the same process and steps are the same. I still urge you to use whatever old device you have lying around!

### Step 1: Installing Ubuntu server {#ubuntu}

#### The OS Installation

As per usual with any Linux distro, I had to mess with the system's BIOS before I could launch the installation media. This involves changing the boot order, making sure UEFI boot is enabled, and disabling secure boot.

> I tried to use a Ventoy USB to install Ubuntu server, but whenever I tried to boot it would cause a kernel panic and fail, so I instead just flashed the Ubuntu server ISO onto an 8GB flash drive I had and installed from that.

The installation was very straightforward, as Ubuntu server has a nice TUI installation interface. I wasn't sure about encrypting the drive at first, and I initially installed the OS without encryption—then I changed my mind and used full-disk LUKS encryption. The reason behind this was added security, but it came at the cost of needing to manually type in the password on the physical machine whenever it rebooted. I didn't see this as a huge issue, as the point of a server is to always be running anyway.

#### Initial System Checks {#syschecks}

Once the installation had finished, the machine booted to the very-friendly TTY prompt. I updated and upgraded the system, installed Docker (and Neofetch, of course), and checked my local IP address I had been assigned by my router.

`sudo apt update -y && sudo apt upgrade -y`
`sudo apt install docker.io neofetch`
`ip a`

> Be careful here, as sometimes Ubuntu will install the **snap** package version of Docker instead of the **apt** version. The snap version can cause some errors with Portainer. To me, this is the only issue with Ubuntu. If you need to fix this yourself, you can either download Docker via the official website instructions or by [removing snap](https://www.debugpoint.com/remove-snap-ubuntu/).

#### Creating a Static IP {#addressing}

I also had to configure the device to use a static IP that would not change. This would make it easier to isolate it on my network. To do this, you must edit the config file:

`/etc/netplan/00-installer-config.yaml`

and edit the respective interface config:

```yaml
network:
    ethernets:
        enp1s0:
        addresses: [192.168.1.70/24]
        gateway4: 192.168.1.254
        nameservers:
            addresses: [1.1.1.1, 8.8.8.8]
        dhcp4: false
    version: 2
```
<br>

- **ethernets**: This line defines that we will be using Ethernet instead of Wi-Fi.
- **enp1s0**: This is the name of the interface we will be using. You can get a list of these with the command `ip link`. Wireless interfaces will usually start with a W, and Ethernet interfaces will usually start with an E.
- **addresses**: This defines the actual static IP we would like to assign. In my case, it is "192.168.1.70". "/24" defines the subnet of the network, which is basically what IP addresses are allowed to be assigned.
- **gateway4**: This is the IP of the router we will use, also known as the gateway. You can find this with the command `ip route`.
- **nameservers**: These are the DNS servers you would like to use for your system. In this case, I have "1.1.1.1" and "8.8.8.8", which are Cloudflare and Google's DNS servers, although you are free to use a different one or even run your own!
- **dhcp4**: This just tells the system that we do not want to use DHCP to obtain our local IP address, but rather use the one we've already specified.

#### Laptop Tricks {#laptop}

Because this was a laptop, I wanted to be able to close the screen and not have to worry about it shutting down. Thanks to [TechHut](https://www.youtube.com/watch?v=HxvFuGnjoJo&t=1013s) for this. This is very easy to do and only requires a configuration change in:

`/etc/systemd/login.conf`

and set this:

```bash
HandleSuspendKey=ignore
HandleLidSwitch=ignore
```
<br>

Then simply reboot.

### Tailscale VPN

I wanted to access my server from outside my home. As it was right now, I would only be able to connect if I was on the LAN (Local Area Network). Generally, there are two solutions to this.

The first is port forwarding, which involves passing a port through your router to the big bad internet. This is great for something like a website but not so much for things like file sharing. I didn't want to do this, as anybody would be able to connect and attack my server, even with passwords and proper authentication. This left the other option.

A VPN (Virtual Private Network) is a remote way to connect to a LAN. I went over VPNs in more detail in my [Staying Hidden Guide](https://soulsender.me/blog/staying-hidden#vpns) post.

I have set up my own VPN using Wireguard in the past, but it is complicated and annoying, as you have to manually configure each device connecting. Instead, I am using a free and open-source service called [Tailscale](https://tailscale.com/). I really like this service because they create your very own VPN network between all of your devices automatically and also give you a special domain to use on that network. New devices can very easily be connected by downloading the client on that respective device and logging in. I have never been prompted to pay for any kind of premium, so I highly recommend this service.

Using this, my laptop, gaming PC, and phone can all talk to my server just by using the assigned IP or domain.

After installing the Tailscale Linux client on the server with a very simple install script:

`curl -fsSL https://tailscale.com/install.sh | sh`

I could do the necessary configurations for my Minecraft server I planned to set up. Tailscale allows you to "share" machines with other Tailscale users to allow them to access something on the server. I planned to share my server with my friends so they could join, but I didn't want them to be able to access **everything** on the server (zero trust method and all that).

Tailscale uses something called ACL or Access Control Lists. These are basically just config files that tell Tailscale what certain users and groups can access. In my case, I knew that only people that I shared the machine with were going to exclusively use the Minecraft server on it, and none of my other services.

> **The Zero Trust method** is a security technique where you only give users the **minimum amount of access** as per what is required of them. This means they do not have access to things that are not relevant to them. In my case, my friends would have no reason to access the Portainer UI, SSH, Samba, or any other service except my Minecraft server. This prevents unnecessary threat surface, as I know they cannot access SSH and therefore cannot attack it directly. Obviously, I didn't think my friends would purposely attack my server, but if malware were potentially on their device, it might be able to pivot to my server if I made some sort of configuration error.

Here is my ACL config:

```json
"acls": [
    {"action": "accept", "src": ["Soulsender@github"], "dst": ["*:*"],},
    {"action": "accept", "src": ["autogroup:shared"], "dst": ["thebeach:25565"],},
],
```

This basically says that I can access all machines and all ports (referenced by `*` meaning "everything" and `:` being the separator of host and port), and that anyone I've shared the machine with can only access port `25565` on the `thebeach` host.


## Part 2: Services

Now that the basics of my server were all set up and ready to go, it was time to start configuring the actual services that I will be using. The ones I decided to use were Portainer for Docker containers, Jellyfin for media, MeTube for video downloading, PiHole for adblocking, Samba for filesharing, Homepage for a homepage (don't you love naming conventions?), and Nextcloud for cloud utilities.

### Portainer

The first thing I set up was [Portainer](https://docs.portainer.io/start/install/server/docker/linux), as this would give me a graphical web interface to set everything else up. While you can manage containers via the command line, I decided to use Portainer because it would be easier to manage my containers, as I wouldn't have to SSH into my server every time I wanted to check or change something in a container's config.

Ironically, Portainer runs in a Docker container itself, so this would be the only one I would have to create through SSH. First was the Docker volume to store data:

`docker volume create portainer_data`

Next was the creation of the actual container. Don't worry, I'll walk through this command with you:

`docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ee:latest`

- **run** - this says that this is a container to be run.
- **-d** - this means we want to run this container as a "daemon" or "background process". This allows us to still have control of the terminal.
- **-p 8000:8000** and **-p 9443:9443** - this is the port mapping of 8000 to 8000. This means that port 8000 on the container will correspond to port 8000 on the host machine.
- **--name** - the name of the container.
- **--restart=always** - the restart policy of the container. This means that it will always be running and will always start on boot.
- **-v /var/run/docker.sock:/var/run/docker.sock** - this is a "bind" map to `/var/run/docker.sock` on both the container and host machine.
- **-v portainer_data:/data** - this is a "volume" map from the container's `/data` directory to the host volume of `portainer_data` that we created in the previous command.
- **portainer/portainer-ee:latest** - this is the actual image we are downloading and using.

Once this command has finished running, we can view the container at [http://192.168.1.70:8000](http://192.168.1.70:8000)! Of course, you won't see my Portainer instance, but if you've followed along and used the same local IP address and port I have, then you will see your own!

### Jellyfin

Jellyfin is a media server, which basically means that it can stream content such as MP3s and MP4s to your devices, much in the same way Netflix or Spotify works. Instead of downloading the content to the device you are using, you can just stream it from the server!

Now that I had Portainer set up, Jellyfin was even easier to set up because of the Portainer GUI. I am not going to explain exactly how to do the same steps with the CLI, as you can just view the above example with Portainer and change it as you see fit.

First, I set the image Docker would pull from. This was the `linuxserver/jellyfin:latest` image. I then mapped the container ports 7359 and 8096 to their counterparts on the host system, setting 7359 as UDP since it would be used for the actual stream of content, and 8096 as TCP, since it was used for the web interface the user interacts with.

For the actual content location, I mapped `/data/Videos` on the container to a bind on `/usr/share/jellyfin/videos`, and `/config` to a bind on `/etc`. All of these volumes were writable by the container.

Finally, I mapped the environment variables of `PUID=1000`, `PGID=1000`, and `TZ` to my timezone. I also set the restart policy to "unless stopped".

Keep in mind that if you have any kind of GPU in your server, you can also do some nice video transcoding.

### Samba

Samba, an iteration of the SMB or Server Message Block, is a local file-sharing protocol that computers can use to transfer files locally. This is very commonly used in tandem with Active Directory in an office. SMB was also the target of the famous [EternalBlue](https://en.wikipedia.org/wiki/EternalBlue) exploit (though newer versions of SMB, of course, do not have this problem).

I decided to configure SMB on my server, so I could remotely transfer video files to my Jellyfin server.

To do this, we first install Samba, and then configure it:

`sudo apt install samba`
`sudo nano /etc/samba/smb.conf`

My Samba configuration:

```yaml
[sambashare]
    path = /usr/share/jellyfin
    read only = no
    browsable = yes
    ntlm auth = true
```
<br>

Then all you had to do was open your file explorer and go to `smb://100.75.245.84`. Make sure to allow Samba through your firewall if you are using one like UFW.

`sudo ufw allow samba`

### Homepage

[Homepage](https://gethomepage.dev/en/installation/) (very creatively named btw) is a simple application that will host a customized dashboard of your various services running on your server. As with anything else in this build,