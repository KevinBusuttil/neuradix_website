# Neuradix website deployment

This procedure is intentionally conservative because the same server also hosts the Busuttil Technologies website. The Neuradix site uses its own Git working tree, document root and Nginx virtual host.

## Production layout

```text
/var/www/neuradix_website/        Git working tree
├── .git/                         never served by Nginx
├── README.md                     never served by Nginx
├── deployment/                   never served by Nginx
└── site/                         ONLY public document root
```

Nginx serves:

```text
root /var/www/neuradix_website/site;
server_name www.neuradix.com;
```

Do not change the existing Busuttil Technologies document root or server block.

## 1. Back up and inspect Nginx

Before installing anything:

```bash
sudo cp -a /etc/nginx /etc/nginx.backup-$(date +%Y%m%d-%H%M%S)
sudo nginx -T > ~/nginx-before-neuradix.txt
sudo nginx -t
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/
```

Do not continue if `sudo nginx -t` fails before the Neuradix changes.

## 2. Clone the website

```bash
sudo git clone https://github.com/KevinBusuttil/neuradix_website.git /var/www/neuradix_website
sudo chown -R "$USER":www-data /var/www/neuradix_website
find /var/www/neuradix_website/site -type d -exec chmod 755 {} \;
find /var/www/neuradix_website/site -type f -exec chmod 644 {} \;
```

Because Nginx points to `site/`, neither `.git` nor `deployment/` is web-accessible.

## 3. Install the HTTP-only Nginx virtual host

```bash
sudo cp /var/www/neuradix_website/deployment/nginx-http.conf /etc/nginx/sites-available/neuradix
sudo ln -s /etc/nginx/sites-available/neuradix /etc/nginx/sites-enabled/neuradix
sudo nginx -t
```

Only after the syntax test succeeds:

```bash
sudo systemctl reload nginx
```

This adds a new host; it does not replace or edit the BTL host.

## 4. Test both virtual hosts before DNS changes

Test Neuradix locally on the server:

```bash
curl -I -H 'Host: www.neuradix.com' http://127.0.0.1/
```

Then verify BTL still routes through its existing virtual host:

```bash
curl -I -H 'Host: www.busuttil-technologies.com' http://127.0.0.1/
```

Also run:

```bash
sudo nginx -t
```

Do not change DNS unless these tests behave as expected.

## 5. DNS

The Neuradix client subdomains must not be changed.

For the website, replace the existing `www` CNAME with:

```text
Type:  A
Name:  www
Value: 164.92.154.249
```

The locked apex A records remain untouched. Configure GoDaddy forwarding separately so `neuradix.com` redirects to `https://www.neuradix.com` after the `www` site is live and HTTPS is working.

Do not modify the explicit client/system records such as `btl.erp`, `ccj.erp`, `grixti.erp`, `isnack.erp`, or `mail.ccj`.

## 6. Obtain the certificate

After `www.neuradix.com` resolves to `164.92.154.249` and the HTTP site works:

```bash
sudo certbot certonly --webroot \
  -w /var/www/neuradix_website/site \
  -d www.neuradix.com
```

Using `certonly --webroot` avoids allowing Certbot to rewrite unrelated Nginx server blocks.

## 7. Enable HTTPS

Replace only the Neuradix site configuration:

```bash
sudo cp /var/www/neuradix_website/deployment/nginx-https.conf /etc/nginx/sites-available/neuradix
sudo nginx -t
sudo systemctl reload nginx
```

Verify:

```bash
curl -I https://www.neuradix.com/
curl -I https://www.busuttil-technologies.com/
```

## Updating the website later

No build step is required. Pull the latest committed static files:

```bash
cd /var/www/neuradix_website
git status --short
git pull --ff-only
```

Changes under `site/` become live immediately because Nginx serves that directory directly.

If a future update changes an Nginx configuration under `deployment/`, `git pull` alone intentionally does **not** modify `/etc/nginx`. Apply such infrastructure changes separately, test with `sudo nginx -t`, then reload Nginx.

## Rollback

To roll the website files back to a known commit:

```bash
cd /var/www/neuradix_website
git log --oneline -10
git checkout <known-good-commit> -- site/
```

For a permanent rollback, create a proper revert commit in GitHub and then pull it on the server.
