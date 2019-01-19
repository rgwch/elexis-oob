FROM maven:3.6.0-jdk-8-slim as build-stage

COPY build_all.sh /opt/

RUN apt-get update \
    && apt-get install -y git \
    && chmod +x /opt/build_all.sh \
    && /opt/build_all.sh

