FROM node:alpine
# Samba setup inspired from pwntr/samba-alpine

EXPOSE  137/udp 138/udp 139 445

RUN mkdir /config && mkdir /mnt/lucinda
COPY *.conf /config/

VOLUME /mnt/lucinda

RUN apk --no-cache upgrade \
    && apk --no-cache add samba samba-common-tools supervisor avahi avahi-tools\
    && echo elexisdata>/etc/hostname \
    && chmod 777 /mnt/lucinda \
    && addgroup -g 1001 elexisadmin \
    && adduser -D -H -G elexisadmin -s /bin/false -u 1001 elexisadmin \
    && echo -e "elexis\nelexis" | smbpasswd -a -s -c /config/smb.conf elexisadmin 


ENTRYPOINT [ "supervisord", "-c", "/config/supervisord.conf" ]
