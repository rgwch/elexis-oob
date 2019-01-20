FROM maven:3.6.0-jdk-8-slim as build-stage
LABEL maintainer="Gerry Weirich"
LABEL version=1.0
LABEL description="generate elexis products and download sites"

COPY build_all.sh /opt/

RUN apt-get update \
    && apt-get install -y git \
    && chmod +x /opt/build_all.sh \
    && /opt/build_all.sh

FROM openjdk:8-jre-slim

COPY --from=build-stage /elexis-3-core/ch.elexis.core.p2site/target/products /opt/core/
COPY --from=build-stage /elexis-3-core/ch.elexis.core.p2site/target/repository /opt/core/
COPY --from=build-stage /elexis-3-base/ch.elexis.base.p2site/target/repository /opt/base/
COPY --from=build-stage /elexis-ungrad/ch.elexis.ungrad.p2site/target/repository /opt/core/


