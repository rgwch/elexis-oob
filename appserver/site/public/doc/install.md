# Installation

Hinweis: Es sei an dieser Stelle ausdrücklich darauf hingewiesen, dass eine Arztpraxis-Software mit besonders schützenswerten Daten arbeitet. Die Einfachheit der Installation darf Sie nicht zu leichtfertigem Umgang mit diesen Daten verleiten. Sie dürfen dieses System mit echten Daten nur in einem abgesicherten Netzwerk benutzen. Wenn Sie nicht sicher sind, wie Sie Ihr Netzwerk absichern können, müssen Sie professionelle Unterstützung einkaufen. Im Zweifelsfall ist es sicherer, das Praxisnetzwerk völlig vom Internet zu isolieren. Es ist ausserdem sehr empfehlenswert, die produktive Version auf einer verschlüsselten Partition des Servers zu installieren. Beachten Sie auch die Empfehlungen des [EdöB](https://www.edoeb.admin.ch/edoeb/de/home/datenschutz/gesundheit/erlaeuterungen-zum-datenschutz-in-der-arztpraxis.html).

Falls Sie (erst mal) nur mit Testdaten arbeiten wollen, spricht aber nichts dagegen, ohne grosse Vorsichtsmassnahmen einfach loszulegen und das System nach Herzenslust auszuprobieren! Falls dabei etwas "kaputt" gehen sollte, können Sie erneut mit einem simplen docker-compose Befehl wieder alles auf Anfang setzen.


## Was Sie benötigen

* Einen Computer als Server, auf dem [git](https://git-scm.com), [Docker](http://docker.io) und [Docker-Compose](https://docs.docker.com/compose/) installiert sind. Dies ist idealerweise ein Linux-Computer. Windows und Mac sind zwar auch möglich, es wird aber eventuell nicht alles funktionieren (z.B. der Samba-Server zum Zugriff auf das Lucinda-Dokumentenverzeichnis).

* Einen oder mehrere Arbeitsplatz-Computer (Clients), auf denen [Java](http://java.sun.com), idealerweise in Version 8, installiert ist. Hier sind Windows, macOS und Linux möglich.

## Wie Sie anfangen

Auf dem Server:

        git clone https://github.com/rgwch/elexis-oob
        cd elexis-oob
        docker-compose up -d

Dieser Vorgang wird beim ersten Mal sehr lange dauern (ca. 15-25 Minuten auf einem zeitgemässen Computer mit ADSL/LTE Internet). Weitere Starts gehen dann schnell (wenige Sekunden).

Um das ganze System zu stoppen, geben Sie ein: `docker-compose stop`. Um es dann wieder zu starten, genügt `docker-compose start`. Eine Regeneration der Container erreicht man mit `docker-compose up -d`. Normalerweise brauchen Sie sich aber nicht darum zu kümmern: Wenn Sie den Server herunterfahren, wird docker automatisch vorher "sanft" gestoppt, und nach einem Neustart wird das Elexis-OOB-System ebenfalls automatisch neu gestartet.

Für die Erstkonfiguration lesen Sie bitte [hier](config.md) weiter.

