# Elexis - Out Of The Box

Dies es docker-compose Projekt erstellt eine vollständige Elexis-Arveitsumgebung aus:

* Appserver: Eine Website, die folgende Dienste anbietet:
  
  * Download von Elexis Installationen für alle unterstützten Betriebssysteme

  * Update Site zur Nachinstallation von Plugins

  * Backup Service zur regelmässigen Datensicherung

* Elexisdb: Elexis Datenbank

* Webelexis

* Lucinda

## Voraussetzungen

Als Vorbedingung benötigen Sie nur Docker und Docker-Compose auf dem Server, sowie Java JRE 8 auf den Clients. 

## Installation und start

      sudo docker-compose up -d

Der Vorgang wird beim ersten Mal sehr lang dauern (Da ein Maven-Build involviert ist, muss das halbe Internet heruntergeladen werden). Wenn er fertig ist, richten Sie einen Browser auf http://&lt;serveradresse&gt;:8080 (setzen Sie für &lt;serveradresse&gt; den Netzwerknamen oder die IP Adresse des Servers ein, auf dem Sie Elexis-OOB installiert haben).
