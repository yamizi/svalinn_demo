FROM node:18 as builder

WORKDIR /app

COPY package*.json /app/

# RUN npm config set legacy-peer-deps true

RUN npm install --force

COPY ./ /app/

RUN npm run build

FROM nginx:latest

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build/ .

COPY /nginx.conf /etc/nginx/conf.d/default.conf
COPY /nginx-selfsigned.crt /etc/nginx/ssl/selfsigned.crt
COPY /nginx-selfsigned.key /etc/nginx/ssl/selfsigned.key