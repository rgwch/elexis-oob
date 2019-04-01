FROM maven:3.6.0-jdk-8-slim as build-stage
LABEL maintainer="weirich@webelexis.ch" \
version=1.0 \
description="create elexis products and repositories"

WORKDIR /opt
ENV BRANCH=ungrad2019

RUN apt-get update \
    && apt-get install -y git \
    && git clone -b ${BRANCH} https://github.com/rgwch/elexis-3-core \
    && git clone -b ${BRANCH} https://github.com/rgwch/elexis-3-base \
    && git clone -b ${BRANCH} https://github.com/rgwch/elexis-ungrad \
    && export MAVEN_OPTS="-Xmx1024m" \ 
    && cd elexis-3-core \
    && mvn verify -Dtycho.localArtifacts=ignore -Dmaven.test.skip=true -P all-archs \
    && cd ../elexis-3-base \
    && mvn verify -Dtycho.localArtifacts=ignore -Dmaven.test.skip=true \
    && cd ../elexis-ungrad \
    && mvn verify
 

# ------------------------------- end of build stage --------------------------------

FROM node:alpine
LABEL maintainer="weirich@webelexis.ch" \
      version=1.0 \
      description="deploy and manage elexis-oob products"

EXPOSE 3000 

COPY site /home/node/site
WORKDIR /home/node/site

COPY --from=build-stage /opt/elexis-3-core/ch.elexis.core.p2site/target/products public/products/
COPY --from=build-stage /opt/elexis-3-core/ch.elexis.core.p2site/target/repository public/core-repository/
COPY --from=build-stage /opt/elexis-3-base/ch.elexis.base.p2site/target/repository public/base-repository/
COPY --from=build-stage /opt/elexis-ungrad/ungrad-p2site/target/repository public/ungrad-repository/


RUN npm install \ 
    && apk --no-cache upgrade \
    && apk --no-cache add mariadb-client \
    && echo elexisapps>/etc/hostname
    

ENTRYPOINT [ "npm", "start" ]
