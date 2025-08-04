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

🚧 **Under Construction** 🚧

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

## Scripts

There are a number of root-level scripts for working with each workspace:

```bash
yarn client:base
yarn server:base
yarn shared:base
```

### Seeding the Database

There are also scripts for seeding your local MongoDB instance.

```bash
# Just to make sure that the database container is running
docker compose up mongo -d

yarn server:ncs seed_db
```

> **Note**: `ncs` stands for 'nest commander script'

Other scripts supported by `server:ncs` can be found in the `server/src/scripts/commands/` directory.

### Running Tests

#### `client`

```bash
yarn client:test
```

#### `server`

```bash
yarn server:test
```

#### `shared`

```bash
yarn shared:test
```

## Project Structure

<!-- ┃ ━ ┣ ┳ ┗ 🐳 📦 📄 ⚙️ -->

```txt
connect-four-app
  ┣━━ 📁 client
  ┃    ┣━━ 📁 public
  ┃    ┣━━ 📁 src
  ┃    ┣ 🐳 Dockerfile
  ┃    ┣ 📦 package.json
  ┃    ┗ ⚙️ tsconfig.json
  ┣━━ 📁 server
  ┃    ┣━━ 📁 src
  ┃    ┣━━ 📁 test
  ┃    ┣ 🐳 Dockerfile
  ┃    ┣ 📦 package.json
  ┃    ┗ ⚙️ tsconfig.json
  ┣━━ 📁 shared
  ┃    ┣━━ 📁 src
  ┃    ┣ 🐳 Dockerfile
  ┃    ┣ 📦 package.json
  ┃    ┗ ⚙️ tsconfig.json
  ┣ 🐳 docker-compose.yaml
  ┣ 📦 package.json
  ┣ ⚙️ tsconfig.json
  ┗ 🔒 yarn.lock
```

---
