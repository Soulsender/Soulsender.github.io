---
layout: post
title:  "Hosting Content in VRChat"
date:   2024-08-02
categories: blog
---

# Hosting Content in VRChat

VR is fun.

It's a technology that can be more immersive to users and can help bridge the gap between the physical and virtual world. Using it, you can have more immersive experiences with other users than previously possible. What better way to use this tech than to watch something like a movie with your friend?

### What Some Smart People Have Done

There is a social VR "game" called VRChat, and in it, you can do many different things with your friends. It uses the Unity game engine, and similar to a platform like Roblox, users can create and upload their own content using a version of the C# programming language called Udon.

Now, some smarter people than me have figured out how to program media players into the game. These can stream YouTube and Twitch links, but also **media files** like mp4s and mkvs, straight from a server hosting them. Now you can imagine if you have some _definitely legally obtained media files of movies you definitely own_, you could stream them for your friends and yourself to watch in VR! Well, I'm going to tell you exactly how to do that in this blog post.

### What You're Going to Need

Now it's not as simple as hosting a web server and accessing your media files. **VRChat prevents unencrypted HTTP requests for security reasons**, so you're going to need both a domain and an SSL/TLS cert for that domain. I used a small DigitalOcean cloud VPS for my hosting. The web server I used was Nginx, just because I had it previously set up as a reverse proxy, and it already had HTTPS set up using Let's Encrypt and [certbot](https://github.com/certbot/certbot). There are plenty of tutorials on how to do this, but in brief:

- Link your domain name to your web server's public IP using an [A Record](https://www.cloudflare.com/learning/dns/dns-records/dns-a-record/). You can use either the root of the domain or a subdomain. In my case, I used **server.soulsender.me**.
- Generate an HTTPS cert, either manually or with [certbot](https://github.com/certbot/certbot).
- Configure your web server of choice to serve the directory of media files you have. In my case, using Nginx, you turn **autoindex on**. Here's my [example Nginx configuration file](https://gist.github.com/Soulsender/34783750b97ade0f760d431048cdd7f3). You can't just copy and paste the config; you need to generate the HTTPS keys.
- Upload your media files to your server if needed, using a tool like `scp`.
- Now you should be able to get an HTTPS direct link to your media files like **https://server.soulsender.me/example.mp4**

### Things You Need to Know

Now that's all you need to setup, but there are a couple additional things you need to know so you don't have to go through the same pain I did while troubleshooting.

- Enable "untrusted links" in your VRChat settings. This basically allows the game to contact any domain and not just the ones whitelisted by the developers.
- Sometimes using the "video" option on ingame media players would not stream audio, so you can use the "live" option instead. This doesn't seem to work any differently, as you can still pause the stream.
- Check what audio codec your media is using. I used VLC for this, under `Tools > Codec Information`. Stream 0 will be your video codec, and any streams after that will be your audio codecs. This won't be as much of a problem for newer media, but if you have older media files, and the sound ingame sounds too quiet or off, then convert your audio codec to stereo. You can use a tool like [ffmpeg](https://www.ffmpeg.org/) to do this with a command like 
`ffmpeg -i input.mkv -c:v copy -c:a aac -ac 2 output.mkv`.

- For additional information, check out [this link](https://creators.vrchat.com/worlds/udon/video-players/) on the offical website.

Have fun!
