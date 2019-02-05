# Einrichtung der Elexis-Clients

Elexis läuft auf Windows, macOS und Linux-Computern. Einzige Vorbedingung: Eine [Java-Runtime](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) (Version 8 empfohlen) muss installiert sein. Am selben Server können ohne Weiteres auch gemischt Clients der verschiedenen Systeme angeschlossen werden.

Starten Sie auf dem gewünschten Client einen Webbrowser (am besten Chrome oder Firefox) und richten Sie ihn auf <http://elexisapps:3000>, bzw., falls das nicht geht, auf <http://IhrServer:3000>. Klicken Sie dann auf den Button, der dem Betriebssystem des aktuellen Clients entspricht.

![](/images/oobdoc_06.png)

Sie erhalten, je nach Betriebssytem 32- und 64-Bit-Varianten zur Auswahl vorgeschlagen. Laden Sie den passenden Client herunter.

Hinweis: Alternativ können Sie auf vielen Systemen auch eine Netzwerkverbindung zur Ressource "elexisapps" herstellen:

![](/images/oobdoc_07.png)

Dort finden Sie dann die Freigaben "lucinda" (Wo später Ihre Dokumente abgelegt werden) und "repositories", wo unter anderem die Elexis-Clients zu finden sind. Beide Freigaben sind standardmässig nur für Lesezugriffe geöffnet.

So oder so sollten Sie den heruntergeladenen Client nun auf Ihrem System entpacken und starten. Auf dem Mac kommt dabei manchmal eine etwas skurrile Warnung, wie hier:

![](/images/oobdoc_08.png)

Nein, lieber Apple, das empfiehlt sich nicht. Stattdessen klickt man auf Apfel-&gt;Systemeinstellungen-&gt;Sicherheit und wählt auf der Seite “Allgemein” unten “Apps Download erlauben von” -&gt; “Keine Einschränkungen”. Dann startet man Elexis Ungrad noch einmal. Sobald es einmal gestartet wurde, kann man die Sicherheitseinstellungen wieder auf das zurückstellen, was vorher war. weitere Starts von Elexis sollten nun problemlos gehen.

Hinweis: Unter macOS High Sierra und später kann es noch übler kommen: Dort fehlt die Möglichkeit, die Sicherheitseinstellungen zurückzustellen standardmässig. Man kann sich nur mit einem “Trick” behelfen: Öffnen sie ein Terminal und geben Sie ein: `sudo spctl --master-disable`. Danach muss man das Administratorpasswort eingeben, dann nochmal Systemeinstellungen -> Sicherheit öffnen und voilà - die Option “Keine Einschränkungen” bei den Systemeinstellungen ist wieder da.

Beim nächsten Start will es der treue Apfel aber noch einmal genau wissen:

![](/images/oobdoc_09.png)

Da wir das Programm eben selber von unserem eigenen Server (der wegen seiner Geräuschkulisse bei mir 'brumm' heisst) heruntergeladen haben, können wir diese Warnung getrost ignorieren.

