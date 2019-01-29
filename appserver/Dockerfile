FROM maven:3.6.0-jdk-8-slim as build-stage
LABEL maintainer="weirich@webelexis.ch"
LABEL version=1.0
LABEL description="generate elexis products and download sites"

WORKDIR /opt

RUN apt-get update \
    && apt-get install -y git \
    && git clone -b ungrad2019 https://github.com/rgwch/elexis-3-core \
    && git clone -b ungrad2019 https://github.com/rgwch/elexis-3-base \
    && git clone -b ungrad2019 https://github.com/rgwch/elexis-ungrad 

WORKDIR /opt/elexis-3-core
RUN mvn verify -Dtycho.localArtifacts=ignore -Dmaven.test.skip=true -P all-archs 

WORKDIR /opt/elexis-3-base
RUN mvn verify -Dtycho.localArtifacts=ignore -Dmaven.test.skip=true 

WORKDIR /opt/elexis-ungrad
RUN mvn verify

FROM node:alpine
LABEL maintainer="weirich@webelexis.ch"
LABEL version=1.0
LABEL description="deploy elexis products"
EXPOSE 3000 137/udp 138/udp 139 445

COPY site /home/node/site

COPY --from=build-stage /opt/elexis-3-core/ch.elexis.core.p2site/target/products /home/node/site/public/products/
COPY --from=build-stage /opt/elexis-3-core/ch.elexis.core.p2site/target/repository /home/node/site/public/core-repository/
COPY --from=build-stage /opt/elexis-3-base/ch.elexis.base.p2site/target/repository /home/node/site/public/base-repository/
COPY --from=build-stage /opt/elexis-ungrad/ungrad-p2site/target/repository /home/node/site/public/ungrad-repository/

WORKDIR /home/node/site


RUN mkdir /config
COPY *.conf /config/
RUN npm install \ 
    && apk --no-cache upgrade \
    && apk --no-cache add samba samba-common-tools supervisor \
    && addgroup -g 1001 elexisadmin \
    && adduser -D -H -G elexisadmin -s /bin/false -u 1001 elexisadmin \
    && echo -e "elexis\nelexis" | smbpasswd -a -s -c /config/smb.conf elexisadmin


VOLUME /config /shared

#CMD ["npm","start"]
ENTRYPOINT [ "supervisord", "-c", "/config/supervisord.conf" ]
