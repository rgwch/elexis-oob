# Elexis - Out Of The Box

Dies es docker-compose Projekt erstellt eine vollständige Elexis-Arbeitsumgebung aus:

* Appserver: Eine Website, die folgende Dienste anbietet:
  
  * Download von Elexis Installationen für alle unterstützten Betriebssysteme via http oder über 
  Samba-Share.

  * Update Site zur Nachinstallation von Plugins.

  * Backup Service zur regelmässigen Datensicherung.

  * Zugriff via Samba auf die Dokumentenverzeichnisse von Lucinda.

* Elexisdb: Elexis Datenbank, einfache Basiskonfiguration

* Webelexis: Webapp-Zugriff auf die Elexis-Datenbank.

* Lucinda: Dokumentenmanager mit ausgefeilter Suchfunktion.

* PACS (Picture Archiving and Communication System): Ein Verwaltungssystem für z.B. DICOM-Dateien (Röntgenbilder etc.)

## Voraussetzungen

Als Vorbedingung benötigen Sie nur Git, Docker und Docker-Compose auf dem Server, sowie Java JRE 8 auf den Clients. 

## Installation und start

Auf dem Server:

      git clone https://github.com/rgwch/elexis-oob
      cd elexis-oob
      sudo docker-compose up -d

Der Vorgang wird beim ersten Mal sehr lang dauern (Da ein Maven-Build involviert ist, muss das halbe Internet heruntergeladen werden). Wenn er fertig ist, richten Sie von einem im selben Netzwerk befindlichen Client-Computer aus einen Browser auf <http://elexisapps:3000>. Dort finden Sie dann auch eine detaillierte Anleitung (<http://elexisapps:3000/doc>. Falls die Adresse nicht aufgelöst werden kann (Falls Ihr Computer keine SMB/nmbd Namensauflösung "versteht"), dann versuchen Sie <http://IhrServer:3000>, wobei Sie für IhrServer entweder die IP Adresse oder den sympolischen Netzwerknamen einsetzen.
