FROM node:14
ENV TZ=Asia/Shanghai
WORKDIR /root/nodejs
COPY . /root/nodejs
CMD node /root/nodejs/bin/www
EXPOSE 80
