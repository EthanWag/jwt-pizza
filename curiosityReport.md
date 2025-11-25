# Curiosity Report: Exploring Docker Networks, Bridges, and Docker Compose

For my curiosity report, I decided to dive deeper into Docker containers and how they work. I use Docker regularly at work, but I realized I had never really stopped to understand what’s happening under the hood—especially when it comes to networking. As I researched, I focused on three main areas: Docker networks, bridge drivers, and Docker Compose.

To learn these concepts, I followed a very helpful online tutorial, which you can find here: https://docker-curriculum.com/#webapps-with-docker
. This report walks through what I learned and reproduces the experiments I ran.

## Background: Why Docker Networking Matters

Docker containers often need to communicate with one another—databases talking to APIs, APIs talking to frontends, and so on. To support this, Docker includes a built-in networking system that automatically creates network interfaces for containers.

When you create a container, Docker typically attaches it to the default bridge network unless another network is specified.

To see my existing networks, I ran:

```
(base) MacBook-Pro-763:jwt-pizza ethanwagstaff$ docker network ls
NETWORK ID      NAME      DRIVER    SCOPE
d1c616d08e60    bridge    bridge    local
b2c3c319096d    host      host      local
4d017f6507a0    none      null      local
```

These three networks (bridge, host, and none) are created automatically with Docker. The bridge network is the default and is the one most containers use to communicate unless configured otherwise.

Creating My Own Docker Network

To experiment further, I created a custom Docker network:

```
(base) MacBook-Pro-763:jwt-pizza ethanwagstaff$ docker network create foodtrucks-net
076953d8cf9fbb72931ee8cfac0dcb5709d932d719444253d805bfa5f0b92b1e
```

Checking my networks again:

```
(base) MacBook-Pro-763:jwt-pizza ethanwagstaff$ docker network ls
NETWORK ID      NAME             DRIVER    SCOPE
d1c616d08e60    bridge           bridge    local
13f857ba6339    foodtrucks-net   bridge    local
b2c3c319096d    host             host      local
4d017f6507a0    none             null      local
```

With the network now created, I inspected it:

```
docker network inspect foodtrucks-net
```

This returned a detailed JSON describing how Docker configured the network:

```
[
  {
    "Name": "foodtrucks-net",
    "Id": "076953d8cf9fbb72931ee8cfac0dcb5709d932d719444253d805bfa5f0b92b1e",
    "Created": "2025-11-25T14:50:47.637282638Z",
    "Scope": "local",
    "Driver": "bridge",
    "EnableIPv4": true,
    "EnableIPv6": false,
    "IPAM": {
      "Driver": "default",
      "Options": {},
      "Config": [
        {
          "Subnet": "172.22.0.0/16",
          "Gateway": "172.22.0.1"
        }
      ]
    },
    "Internal": false,
    "Attachable": false,
    "Ingress": false,
    "ConfigFrom": {
      "Network": ""
    },
    "ConfigOnly": false,
    "Containers": {},
    "Options": {},
    "Labels": {}
  }
]
```

## What I Found Interesting

What stood out to me was how much detail Docker provides—especially the IPAM (IP Address Management) section. It defines the subnet that containers on this network can use (in this case, 172.22.0.0/16) and specifies the default gateway (172.22.0.1).

This means containers on this network can be assigned any IP between 172.22.0.0 and 172.22.255.255, which gives Docker a huge amount of flexibility for internal communication. I guess for me, it shows me how large these applications can be on docker and that it's more than developement tool used during developement. 

## Docker Compose

After experimenting with manual container networking, I moved on to Docker Compose, which lets you define multi-container systems in a single configuration file. Compose automatically creates networks and assigns containers to them, which makes it ideal for larger applications.

Below is the docker-compose.yml file I used in my test environment:

```
version: "3"
services:
  es:
    image: docker.elastic.co/elasticsearch/elasticsearch:6.3.2
    container_name: es
    environment:
      - discovery.type=single-node
    ports:
      - 9200:9200
    volumes:
      - esdata1:/usr/share/elasticsearch/data
  web:
    build: . # wethans/foodtrucks-web
    command: python3 app.py
    depends_on:
      - es
    ports:
      - 5001:5000
    volumes:
      - ./flask-app:/opt/flask-app
volumes:
    esdata1:
      driver: local
```

This Compose file defines two services:

es — an Elasticsearch container

web — a Python Flask application that depends on Elasticsearch

The Compose system automatically creates a network and connects the two containers to it. The ports are mapped so I can access:

Elasticsearch on localhost:9200

The Flask app on localhost:5001

I started everything with:

```
docker-compose up
```

The result:

```
[+] Running 2/2
 ✔ Container es                  Running
 ✔ Container foodtrucks-web-1    Running
Attaching to es, foodtrucks-web-1
```

Compose takes care of networking behind the scenes, ensuring these two containers can communicate seamlessly.

## Final Thoughts

Overall, this was an interesting and relevant exploration into DevOps tooling. Multi-container applications are extremely common in real-world software, and understanding how containers communicate is essential for debugging, deploying, and scaling applications.

This small deep dive helped me understand Docker’s networking model much more clearly, and I feel more confident working with multi-service applications at work. I’m glad I took the time to explore something I use frequently but had never fully examined.
