---
layout: post
title:  "Quick CDN"
date:   2024-08-02
categories: blog
---

# Quick CDN

To create a public accessible CDN, I used a small DigitalOcean cloud VPS for my hosting. The web server I used was Nginx, just because I had it previously set up as a reverse proxy, and it already had HTTPS set up using Let's Encrypt and [certbot](https://github.com/certbot/certbot). There are plenty of tutorials on how to do this, but in brief:

- Link your domain name to your web server's public IP using an [A Record](https://www.cloudflare.com/learning/dns/dns-records/dns-a-record/). You can use either the root of the domain or a subdomain. In my case, I used `server.soulsender.me`.
- Generate an HTTPS cert, either manually or with [certbot](https://github.com/certbot/certbot).
- Configure your web server of choice to serve the directory of media files you have. In my case, using Nginx, you turn `autoindex on`. Here's my [example Nginx configuration file](https://gist.github.com/Soulsender/34783750b97ade0f760d431048cdd7f3). You can't just copy and paste the config; you need to generate the HTTPS keys.
- Upload your media files to your server if needed, using a tool like `scp`.
- Now you should be able to get an HTTPS direct link to your media files like `https://server.soulsender.me/example.mp4`

### Things You Need to Know

Now that's all you need to setup, but there are a couple additional things you need to know so you don't have to go through the same pain I did while troubleshooting.

- Enable "untrusted links" if needed. This basically allows the game to contact any domain and not just the ones whitelisted by the developers.
- Sometimes using the "video" option on ingame media players would not stream audio, so you can use the "live" option instead. This doesn't seem to work any differently, as you can still pause the stream.
- Check what audio codec your media is using. I used VLC for this, under `Tools > Codec Information`. `Stream 0` will be your video codec, and any streams after that will be your audio codecs. This won't be as much of a problem for newer media, but if you have older media files, and the sound ingame sounds too quiet or off, then convert your audio codec to stereo. You can use a tool like [ffmpeg](https://www.ffmpeg.org/) to do this with a command like 

```
ffmpeg -i input.mkv -c:v copy -c:a aac -ac 2 output.mkv
```

- For additional information, check out [this link](https://creators.vrchat.com/worlds/udon/video-players/) on the offical website.

Have fun!
