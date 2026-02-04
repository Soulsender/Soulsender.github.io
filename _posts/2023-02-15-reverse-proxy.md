---
layout: post
title:  "Building a Reverse Proxy"
date:   2023-02-15
categories: server
---

# Building a Reverse Proxy

Let Me Paint You a Picture.

You have some kind of service running in your homelab. Maybe it's a website, maybe it's some kind of file sharing application, maybe it's a minecraft server. Whatever the case, it's something you'd like to share with other people. To do this, you have a couple different options.

You could give people **access via VPN?** But that is hard to manage and is insecure since people can access anything on your network. Even with something like [Tailscale](https://tailscale.com) and ACLs, it can be cumbersome for users to install an entirely different application just to use something of yours.

Okay, well maybe you could **host it all in the cloud?** But hosting everything in the cloud can get really expensive, and it is more fun to host on your own premises.

Fine... well maybe you could **port forward that service?** But this means that you need to give users your IP address, which some people might not want to do since it can be *roughly* tracked to your location. Plus, it could make you susceptible to DDoS attacks.

### But What About a Reverse-Proxy?

A reverse proxy can help mitigate some of those concerns. Basically, how it works is that rather than connecting to the server you're trying to reach, you connect to a different server that forwards traffic between your client and the server.

Now I sort of lied earlier when I said that a reverse proxy fixes all the problems of hosting a service through NAT. You will still actually need a way for that reverse proxy to connect to the server on your premise. But don't worry! There is still a solution. Remember earlier when I mentioned giving users access to your service with a VPN? With this solution, you don't need the clients to have VPN access set up, you can just tunnel the traffic from the reverse proxy to the server, rather than from the client to the server.

In my case, I added my reverse proxy to my Tailscale tailnet and installed the Tailscale client on it. Then I used [Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) as the actual reverse proxy software. I did this by renting a very cheap linux cloud VM to get a public IP.

> You need a reminder on what Tailscale is and how I use it, be sure to check out [this post](https://soulsender.me/blog/2022/12/12/home-server.html) where I go into much more detail.

### Setting Up Nginx

Setting up Nginx is actually very easy. All you need to do is create a configuration file in `/etc/nginx/sites-available` and then create a symbolic link to `/etc/nginx/sites-enabled`. I'll link mine below.

Make sure that the Nginx daemon is enabled on startup and is running, and then you can generate an SSL certificate to get HTTPS on that subdomain using certbot. Make sure you add an A Record to your DNS settings that sets "subdomain" to the IP of your reverse proxy server.

The nginx configuration:
```
server {

	listen 80;
       	server_name server.soulsender.me;
	return 301 https://soulsender.me;
}
```

To get an SSL certificate:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d server.soulsender.me
```

### VPN
You need to establish a VPN tunnel to the server you wan to access with the reverse proxy. There are a couple different ways of doing this, but I recommend Tailscale or Wireguard.

### Port Forwarding Using iptables

```bash
#!/bin/bash

HOST="11.22.33.44"
PORT="25565"
INTERFACE="eth0"

# (optional) clear ALL rules in ALL tables
sudo iptables -F
sudo iptables -X
sudo iptables -t nat -F
sudo iptables -t nat -X
sudo iptables -t mangle -F
sudo iptables -t mangle -X
sudo iptables -t raw -F
sudo iptables -t raw -X

# (optional) reset default policies
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT

# Port 25565 forwarding
sudo iptables -t nat -A PREROUTING -i $INTERFACE -p tcp --dport $PORT -j DNAT --to-destination $HOST:$PORT
sudo iptables -A FORWARD -p tcp -d $HOST --dport $PORT -j ACCEPT
sudo iptables -t nat -A POSTROUTING -p tcp --dport $PORT -j MASQUERADE

# Save
sudo netfilter-persistent save
```

> If you're using a cloud VPS provider like AWS, make sure you allow the port through the dashboard firewall! 