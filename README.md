The Moviegoer Web App
---------------------

### Development

Be sure to use `nvm install node` to install the latest version of node.

In MySQL, create a database called `MOVIEGOER`, and create a user `moviegoeradmin`. Give the user all permissions on the database. In a directory called `json`, create a file `mysqldb.json` like:
```
{
  "connectionLimit" : 10,
  "host" : "HOST_NAME",
  "user" : "moviegoeradmin",
  "password" : "PASSWORD",
  "port" : "3306",
  "database" : "MOVIEGOER"
}
```
Additionally, create a file `aws.json` in the `json` directory like:
```
{
  "accessKeyId": "ACCESS_KEY",
  "secretAccessKey": "SECRET_ACCESS_KEY"
}
```
Then, run the following commands:
```
$ npm install
$ npm run db-sync
$ npm run client (in one terminal)
$ npm run server (in another terminal)
```
The site will be running at [http://localhost:8000](http://localhost:8000).

#### AWS architecture

S3 bucket | Contents
----------|----------
`moviegoer`| All image uploads, e.g., `moviegoer/uploads/[articleId or username]/[randomly generated string].jpg`
`moviegoer-images`|Upon an object creation in the `moviegoer` bucket, a Lambda function resizes that image into 800, 600, 400, and 200 pixels wide, and places the resized images in the `moviegoer-images` bucket, e.g., `moviegoer-images/uploads/[articleId or username]/[original random string]-[800/600/400/200]w.jpg`. This bucket forms the basis for a Cloudfront distribution.
`moviegoer-db-backups`| Every night, a gzipped dump of the MySQL database is placed into the `moviegoer-db-backups` bucket, e.g., `moviegoer-db-backups/%Y-%m-%d.sql.gz`.

#### Testing

Install [http://casperjs.org/](CasperJS) and [https://slimerjs.org/](SlimerJS) globally.
```
$ npm install -g casperjs slimerjs
$ npm run db-sync
$ npm run client (in one terminal)
$ npm run server (in another terminal)
```
As a user with admin privileges, use your username and password to run the tests:
```
$ casperjs test tests/index.js --engine=slimerjs --username=my_username --password=my_password (in yet another terminal)
```


### Production

Set the server's environment variable SECRET to a random string.

```
$ npm run deploy
```
This assumes that an Nginx instance is running that proxies requests for [https://pennmoviegoer.com](https://pennmoviegoer.com) to [http://localhost:8000](http://localhost:8000). A typical configuration in `/etc/nginx/sites-available/moviegoer.conf` (symlinked to `/etc/nginx/sites-enabled/moviegoer.conf`):
```
server {
  listen 80;
  server_name pennmoviegoer.com;
  return 301 https://pennmoviegoer.com$request_uri;
}

server {
  server_name www.pennmoviegoer.com;
  return 301 https://pennmoviegoer.com$request_uri;
}

server {
  listen 443 ssl;
  server_name         pennmoviegoer.com;
  ssl_certificate     /etc/letsencrypt/live/pennmoviegoer.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/pennmoviegoer.com/privkey.pem;
  include snippets/ssl-params.conf;

  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-NginX-Proxy true;
    proxy_pass http://localhost:8000/;
    proxy_ssl_session_reuse off;
    proxy_set_header Host $http_host;
    proxy_cache_bypass $http_upgrade;
    proxy_redirect off;
  }
}
```
where `ssl-params.conf` resides in `/etc/nginx/snippets/ssl-params.conf`:
```
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
ssl_ecdh_curve secp384r1;
ssl_session_cache shared:SSL:10m;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;

ssl_dhparam /etc/ssl/certs/dhparam.pem;
```