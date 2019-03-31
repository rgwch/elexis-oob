# Einige Tipps

## Alles löschen

    docker-compose down --rmi local
    docker volume prune

**Achtung:** Die zweite Zeile löscht WIRKLICH alle Daten! Nach einem erneuten `docker-compose up -d` ist Ihre Elexis-Datenbank wieder wie neu. Wenn Sie nur die Programme neu aufbauen wollen, geben Sie nur die erste Zeile ein. Und machen Sie vor solchen Aktionen IMMER ein Backup.

## Login in den dockerisierten MariaDB-Server

    docker exec -it elx_elexisdb /bin/sh
    mysql --protocol tcp -u username -ppassword 
    use elexisoob

## Vorgaben ändern; erweiterte Konfiguration

Ports und Namen sind in .env definiert und werden von dort im docker-compose.yaml eingelesen.

## SSH Zugriff

Wenn Sie verschlüsselte Kommunikation möchten (was an sich immer empfehlenswert, bei Verbidungen von Aussen sogar zwingend ist), dann sind einige manuelle Eingriffe nötig, da hier nicht alles automatisierbar ist. Ich zeige hier das Vorgehen, um die Selbstbedienungs-Terimvergabe verschlüsselt ablaufen zu lassen.

- Sie benötigen ein Schlüsselpaar. Am einfachsten stellt man es sich selber her, mit `openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes`. Damit erstellt man sich ein Paar aus einem privaten und einem öffentlichen Schlüssel und bestätigt dem öffentlichen Schlüssel selber, dass er echt ist. Das so erstellte Echtheitszertifikat nennt man darum "self signed certificate". Jeder halbwegs vernünftige Browser wird eine Warnung ausspucken, bevor er einem selbstsignierten Zertifikat vertraut. Wichtig ist: Die Warnung betrifft nur die Echtheit. Die Verschlüsselung selber ist genau dieselbe, wie mit einem offiziellen Zertifikat. Und wenn Sie daas Zertifikat selber hergestellt haben, dann wissen Sie ja, dass es echt ist. Trotzdem wird der Browser Sie überflüssigerweise warnen.
Wenn Sie ddiese Warnung störend finden, können Sie auch ein offizielles Zertifikat machen lassen. Bis vor Kurzem war ein solches Zertifikat eine relativ teure Sache, heutzutage geht es aber gratis via [Let's Encrypt](https://letsencrypt.org/). Das Vorgehen, um an ein solches Zertifikat zu kommen, ist aber ausserhalb des Anspruchs dieser Anleitung.

- Sie müssen dem Proxy mitteilen, wo die Zertifikate gespeichert sind, und ihn anweisen, auch am SSL/TLS Port (443) zu lauschen. Ändern Sie in docker-compose.yaml den Proxy-Block wie folgt:

```yaml
proxy:
    image: jwilder/nginx-proxy
    container_name: elx_proxy
    ports:
      - "80:80"
      - "443:443"    
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - /pfad/zu/zertifikaten:/etc/nginx/certs
    
```

- Sie müssen dem Webelexis-Container mitteilen, unter welchem Namen er von aussen erreichbar sein soll. Im Webelexis-Block steht folgendes:

```yaml
webelexis:
    image: rgwch/webelexis:3.3.0
    container_name: elx_webelexis
    volumes:
      - webelexisdata:/home/node/webelexis/data
    ports:
      - "${WEBELEXIS_PORT}:3030"
      - "${SELFSERVICE_PORT}:4040"
    depends_on:
      - appserver    
      - elexisdb
    restart: always
    environment:
      - EXTERNAL_PORT=${WEBELEXIS_PORT}
      - VIRTUAL_HOST=${SELFSERVICE_NAME}
      - VIRTUAL_PORT=${SELFSERVICE_PORT}
```
Sie Variablen sind in der Datei .env definiert. Ändern Sie dort die Variable SELFSERVICE_NAME auf einen Namen, den Sie im Internet kontrollieren können, als eine Domain, die Sie besitzen.
der Block 'environment' bewirkt, dass der Proxy jede Anfrage, die auf termine.webelexis.ch (resp. was auch immer Sie für einen Domain-Namen gewählt haben) kommt, auf elx_webelexis:4040 umgeleitet wird.

- Sie müssen dem weltweiten DNS-System mitteilen, dass dieser Name auf Ihren Praxis-Server verweist. Dazu brauchen Sie Zugriff auf den DNS-Eintrag Ihres Nameservers - das können Sie üblicherweise über eine Web-Oberfläche Ihres Domain-Providers machen. Häufig wird Ihr Praxis-Server aber keine feste IP haben, dann müssen Sie den Namen auf eine dynamische IP verweisen lassen. Auch diese Erläuterung liegt nicht im Rahmen dieser Kurzanleitung.



## Minio auf Raspberry Pi

Wenn man sich für ein Storage-Konzept wie Amazon S3 interessiert, aber nicht Amazon Kunde werden will, ist [Minio](https://minio.io) eine Option. Man kann sich seine eigenen Amazon S3 Cloud bauen, indem man beispielsweise einen Raspberry Pi mit einer grossen USB-Festplatte versieht und dort Minio installiert. Hier die dazu nötigen Schritte:

* [Raspbian Lite](https://www.raspberrypi.org/downloads/raspbian/) herunterladen und auf eine Mikro-SD-Karte brennen, zum Beispiel mit [Etcher](https://www.balena.io/etcher/). Eine 16GB MicroSD genügt völlig.

* Noch auf dem Arbeitskomputer ins Verzeichnis /boot der SD-Karte gehen und dort 'touch ssh' eingeben

* Die MikroSD-Karte in den Raspberry Pi einlegen, starten, und sich dann mit `ssh raspberry` oder `ssh raspberrypi.local` und dem Passwort 'raspberry' einloggen.

* mit `sudo raspi-config` ins Konfiguationsprogramm gehen. Dort ein anderes Passwort, einen anderen Hostnamen (ich wähle 'miniopi') wählen, den SSH Server aktivieren, die Locale-Einstellungen auf de_CH UTF8 und die Zeitzone korrekt einstellen. Falls das WLAN-Modul gebraucht wird, auch die WLAN-Landeinstellungen und Zugangsdaten korrekt eingeben.

* Neu starten und sich dann mit `ssh pi@miniopi` oder `ssh pi@miniopi.local`und dem vorhin vergebenen Passwort anmelden.

* `sudo apt-get install git`

* Go herunterladen von: <https://dl.google.com/go/go1.12.1.linux-armv6l.tar.gz> und mit `tar -xzf go1.12.1.linux-armv6l.tar.gz` entpacken. Das so entstandene Verzeichnis go nach /usr/local verschieben und den PATH mit /usr/local/go/bin ergänzen. Bitte nicht versuchen, go mit `apt-get golang`zu installieren, dann bekommt man eine hoffnungslos veraltete Version. Für Minio ist mindestens 1.11 nötig.

* `go get -u github.com/minio/minio`. Dies wird eine ganze Weile dauern. Danach befindet sich das Minio Binary in go/bin/minio

* Externe Festplatte an einen USB-Port des Pi anschliessen (Nur begrenzte Leistungsaufnahme möglich; ggf. an Stromversorgung angeschlossenen USB-Hub dazwischen hängen, oder eine Platte mit eigener Stromversorgung verwenden). Die Platte mit fdisk partitionieren und mit `sudo mkfs -t ext4 /dev/sda1`  formatieren, dann mit `sudo mount /dev/sda1 /mnt`einhängen und mit `sudo chown -R pi.pi /mnt` für Minio beschreibbar machebn.

* `export MINIO_ACCESS_KEY=irgendwas && export MINIO_SECRET_KEY=geheimerschluessel && go/bin/minio server /mnt` startet den Server. Man kann die Verwaltungsoberfläche mit dem Browser auf <http://miniopi:9000> erreichen und auf derselben Adresse auch Amazon S3 Datenspeicherungs-APIs verwenden.

Die Leistung eines Raspberry 3B reicht gut für einen Minio-Server, sofern nicht mehr als zwei oder drei Clients gleichzeitig darauf zugreifen. Er ist im LAN immer noch schneller, als ein "echter" Amazon S3, weil der Datentransport natürlich wesentlich schneller ist.

## Datensicherung mit Restic

[Restic](https://restic.net) ist ein Datensicherungs-Tool, das verschlüsselte versionierte und verifizierbare Backups erstellen kann, und zwar auf eine Vielzahl von Zielen, unter Anderem auch Amazon S3 und somit auch Minio.

Man muss Restic auf dem Computer installieren, von dem aus man das Backup starten bzw. zurückspielen will. Bevor man sichern kann, muss man ein Repository initialiseren:

```bash
export AWS_ACCESS_KEY=irgendwas
export AWS_SECRET_KEY=geheimerschluessel
restic init -r s3:http://miniopi:9000/repositoryname
```

Danach startet man ein Backup mit `restic backup -r s3:http://miniopi:9000/repositoryname /zu/sicherndes/verzeichnis`

Das erste Backup wird lang dauern, bei späteren Backups werden dann nur noch die Differenzen gesichert.

Integritätscheck erfolgt mit `restic check -r s3:http://miniopi:9000/repositoryname`, eine Liste aller snapshots bekommt man mit `restic snapshots -r s3:http://miniopi:9000/repositoryname` und zurückspielen kann man mit `restic restore latest -r s3:http://miniopi:9000/repositoryname --target /hierhin/kopieren`

Mit `restic mount /irgend/ein/mountpoint -r s3:http://miniopi:9000/repositoryname` kann man ein Backup Repository als Verzeichnis irgendwo einbinden und darin suchen, Dateien herauskopieren usw (aber nichts verändern).

Weiteres auf der ausführlichen Website von Restic.
