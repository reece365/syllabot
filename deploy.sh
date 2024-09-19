cp src/chat/index.html src/chat/style.css public/chat
cp src/index.html src/404.html public
nvm use node
rollup --config rollup.config.js
firebase deploy