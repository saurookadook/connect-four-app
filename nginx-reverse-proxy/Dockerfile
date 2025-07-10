FROM nginx:latest
COPY ./nginx-reverse-proxy/conf/app-connect-four.conf /etc/nginx/conf.d/app-connect-four.conf
COPY ./nginx-reverse-proxy/certs/ /etc/nginx/ssl/
EXPOSE 80 443
# ENTRYPOINT [ "/docker-entrypoint.sh" ]
# STOPSIGNAL SIGTERM
CMD [ "nginx", "-g", "daemon off;" ]
