# Einige Tipps

## Alles löschen

    docker-compose down --rmi local
    docker volume prune

**Achtung:** Dies löscht WIRKLICH alle Daten! Nach einem erneuten `docker-compose up -d` ist Ihre Elexis-Datenbank wieder wie neu.

## Login in den dockerisierten MariaDB-Server

    docker exec -it elx_elexisdb /bin/sh
    mysql --protocol tcp -u username -ppassword 
    use elexisoob

