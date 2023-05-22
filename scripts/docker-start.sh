#!/usr/bin/env sh

# Replace API BASE URL
find '/usr/share/nginx/html' -name '*.js' -exec sed -i -e 's,API_BASE_URL,'"$API_BASE_URL"',g' {} \;
nginx -g "daemon off;"