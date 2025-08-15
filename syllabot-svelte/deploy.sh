#!/bin/bash
set -e

# Build SvelteKit static site to public/
echo "Building SvelteKit static site..."
npm run build

# Firebase deploy
if ! command -v firebase &> /dev/null; then
  echo "Firebase CLI not found. Please install it with 'npm install -g firebase-tools' and login with 'firebase login'."
  exit 1
fi

echo "Deploying to Firebase Hosting..."
firebase deploy --only hosting
