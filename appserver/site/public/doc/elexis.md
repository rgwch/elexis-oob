# Konfiguration von Elexis

Leider kann Elexis-OOB (noch) nicht alles für Sie erledigen, was für eine komplette Arztpraxisumgebung notwendig ist. 

Eine ausführlichere Anleitung dessen, was Sie nach der Installation von Server und Clients noch erledigen müssen, finden Sie bei [elexis.info](https://wiki.elexis.info/Installation_Elexis_3.x_OpenSource). Hier nur ein Schnelldurchgang, damit Sie gleich loslegen können.

## Mandanten und Anwender erstellen

Starten Sie Elexis und wählen Sie im Hauptmenü *Datei->Einstellungen*. Dort finden Sie folgende Seite:

![](/images/elx_config_01.png)

Ernennen Sie Ihren vorhin erstellten Hauptmandanten zum "verantwortlichen" Arzt und weisen Sie ihm passende Rollen zu. (Durch "Rollen" wird festgelegt, wer in Elexis was tun darf - belassen Sie am Besten zunächst alles auf den Standardwerten).

Klicken Sie dann "Anwenden und Schließen".

## Benötigte Features nachinstallieren

Wählen Sie im Elexis-Hauptmenü den Punkt *Hilfe->Neue Software installieren*. Sie können eine der vordefinierten Sites auswählen, oder mit *Hinzufügen* beispielsweise eine oder mehrere der mit Elexis-OOB installierten Software-Sites hinzufügen.

![](/images/elx_config_02.png)

Wählen Sie für jetzt die Site "elexis-3-base" und markieren Sie dort unter "Basispakete" das Paket "Elexis Swiss OpenSource Feature" (Keine Angst, Sie können später jederzeit weitere Features nachinstallieren, jetzt machen wir nur das Minumum, was zum Einrichten notwendig ist). 

Klicken Sie dann auf Weiter" und dann auf "Fertigstellen". Sie werden eine Sicherheitswarnung erhalten, die Sie mit "Trotzdem installieren" beantworten müssen. Danach sollten Sie Elexis neu starten.

## Abrechnungssystem konfigurieren

Öffnen Sie jetzt wieder den *Datei-Einstellungen* Dialog und suchen Sie diesmal *Abrechnungssysteme* auf. 

![](/images/elx_config_03.png)

Klicken Sie oben links auf neu und erstellen Sie zunächst ein KVG Abrechnungssystem:

![](/images/elx_config_04.png)

**Wichtig!**: Für den Multiplikator müssen Sie den für Ihren Kanton gültigen Taxpunktwert einsetzen!

Eine ausführlichere Erläuterung des Abrechnungssystems finden Sie [hier](https://wiki.elexis.info/Ch.elexis.base.ch.arzttarife).

Jetzt können wir loslegen. Einen Einstieg zeige ich [hier](elexis_how2.md)
