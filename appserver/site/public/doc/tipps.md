# Einige Tipps

## Alles löschen

    docker-compose down --rmi local
    docker volume prune

**Achtung:** Die zweite Zeile löscht WIRKLICH alle Daten! Nach einem erneuten `docker-compose up -d` ist Ihre Elexis-Datenbank wieder wie neu. Wenn Sie nur die Programme neu aufbauen wollen, geben Sie nur die erste Zeile ein. Und machen Sie vor solchen Aktionen IMMER ein Backup.

## Login in den dockerisierten MariaDB-Server

    docker exec -it elx_elexisdb /bin/sh
    mysql --protocol tcp -u username -ppassword 
    use elexisoob

