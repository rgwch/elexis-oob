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

Als Vorbedingung benötigen Sie nur Docker und DockerCompose auf dem Server, sowie Java JRE 8 auf den Clients. 

## Installation und start

      sudo docker-compose up -d

Der Vorgang wird beim ersten Mal sehr lang dauern (Eine halbe Stunde oder mehr)