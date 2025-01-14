---
layout: post
title:  "Learning Rust"
date:   2025-01-14
categories: blog
---

I wanted to learn a lower level programming language, as the language I'm the most familiar with is Python, which is interpreted and rather slow. I decided on learning rust, because my partner started learning it, and it is a modern alternative to something like C.

### What Makes Rust Special?
Rust is special because due to how it was created, it makes is impossible for any undefined behaviour to take place.

In traditional lower level languages like C, the programmer had to manually manage memory allocated and deallocated. This opens up room for a lot of human error, as you don't want the program trying to access memory that is/isn't supposed to exist. This can cause security issues, and behaviour that wasn't intended.

In other languages like Python, the computer automatically allocates and deallocated memory through a system called "garbage collection." While this is helpful, it is slow and inefficent. Rust was created to overcome these issues.

### How Rust Handles it
Rust handles these problems by using a system of "ownership." Basically, memory is only allocated and deallocated within the scope of code block. This can be a function, struct, etc. It also forces the programmer to define what happens when something fails, and provide steps to fix it, or just panic the program.

[You can my current Rust projects on github!](https://github.com/Soulsender?tab=repositories&q=&type=&language=rust&sort=)