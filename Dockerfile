FROM alpine:latest AS build
# use given repository, default below:
#ARG repo=https://github.com/severina19/fredy.git

ARG branch=master

RUN mkdir -p /usr/src/
#Install Software
RUN apk add --update nodejs npm git

# Output used repository
#RUN echo "Cloning from $repo"

ADD . /usr/src/fredy
#RUN cd /usr/src && git clone $repo && cd fredy && git checkout $branch

RUN ln -s /usr/src/fredy/conf/ /conf

# create db folder
#RUN mkdir /usr/src/fredy/db/

RUN ln -s /usr/src/fredy/db/ /db

RUN npm i -g yarn

RUN cd /usr/src/fredy/ && yarn

WORKDIR  /usr/src/fredy

RUN yarn run prod

EXPOSE 9998

VOLUME [ "/conf", "/db" ]

#ENTRYPOINT ["tail"]
#CMD ["-f","/dev/null"]


# --no-daemon is required for keeping Container alive
CMD node index.js --no-daemon
