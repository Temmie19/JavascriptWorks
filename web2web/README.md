# web2web
Server-less & domain-less websites updatable via torrents and ethereum blockchain.
Original idea by [elendirx](https://github.com/elendirx/web2web/)


### Why
Websites get seized by losing control over a webserver or a domain.
If we replace both the webserver and the domain with [torrents](https://webtorrent.io) and [blockchain](https://ethereum.org/en/) then there's nothing left to seize. Granted, this is really only good for static sites that can't remember you as a user directly. However, that doesn't mean the sites themselves can't be updated.


## How It Works
This repo contains two HTML files:

+ `index.html` is responsible for loading the webpage from torrent,
+ `ExampleDomain.html` is the actual webpage.


When you open `index.html` in the browser, here's what happens:


1. You are presented with a whole browser like interface to run and connect to sites as you would normally.
2. You can then use a magnet link or torrent hash to download said torrent and embed the webfile in your browser window.
3. Any "connected" user becomes another link in the mesh that other people can download websites from, further improving the persistance of said website.


### How Is It Updated
Currently it is only manual changes, however a script could be added with the base site to check for brand new information through the blockchain. For example, a user could send themselves a transaction of 0 ETH with an attached message and the script would take note of that, try to decrypt the message it holds, before recognizing it as a new blog post and updating the downloaded HTML with the new post.


### How Is It Domainless
The "domains" are actually the torrent magnet links or hash numbers. They aren't directly any domain name you buy and have to upkeep to point back to the site's files.


## What Next
### User Additions
Hub sites could have auto updating areas where people can pay the original owner a certain price to have an account made where the script goes and searches that person's Ether wallet for 0 ETH self transactions that have magnet links to whatever sites they feel like having on their profile picture. Further creating a mesh of torrent based sites that people can browse and use.

## Project Status
Proof of concept, just for fun. Might work more on in the future.





