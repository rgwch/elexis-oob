# Datenbank Verwaltungs Funktionen

Die Funktionen zum Einrichten der Datenbank und Einlesen von Datenbeständen haben wir ja bereits bei der [Ersteinrichtung](config.md) besprochen.

Elexis-OOB erlaubt Ihnen ausserdem, Sicherungen Ihrer Datenbank zu planen und wiederherzustellen.

*Achtung*: Sie sollten Ihre Datensicherung unbedingt in regelmässigen Abständen testen, etwa mit einer zweiten Elexis-OBB-Instanz, damit Sie erkennen, falls etwas nicht funktioniert!


## Grundlagen

Zu grundsätzlichen Überlegungen zum Backup lesen Sie bitte [hier](backup.md)

Man kann eine Datenbank grundsätzlich auf zwei Arten sichern:

1: Man kann das Verzeichnis, in dem die Daten auf der Festplatte physisch gespeichert sind, komplett sichern.

Vorteile: 

* Relativ schnelles Sichern und Wiedereinspielen
* Kann im Rahmen eines standardmässigen System-Backup-Konzepts eingebunden werden

Nachteile:

* Funktioniert nur mit derselben Datenbank, oft sogar nur mit derselben Version des Datenbankservers unter demselben Betriebssystem wie beim Backup. Das kann beim Versuch, ein länger zurückliegendes Backup wieder einzulesen, unlösbare Probleme machen.
* Funktioniert nur zuverlässig, wenn das Datenbank-Serverprogramm zum Zeitpunkt der Sicherung gestoppt ist, da sonst Inkonistenzen auftreten können (Wenn die Datenbank ein Objekt verändert, das gerade geichert wird.) Inkonistenzen bei der Sicherung können dazu führen, dass ein Wiedereinspielen unmöglich ist.


2: Man speichert das Backup als Folge von SQL-Befehlen (SQL-Script)

Das ist quasi die Simulation aller Vorgänge die auf die Datenbank von Anfang an bis zum derzeitigen Stand angewendet wurden.

Vorteile:

* Funktioniert meistens auch zwischen verschiedenen Versionen des Datenbankservers und sogar betriebsytemübergreifend: Sie können das backup Ihres Linux-servers auf Ihrem Windows-Laptop testen.
* Bei allfälligen Fehlern können SQL-Scripts, die im Grunde einfache Textdateien sind, zur Not sogar manuell korrigiert werden.

Nachteile:

* Diese Dateien sind grösser, als reine Kopien. Sowohl ihre Erstellung als auch das Wiedereinspielen dauert wesentlich länger.

Elexis OOB verwendet die erste Möglichkeit. Allerdings kann es systembedingt den Datenbankserver nicht stoppen. Sie sollten also den Zeitpunkt des Backups so legen, dass dann sicher keine Aktivität stattfindet. Und ich würde empfehlen, zusätzlich noch ein Backup nach der Methode 2 ausserhalb von Elexis-OOB anzulegen. Auf der [Backup-Seite](backup.md) finden Sie Beispiel-Skripte.

## Ausführung

Wählen Sie im Elexia-OOB Hauptbildschirm im Feld "Verwaltung" den Punkt "Datenicherung konfigurieren". Folgendes Fenster erscheint:

![](../images/manage_01.png)

Die Angaben, die Sie hier eintragem können, sind im "crontab" Stil. Die Einstellungen in diesem Beispielbild bedwuten: Es wird Montag bis Freitag jede Nacht ab 03:15 Uhr ein Backup erstellt. Zum  Verständnis, wo dieses Backup landet, und was man dann damit tun kann, ist leider ein Verständnis der Docker-Interna notwendig. Standardmässig gehen die Backups in das Volume 'backup', das sich auf Linux Conputern in `/var/lib/docker/volumes/elexis-oob_backup` befindet. Sie können durch enstprechende Änderung der docker-compose.yaml ein anderes Backup-Verzeichnis anlegen. Wenn Sie zum Beispiel Backups auf das Laufwerk /mnt/grosseplatte schreiben wollen, dann müssten Sie den Abschnitt:

````yaml
appserver:
    build: ./appserver
    container_name: elx_appserver
    environment:
      - DBHOST=elexisdb
      - DBPORT=3306
      - PUBLIC_DBPORT=3312
      - HOST_HOSTNAME=<Server Name>
    volumes:
      - backup:/backup
      - webelexisdata:/mnt/webelexisdata
      - elexisdb:/mnt/elexisdb:ro
      - lucindadata:/mnt/lucindadata:ro
      - lucindabase:/mnt/lucindabase:ro
      - pacsdata:/mnt/pacsdata:ro
    restart: always  
    ports:
      - 3000:3000
    depends_on:
      - elexisdb
    labels: 
      - "traefik.frontend.rule=Host:elexisapps.docker.localhost"  
````

so ändern, dass in voilumes steht:

````yaml
volumes:
      - /mnt/grosseplatte:/backup
      - webelexisdata:/mnt/webelexisdata
      - elexisdb:/mnt/elexisdb:ro
      - lucindadata:/mnt/lucindadata:ro
      - lucindabase:/mnt/lucindabase:ro
      - pacsdata:/mnt/pacsdata:ro
    
````
und dann das System mit `docker-compose restart` neu starten.

Die Backups sind komprimierte Dateien mit Namen wie: `elexisdb_YYYY-MM-DD-HHmm.tar.gz`.
 