forwarding traffic

```bash
tailscale up --advertise-routes=192.168.100.0/24

iptables -t nat -A POSTROUTING -d 192.168.100.101 -p udp --dport 25565 -j MASQUERADE
iptables -t nat -A PREROUTING -i tailscale0 -p udp --dport 25565 -j DNAT --to-destination 192.168.100.101:25565
iptables -t nat -A POSTROUTING -d 192.168.100.101 -p tcp --dport 25565 -j MASQUERADE
iptables -t nat -A PREROUTING -i tailscale0 -p tcp --dport 25565 -j DNAT --to-destination 192.168.100.101:25565
netfilter-persistent save

echo "net.ipv4.conf.tailscale0.forwarding=1" | tee -a /etc/sysctl.conf
sysctl -p
```
