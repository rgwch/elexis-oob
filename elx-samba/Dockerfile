FROM node:alpine
# Samba setup inspired from pwntr/samba-alpine

EXPOSE  137/udp 138/udp 139 445

RUN mkdir /config
COPY *.conf /config/

RUN apk --no-cache upgrade \
    && apk --no-cache add samba samba-common-tools supervisor avahi \
    && echo elexisdata>/etc/hostname \
    && addgroup -g 1001 elexisadmin \
    && adduser -D -H -G elexisadmin -s /bin/false -u 1001 elexisadmin \
    && echo -e "elexis\nelexis" | smbpasswd -a -s -c /config/smb.conf elexisadmin 

VOLUME /config 
VOLUME /mnt/lucinda

ENTRYPOINT [ "supervisord", "-c", "/config/supervisord.conf" ]
