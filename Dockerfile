# 1. For build React app
FROM node:19-buster as app

# nginx
RUN apt update; apt install -y curl gnupg2 ca-certificates lsb-release && \
echo "deb http://nginx.org/packages/debian `lsb_release -cs` nginx" | tee /etc/apt/sources.list.d/nginx.list && \
curl -fsSL https://nginx.org/keys/nginx_signing.key | apt-key add -

RUN apt-get update && apt-get install -y nginx && apt-get clean

COPY nginx.conf /etc/nginx/
# Set working directory
WORKDIR /app
#
COPY package.json /app/package.json
# Same as npm install
RUN npm install
COPY . /app

RUN npm run build

CMD service nginx start
