# Neuradix Website

Static marketing website for **Neuradix** (`www.neuradix.com`).

Neuradix is a product brand developed by Busuttil Technologies Limited. This repository is intentionally separate from the Busuttil Technologies company website and is designed to be hosted on the same Nginx server without sharing a document root or site configuration.

## Repository layout

```text
site/                   Public web root served by Nginx
  index.html
  assets/
  atlas/
  origin/
  robotics/
  about/
  contact/
  legal/
  robots.txt
  sitemap.xml

deployment/             Server/deployment material; not web-accessible
  DEPLOYMENT.md
  nginx-http.conf
  nginx-https.conf
```

## Production deployment

Clone the repository once on the web server:

```bash
sudo git clone https://github.com/KevinBusuttil/neuradix_website.git /var/www/neuradix_website
```

Nginx must use only the `site` directory as its document root:

```nginx
root /var/www/neuradix_website/site;
```

This keeps `.git`, this README, and the deployment configuration outside the public document root.

For subsequent website updates:

```bash
cd /var/www/neuradix_website
sudo git pull --ff-only
```

No build step is required; the site is plain HTML, CSS and JavaScript.

See [`deployment/DEPLOYMENT.md`](deployment/DEPLOYMENT.md) for the cautious first-time deployment procedure and Nginx configuration.

## Safety boundary

The Neuradix Nginx virtual host must use only:

```text
www.neuradix.com
```

and must not modify or reuse the existing Busuttil Technologies document root or Nginx server block. Client DNS records under `*.neuradix.com` are independent and must not be changed as part of this website deployment.

## Ownership

Copyright © 2026 Busuttil Technologies Limited. All rights reserved.
