# NGINX Reverse Proxy

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
