# connect-four-app

A little [Conect Four](https://en.wikipedia.org/wiki/Connect_Four) app built using:

- [NestJS](https://nestjs.com/)
- [React](https://react.dev/)
- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/)
- [NGINX](https://nginx.org/en/docs/)

<img src="/assets/connect-four-app-demo_2025-08-04.gif" alt="Demo of Connect Four application with side-by-side browsers">

## Getting Started

🚧 **WIP** 🚧

### 1. Install local Node packages

```bash
nvm use
corepack enable
yarn install
```

### 2. Generate certs and other changes for NGINX

If you don't have `mkcert` installed already, install it. 🙂

```bash
brew install mkcert
# NOTE:
# If this is your first time using mkcert, you'll need to run it with
# the `-install` flag. This only needs to be done once, and it creates
# a local certificate authority against which we will create our own
# self-signed SSL certificates.
mkcert -install
```

If this is your first time going through the setup instructions, you will need to make the `install.sh` script executable.

```bash
chmod +x nginx-reverse-proxy/install.sh
```

Finally, run the script. 🙂

```bash
nginx-reverse-proxy/install.sh
```

### 3. Build and Start the Docker Containers

```bash
docker compose up --build --no-cache all -d
```

---

## Project Structure

<!-- ┃ ━ ┣ ┳ ┗ -->

```txt
connect-four-app
  ┣━━ 📁 server
  ┃    ┣━━ 📁 src
  ┃    ┗ Dockerfile
  ┣ docker-compose.yaml
  ┣ package.json
  ┗ yarn.lock
```

---

## Generating Certs

> **NOTE**: This actually might be overkill. 🙂 Seems like you can accomplish the same thing with fewer commands: [Using the magic of mkcert to enable valid https on local dev sites](https://dev.to/aschmelyun/using-the-magic-of-mkcert-to-enable-valid-https-on-local-dev-sites-3a3c)

### Using [`mkcert`](https://github.com/FiloSottile/mkcert)

```sh
cd nginx-reverse-proxy/certs
mkcert app.connect-four.dev
# The certificate is now at "./app.connect-four.dev.pem" and the key at "./app.connect-four.dev-key.pem"

mkcert -CAROOT
# /Users/<user>/Library/Application Support/mkcert

cat app.connect-four.dev.pem "$(mkcert -CAROOT)/rootCA.pem" > app.connect-four.dev.crt
cat app.connect-four.dev-key.pem "$(mkcert -CAROOT)/rootCA-key.pem" > app.connect-four.dev.key

# to remove temporary files
rm *.pem
```

### Using [`openssl`](https://github.com/openssl/openssl)

```sh
brew install openssl
cd nginx-reverse-proxy/certs/

# -----------------------------------------------------------------------------
#                  Generate private key to become local CA
# -----------------------------------------------------------------------------
# OpenSSL will ask for a passphrase, which we recommend not skipping and keeping
# safe. The passphrase will prevent anyone who gets your private key from generating
# a root certificate of their own.
openssl genrsa -des3 -out app.connect-four.dev.key 2048

# -----------------------------------------------------------------------------
#                          Generate root certificate
# -----------------------------------------------------------------------------
# You will be prompted for the passphrase of the private key you just chose and
# a bunch of questions. The answers to those questions aren’t that important. They
# show up when looking at the certificate, which you will almost never do. I suggest
# making the Common Name something that you’ll recognize as your root certificate in
# a list of other certificates. That’s really the only thing that matters.
openssl req -x509 -new -nodes -key app.connect-four.dev.key -sha256 -days 1825 -out app.connect-four.dev.pem
```

