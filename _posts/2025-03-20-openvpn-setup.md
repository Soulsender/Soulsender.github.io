---
layout: post
title:  "Setting up Self-Signed OpenVPN With AWS"
date:   2025-03-20
categories: blog
---

### Step 1: Generate Certificates
We need a server certificate and a client certificate. They will both be self signed in this case.

```
easyrsa init-pki
easyrsa build-ca nopass
easyrsa build-server-full server.com nopass
easyrsa build-client-full client.vpn nopass
```

### Step 2: Import Certificates
Import the server certificate public and private keys, and the `ca.crt` certificate chain because this is self signed into ACM.
```
aws acm import-certificate \
    --certificate file:///tmp/aws-vpn/server.com.crt \
    --private-key file:///tmp/aws-vpn/server.com.key \
    --certificate-chain file:///tmp/aws-vpn/ca.crt
```

### Step 3: Create Endpoint
We use the server certificate for both the server and client cert for the endpoint because it is self signed.

Once the endpoint is created, associate it to the subnet you want, and allow clients to reach the subnet.

I used TCP 443 for mine.

> You can use either the CLI or the web GUI for these steps.

```
export RCS_VPCID={YOUR TARGET VPC}
export SERVER_DOMAIN=server.com

aws ec2 create-client-vpn-endpoint \
    --client-cidr-block "10.255.0.0/22" \
    --server-certificate-arn $(aws acm list-certificates --query 'CertificateSummaryList[?DomainName==`'$SERVER_DOMAIN'`].CertificateArn' --output text) \

aws ec2 associate-client-vpn-target-network \
    --client-vpn-endpoint-id $(aws ec2 describe-client-vpn-endpoints --query 'ClientVpnEndpoints[0].ClientVpnEndpointId' --output text) \
    --subnet-id $(aws ec2 describe-subnets --query 'Subnets[?VpcId==`'$RCS_VPCID'` && Tags[?Value==`public`]].SubnetId | [0]' --output text)

aws ec2 authorize-client-vpn-ingress \
    --client-vpn-endpoint-id $(aws ec2 describe-client-vpn-endpoints --query 'ClientVpnEndpoints[0].ClientVpnEndpointId' --output text) \
    --target-network-cidr "10.0.0.0/16" \
    --authorize-all-groups
```

### Step 4: Create Client Configuration
Download the client configuration from the endpoint. You must add the client private and public certificate keys.

You have to add `<cert>` and `<key>` tags in the configuration file to reference your client certificate.

Mine looks like this:

```
client
dev tun
proto tcp
remote cvpn-endpoint-0c6fc674764186d6a.prod.clientvpn.us-east-1.amazonaws.com 443
remote-random-hostname
resolv-retry infinite
nobind
remote-cert-tls server
cipher AES-256-GCM
verb 3

<ca>
-----BEGIN CERTIFICATE-----
signingca
-----END CERTIFICATE-----
</ca>


<cert>
-----BEGIN CERTIFICATE-----
clientpubkey
-----END CERTIFICATE-----
</cert>


<key>
-----BEGIN PRIVATE KEY-----
clientprivkey
-----END PRIVATE KEY-----
</key>

reneg-sec 0
verify-x509-name server.com name
```

For more information see [Monkut - Prepare AWS Client VPN](https://gist.github.com/monkut/16d79d98752039c0e36dcb0dbcb0a9b8)
