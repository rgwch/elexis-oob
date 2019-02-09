# Elexis Out of the box

## Was es ist

Elexis-OOB ist eine komplette [Elexis](http://elexis.info)-Umgebung bestehend aus:

* MariaDB Server und Datenbank.
* Elexis-Clientprogrammen für Windows, macOS und Linux.
* Webelexis (Elexis Client für mobile Geräte)
* Lucinda (Dokumentenverwaltung)
* PACS (Bildverwaltung)

Sowie einer Web-Oberfläche zur initialien Einrichtung des Systems, sowie Konfiguration, Erstellung und Zurückspielen von Backups.

## Was Sie benötigen

Einen Computer als Server, auf dem [Docker](http://docker.io) und Docker-Compose installiert ist.
Einen oder mehrere Computer als Clients, auf denen [Java](http://java.sun.com), idealerweise in Version 8, installiert ist.

## Wie Sie anfangen

Auf dem Server:

        git clone https://github.com/rgwch/elexis-oob
        cd elexis-oob
        docker-compose up -d

Dieser Vorgang wird beim ersten Mal sehr lange dauern (eine viertel Stunde oder so). Weitere Starts gehen dann schnell.

Für die Erstkonfiguration lesen Sie bitte [hier](config.md) weiter.

