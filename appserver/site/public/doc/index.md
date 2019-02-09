# Elexis Out of the box

## Was es ist

Elexis-OOB ist eine komplette [Elexis](http://elexis.info)-Umgebung bestehend aus:

* MariaDB Server und Datenbank.
* Elexis-Clientprogrammen für Windows, macOS und Linux.
* Webelexis (Elexis Client für mobile Geräte)
* Lucinda (Dokumentenverwaltung)
* PACS (Bildverwaltung)

Sowie einer Web-Oberfläche zur initialien Einrichtung des Systems, sowie Konfiguration, Erstellung und Zurückspielen von Backups.

Das Ganze ist als Docker - Komposition entworfen. Dadurch ist es (ziemlich) systemunabhängig und ausserordentlich leicht einzurichten. Im Prinzip genügt ein einziger docker-compose Befehl, um das System audzusetzen, und danach einige Schritte für die Konfgiguration. Diese Anleitung führt sie durch den Vorgang.

## Was Sie benötigen

* Einen Computer als Server, auf dem [Docker](http://docker.io) und Docker-Compose installiert ist. Dies ist idealerweise ein Linux-Computer. Windows und Mac sind zwar auch möglich, es wird aber eventuell nicht alles funktionieren (z.B. der Samba-Server zum Zugriff auf das Lucinda-Dokumentenverzeichnis).

* Einen oder mehrere Arbeitsplatz-Computer (Clients), auf denen [Java](http://java.sun.com), idealerweise in Version 8, installiert ist. Hier sind Windows, macOS und Linux möglich.

## Wie Sie anfangen

Auf dem Server:

        git clone https://github.com/rgwch/elexis-oob
        cd elexis-oob
        docker-compose up -d

Dieser Vorgang wird beim ersten Mal sehr lange dauern (ca. 15-25 Minuten auf einem zeitgemässen Computer mit schnellem Internet). Weitere Starts gehen dann schnell (wenige Sekunden).

Um das ganze System zu stoppen, geben Sie ein: `docker-compose stop`. Um es dann wieder zu starten, genügt `docker-compose start`. Eine Regeneration der Container erreicht man mit `docker-compose up -d`. Normalerweise brauchen Sie sich aber nicht darum zu kümmern: Wenn Sie den Server herunterfahren, wird docker automatisch vorher "sanft" gestoppt, und nach einem Neustart wird das Elexis-OOB-System ebenfalls automatisch neu gestartet.


Für die Erstkonfiguration lesen Sie bitte [hier](config.md) weiter.

