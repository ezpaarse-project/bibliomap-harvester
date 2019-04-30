FROM node:10.15

# install yarn (faster than npm...)
RUN npm config set strict-ssl false
RUN apt-get update && apt-get install -y apt-transport-https

# install npm dependencies
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install && npm cache clear

# copy the code source
# after dependencies installation
COPY . /app
RUN mkdir -p /app/tmp

# ezmasterification
# see https://github.com/Inist-CNRS/ezmaster
# (no data directory)
# http port is not used
RUN echo '{ \
  "httpPort": 3000, \
  "configPath": "/app/config.json" \
}' > /etc/ezmaster.json

# run the application
ENTRYPOINT [ "./docker-entrypoint.njs" ]