# Dockerfile
FROM node
MAINTAINER nashorn74 

RUN mkdir /app
ADD . /app
WORKDIR /app

CMD ["node", "bin/www"]