FROM nginx:latest
# COPY ./nginx-reverse-proxy/conf/app-connect-four.conf /etc/nginx/conf.d/app-connect-four.conf
# COPY ./nginx-reverse-proxy/certs/ /etc/nginx/ssl/
# COPY ../client/index.html /etc/nginx/html/index.html
EXPOSE 80 443
CMD [ "nginx", "-g", "daemon off;" ]
