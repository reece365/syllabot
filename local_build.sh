cp src/404.html src/index.html public/
mkdir -p public/management public/auth public/landing
cp src/management/index.html src/management/style.css public/management
cp src/auth/index.html src/auth/style.css public/auth
cp src/landing/index.html src/landing/style.css public/landing
rollup --config rollup.config.js