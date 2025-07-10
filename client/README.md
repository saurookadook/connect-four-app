# ConnectFour UI

🚧 **Under Construction** 🚧

## Generating Certs

### Using [`mkcert`](https://github.com/FiloSottile/mkcert)

```sh
cd server/wss/certs
mkcert ts-app-playground -install
# The certificate is now at "./ts-app-playground.pem" and the key at "./ts-app-playground-key.pem"

mkcert -CAROOT
# /Users/<user>/Library/Application Support/mkcert

cat ts-app-playground.pem "$(mkcert -CAROOT)/rootCA.pem" > tls.crt
cat ts-app-playground-key.pem "$(mkcert -CAROOT)/rootCA-key.pem" > tls.key

# to remove temporary files
rm *.pem
```

### Using [`openssl`](https://github.com/openssl/openssl)

```sh
brew install openssl
cd server/wss/certs/

# -----------------------------------------------------------------------------
#                  Generate private key to become local CA
# -----------------------------------------------------------------------------
# OpenSSL will ask for a passphrase, which we recommend not skipping and keeping
# safe. The passphrase will prevent anyone who gets your private key from generating
# a root certificate of their own.
openssl genrsa -des3 -out tsAppPlayground.key 2048

# -----------------------------------------------------------------------------
#                          Generate root certificate
# -----------------------------------------------------------------------------
# You will be prompted for the passphrase of the private key you just chose and
# a bunch of questions. The answers to those questions aren’t that important. They
# show up when looking at the certificate, which you will almost never do. I suggest
# making the Common Name something that you’ll recognize as your root certificate in
# a list of other certificates. That’s really the only thing that matters.
openssl req -x509 -new -nodes -key tsAppPlayground.key -sha256 -days 1825 -out tsAppPlayground.pem
```

---

## FROM TEMPLATE

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

#### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
