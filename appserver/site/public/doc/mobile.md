# Aus der Ferne via Internet auf die Praxisdaten zugreifen

Der Bedarf, zum Beispiel von zuhause aus auf die Praxisdaten zugreifen zu können, oder beispielsweise die Terminvergabe an eine exyterne Prson zu delegieren, ist zweifellos da. Etliche Anqwender haben dafür Verbindungen über eine Remot-Desktop.Software, zum Beispiel TeamViewer oder AnyDesk eingerichtet. Eine solche Verbindung hat mehrere Nachteile:

* Die Geheimhaltung der Daten ist nicht gewährleistet. Alle Daten laufen über einen Server des betreffenden Ubternehmens und können dort im Prinzip auch gelesen werden. Das ist für Arztpraxis-Software schlicht unzulässig.

* Es muss ein Computer mit Elexis eigens zu diesem Zweck laufen gelassen werden, und dieser Computer muss von aussen erreichbar sein. In den Aufzeichnungen kann man nicht erkennen, ob ein bestimmter Zugriff von Ausserhalb oder über die Konsole dieses Computers erfolgt ist. Ein unbeaufsichtigt laufender Computer in der Praxis ist eine Schwachstelle. Der einzige Computer, der immer löuft, sollte der Server sein, und auf diesem sollte keine Elexis-Instanz (am Besten überhaupt keine grafische Oberfläche) laufen.

Ich werde in diesem Kapitel zeigen, wie man einen sicheren Zugang erstellt, und diesen mit einem Computer oder einem Mobilgerät übers Internet nutzen kann.

## Secure Shell

Ich würde ganz grundsätzlich empfehlen, den Zugriff von aussen nur via SSH (secure shell) oder allenfalls VPN (Virtual Private Network) zu erlauben. Beide Technologien erledigenim Wesentlichen Folgendes:

* Sie identifizieren den Benutzer auf sichere und vielfach erprobte Weise. Dabei kann optional (und empfehlenswert) ein digitaler Schlüssel statt eines Passworts verwendet werden, was deutlich mehr Sicherheit bietet.

* Der Administrator kann einen Zugang jederzeit sperren, wenn zum Beispiel ein Mitarbeiter die Praxis verlässt oder ein Schlüssel verloren ging.
* Sie sorgen dafür, dass die gesamte Kommunikation sicher verschlüsselt stattfindet.

SSH ist einfacher aufzubauen, als VPN, daher werde ich mich hier auf SSH beschränken.

## Server

Auf einem Linux Server ist der SSH-Server üblicherweise bereits vorinstalliert und läuft. Wenn nicht, können Sie ihn jederzeit aus den Paketquellen nachinstallieren (sudo apt-get install openssh-server). Für Windows gobt es vorkompilierte Packages.

Sie können alle Einstellungen in /etc/ssh/sshd_config auf den Voreinstellungen lassen, nur die Einstellung "PasswordAuthentication" sollten Sie nur für die Einrichtung auf "yes" lassen und dann für den Alltagsgebrauch auf "no" stellen.

Erstellen Sie auf dem Server für jeden Anwender, der SSH-Zugriff erhalten soll, ein Benutzerkonto.

## Router

Damit Ihr Server aus dem Internet erreichbar ist, müssen Sie auf dem Router eine Portweiterleitung einstellen. Ich würde empfehlen, einen nicht-Standard-Port für den Fernzugriff zu wählen, da Sie sonst Dauerziel für Brute-Force-Attacken werden, die zwar, sorgfältige Einrichgung vorausgesetzt, nicht gefäöhrlich sind, aber Netzwerk und Router belasten. Nehmen wir an, Sie wählen (willkürlich) den Port 36223, dann müssten Sie eine Portweiterleitung von 36223 auf dem Router auf 22 auf dem Server einrichten. 

## DNS

Wenn Sie wollen, dass Ihr Server nicht nur unter der IP-Adresse (11.21.234.17), sondern auch unter einem symbolischen Namen (praxis-dr-eisenbart.ch) erreichbar ist, dann müssen sie ihn dem DNS-System bekannt machen. Wie das geht, habe ich an [anderer Stelle](letsencrypt.md)  gezeigt. (Den Teil mit den Zertifikaten brauchen Sie hier nicht zu beachten, da wir für den SSH Zugang kein Webserver-Zertifikat verwenden müssen).

## Client

Grundsätzlich kann man sich bei SSH mir Username/Passwort einloggen, oder mit einem digitalen Schlüsselpaar. Letzteres ist sicherer, da ein 2048 Bit Schlüssel mit heutiger Technik nicht knackbar ist, während Passwörter oft zu kurz und zu leicht erratbar gewählt werden. Ich emopfehle, ausschliesslich die Schlüsselbasierte Authentisierung anzuwenden und den Schlüssel mit einem Passwort zusätzlich zu schern, falls das Endgerät einmal in falsche Hände geraten sollte.

### Linux und Mac

Erstellen Sie ein Schlüsselpaar mit `ssh-keygen -t rsa`. Laden Sie den öffentlichen Schlüssel mit `ssh-copy-id username@praxos-dr-eisenbart.ch` auf das Konto 'username' des Praxisservers hoch. Dazu werden Sie das Passwort des Loginkontos von 'username' eingeben müssen.

### Android

Ich zeige hier das Vorgehen für die App 'JuiceSSH', die Sie vom Playstore herunterladen können.

* Erstellen Sie eine neue Identität und generieren Sie einen Schlüssel für diese Identität.
* Erstellen Sie eine neue Verbindung für Ihre Praxis und ordnen Sie dieser Verbindung die vorhin erstellte Identität zu.

## Absichern

Wenn die Schlüsselerstellung auf allen SSH-berechtigten Computern  aller zugelassenen Anwender durchgeführt wurde, kann man auf dem Server in /etc/ssh/sshd_config die Zeile PasswoerAuthentication auf 'no' setzen und den SSH Server mit `sudo service sshd restart`bzw. `sudo systemctl restart sshd` neu starten. Von da an ist der Zugriff nur noch via Schlüssel möglich.
