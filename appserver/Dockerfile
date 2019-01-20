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

FROM openjdk:8-jre-slim
LABEL maintainer="weirich@webelexis.ch"
LABEL version=1.0
LABEL description="deploy elexis products"
EXPOSE 8080

COPY --from=build-stage /opt/elexis-3-core/ch.elexis.core.p2site/target/products /opt/products/
COPY --from=build-stage /opt/elexis-3-core/ch.elexis.core.p2site/target/repository /opt/core-repository/
COPY --from=build-stage /opt/elexis-3-base/ch.elexis.base.p2site/target/repository /opt/base-repository/
COPY --from=build-stage /opt/elexis-ungrad/ungrad-p2site/target/repository /opt/ungrad-repository/

RUN apt-get update && apt-get install -y lighttpd
COPY index.html /opt/
COPY lighttpd.conf /root
CMD ['lighttpd', '-f', '/root/lighttpd.conf']
