---
layout: post
title:  "How to Force Kill a Hyper-V VM"
date:   2024-08-02
categories: tutorial
---

# How to Force Kill a Hyper-V VM

I had an assignment in class recently where I was tasked with forcably killing a virtual machine stuck in a stopping state. I decided to write this quick guide because I couldn't find a clear answer on how to do it easily using only the command line.

### Step 1

The first thing to do it get the GUIDs of each VM. You can do this with:

```pwsh
Get-VM | FT VMName,VMID
```

This will list out the name of the VMs you have, and their GUID (aka VMID). Note down the name of the GUID of the VM you want to kill.

### Step 2

The next thing to do is get the process ID of the VM to kill. You can do this by typing `tasklist /v`. Look for the `vmwp.exe` (virtual machine worker process) process with the user `NT VIRTUAL MACHINE\GUID` where the GUID is the ID of the VM you got in the first step. If you have multiple VMs running, make sure to find the correct one with the corresponding GUID.

### Step 3

The process ID of the VM you want to kill will be just to the right of the executable name (in this case `vmwp.exe`) for example, I'll say it's `5044`.

To kill this process, you can type:

```pwsh
Stop-Process 5044 -force
```
which will forcibly kill the VM process.