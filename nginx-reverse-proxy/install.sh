#!/usr/bin/env bash

set -e

if sudo security find-certificate -c app.connect-four.dev > /dev/null 2>&1; then
  echo "Removing old certificate for 'app.connect-four.dev' from system keychain..."
  sudo security delete-certificate -c app.connect-four.dev
fi

echo "Adding trusted certificate for 'app.connect-four.dev' to system keychain..."
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain nginx-reverse-proxy/certs/app.connect-four.dev+2.pem
echo "Bingo bango! You're all set :]"

