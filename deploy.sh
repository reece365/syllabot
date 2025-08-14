mkdir -p public/chat public/management public/landing public/auth

# Copy HTML/CSS for each app section
cp src/chat/index.html src/chat/style.css public/chat
cp src/management/index.html src/management/style.css public/management
cp src/landing/index.html src/landing/style.css public/landing
cp src/auth/index.html src/auth/style.css public/auth

# Make landing the root index
cp src/landing/index.html public/index.html
cp src/404.html public

# Copy shared assets
cp src/send.svg src/syllabot-favicon.svg src/syllabot-wordmark-light.svg public/

nvm use node
rollup --config rollup.config.js
firebase deploy