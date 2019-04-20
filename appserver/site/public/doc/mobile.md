# Aus der Ferne via Internet auf die Praxisdaten zugreifen

Der Bedarf, zum Beispiel von zuhause aus auf die Praxisdaten zugreifen zu können, oder beispielsweise die Terminvergabe an eine externe Person zu delegieren, ist zweifellos da. Etliche Anwender haben dafür Verbindungen über eine Remote-Desktop-Software, zum Beispiel TeamViewer oder AnyDesk eingerichtet. Eine solche Verbindung hat mehrere Nachteile:

* Die Geheimhaltung der Daten ist nicht gewährleistet. Alle Daten laufen über einen Server des betreffenden Unternehmens und können dort im Prinzip auch gelesen werden. Das ist für Arztpraxis-Software schlicht unzulässig.

* Es muss ein Computer mit Elexis eigens zu diesem Zweck laufen gelassen werden, und dieser Computer muss von aussen erreichbar sein. In den Aufzeichnungen kann man nicht erkennen, ob ein bestimmter Zugriff von Ausserhalb oder über die Konsole dieses Computers erfolgt ist. Ein unbeaufsichtigt laufender Computer in der Praxis ist eine Schwachstelle. Der einzige Computer, der immer und unbeaufsichtigt läuft, sollte der Server sein, und auf diesem sollte keine Elexis-Instanz (am Besten überhaupt keine grafische Oberfläche) aktiv sein.

Ich werde in diesem Kapitel zeigen, wie man einen sicheren Zugang auf einen Server erstellt, und diesen abgesichert mit einem Computer oder einem Mobilgerät übers Internet nutzen kann.

## Secure Shell

Ich würde ganz grundsätzlich empfehlen, den Zugriff von aussen nur via SSH (secure shell) oder allenfalls VPN (Virtual Private Network) zu erlauben. Beide Technologien leisten im Wesentlichen Folgendes:

* Sie identifizieren den Benutzer auf sichere und vielfach erprobte Weise. Dabei kann optional (und empfehlenswert) ein digitales Schlüsselpaar statt eines Passworts verwendet werden, was deutlich mehr Sicherheit bietet.

* Der Administrator kann einen Zugang jederzeit sperren, wenn zum Beispiel ein Mitarbeiter die Praxis verlässt oder ein Schlüssel verloren ging, etwa weil der Laptop oder das Handy gestohlen wurde.

* Sie sorgen dafür, dass die gesamte Kommunikation sicher verschlüsselt stattfindet.

SSH ist einfacher aufzubauen, als VPN, daher werde ich mich hier auf SSH beschränken.

## Server

Auf einem Linux Server ist der SSH daemon (sshd) üblicherweise bereits vorinstalliert und läuft. Wenn nicht, können Sie ihn jederzeit aus den Paketquellen nachinstallieren (sudo apt-get install openssh-server). Für Windows gibt es vorkompilierte Packages.

Sie können alle Einstellungen in /etc/ssh/sshd_config auf den Voreinstellungen belassen, nur die Einstellung "PasswordAuthentication" sollten Sie nur für die Einrichtung auf "yes" lassen und dann für den Alltagsgebrauch auf "no" stellen. Ich zeige den Grund gleich.

Erstellen Sie auf dem Server für jeden Anwender, der SSH-Zugriff erhalten soll, ein Benutzerkonto.

## Router

Damit Ihr Server aus dem Internet erreichbar ist, müssen Sie auf dem Router eine Portweiterleitung einstellen. Ich würde empfehlen, einen nicht-Standard-Port für den Fernzugriff zu wählen, da Sie sonst Dauerziel für Brute-Force-Attacken werden, die zwar, sorgfältige Einrichgung vorausgesetzt, nicht wirklich gefährlich sind, aber Netzwerk und Router belasten können. Nehmen wir an, Sie wählen (willkürlich) den Port 36223, dann müssten Sie eine Portweiterleitung von 36223 auf dem Router auf 22 auf dem Server einrichten (Die externe Portnummer kann irgendeine Zahl zwischen 1025 (2^10+1) und 65535 (2^16) sein), die nicht von einem anderen Dienst bereits verwendet wird).

## DNS

Wenn Sie wollen, dass Ihr Server nicht nur unter der IP-Adresse (11.21.234.17), sondern auch unter einem symbolischen Namen (praxis-dr-eisenbart.ch) erreichbar ist, dann müssen sie ihn dem DNS-System bekannt machen. Wie das geht, habe ich an [anderer Stelle](letsencrypt.md)  gezeigt. (Den Teil mit den Zertifikaten brauchen Sie hier nicht zu beachten, da wir für den SSH Zugang kein Webserver-Zertifikat verwenden müssen).

## Client

Grundsätzlich kann man sich bei SSH mit Username/Passwort einloggen, oder mit einem digitalen Schlüsselpaar. Letzteres ist sicherer, da ein ausreichend langer Schlüssel mit heutiger Technik nicht knackbar ist, während Passwörter oft zu kurz und zu leicht erratbar gewählt werden. Bedenken Sie, dass ein Angreifer beliebig oft beliebige Passwörter ausprobieren kann, solange Ihr SSH-Zugriff offen ist. Ich empfehle daher, ausschliesslich die Schlüsselbasierte Authentisierung anzuwenden und den Schlüssel mit einem Passwort zusätzlich zu sichern, falls das Endgerät einmal in falsche Hände geraten sollte.

### Linux und Mac

Erstellen Sie ein Schlüsselpaar mit `ssh-keygen -t rsa`.  Das Programm wird Sie fragen, wohin Sie den Schlüssel speichern wollen. Wenn dies sowieso Ihr einziger ssh-Schlüssel ist, können Sie die Vorgabe belassen (macOS: /Users/username/.ssh/id_rsa, linux: /home/username/.ssh/id_rsa). Andernfalls geben Sie einen anderen Pfadnahmen an, ich würde aber empfehlen, als Speicherort den Ordner .ssh in Ihrem Heimatverzeichnis zu belassen. Also z.B. /Users/ihrname/.ssh/praxis_key. Dann möchte das Programm ein Passwort oder einfach Eingabetaste, um den Schlüssel ohne Passwort zu speichern. Ich würde empfehlen, ein Passwort einzugeben, für den Fall, dass mal Unbefugte an den Coomputer kommen.
Wohlbemerkt: Hier geht es nicht um das Passwort für den Zugriff, sondern nur um ein Passwort, mit dem der eigentliche Schlüssel auf dem lokalen Computer gesichert wird. Daher sind hier die Anforderungen auch nicht so hoch, und dieses Passwort darf ruhig relativ "banal" sein. Es muss keinen automatisierten Knackprogrammen standhalten, sondern nur Eintippen an der Konsole, und auch das nur so lang, bis der Zugriff auf dem Server gesperrt wird.

Wenn es erfolgreich durchgelaufen ist, hat ssh-keygen einen öffentlichen Schlüssel (id_rsa.pub, resp. praxis_key.pub) und einen privaten Schlüssek (id_rsa resp. praxis_key) erstellt. Nun müssen wir den öffentlichen Schlüssel auf den Server hochladen. Der Private Schlüssel bleibt immer auf dem lokalen Computer. Bei der Vernindungsaufnahme wird der Server den Client auffordern, eine bestimmte Zeichenfolge mit dem privaten Schlüssel zu versachlüsseln und kann dann mit dem öffentlichen Schlüssek prüfen, ob der Client wirklich den passenden privaten Schlüssel hat.

Am einfachsten laden Sie den öffentlichen Schlüssel mit `ssh-copy-id username@praxis-dr-eisenbart.ch` auf das Konto 'username' des Praxisservers hoch. Dazu werden Sie das Passwort des Loginkontos von 'username' eingeben müssen.

Sie können das natürlich auch manuell erledigen: Der öffentliche Schlüssel muss in die Datei authorized_keys auf dem Server eingefügt werden. Anleitungen dazu finden Sie im Netz.

Die Verbindungsaufnahme erfolgt dann mit `ssh -i ~/.ssh/praxis_key username@praxis-dr-eisenbart.ch`. Dieses Kommando sollte Sie nach dem Passwort des Schlüssels fragen und dann ohne weitere Fragen in ein Konsolenfenster auf dem Server führen.

Das genügt aber noch nicht. Wir wollen ja einen Zugriff auf mysql bzw. Webelexis haben. Dazu müssen wir eine sogenannte 'Portweiterleitung' oder port `forwarding einrichten`. Genau: Etwas Ähnliches, was Sie bereits beim Router gemacht haben. Nur dass jetzt der SSH Server die Rolle des Routers übernimmt und der SSH Client die Portweiterleitung dynamisch erstellen kann. Man kann eine solche Weiterleitung ebenfalls auf der ssh Kommandozeile einrichten, aber ich würde ein einfacheres Vorgehen empfehlen:

Erstellen Sie eine Dtaei namens 'config' im Verzeichnis .ssh in Ihrem Heimatverzeichnis. Schreiben Sie in diese Daqtei den folgenden Block:

```
Host praxis
    HostName praxis-dr-eisenbart.ch
    User username
    Port 36223
    LocalForward 3307 127.0.0.1:3306
    LocalForward 2018 127.0.0.1:2018
    IdentityFile /Users/username/.ssh/praxis_key        
```

Natürlich müssen Sie for HostName, User, Port und Identityfile die bei Ihnen zutreffenden Angaben einsetzen. Dann können Sie zukünftig einfach mit `ssh praxis` die Verbindung herstellen. Danach geht folgendes:

* Sie können eine lokale Elexis-Instanz mit dem Server localhost, Port 3307 verbinden und Elexis starten.

* Sie können mit einem Webbrowser auf localhost:2018 gehen, um Webelexis zu starten.

In beiden Fällen wird ssh die Verbindung automatisch und unsichtbar auf den Praxisserver umleiten. Das Einzige, was Sie bemerken werden ist eine geringere Geschwindigkeit insbesondere bei Elexis, das nicht gut für Langsame Verbindungen geeignet ist.


### Android

Ich zeige hier das Vorgehen für die App 'JuiceSSH', die Sie vom Playstore herunterladen können. Es gibt viele andere SSH clients für Android; möglicherweise ist das Vorgehen dort anders.

* Gehen Sie nach dem Start vonm JuiceSSH auf 'Verbindungen' und dort auf 'Identitäten'. Berühren Sie das '+' unten rechts, um eine neue Identität zu erstellen. Erstellen Sie für diese Identität ein neues Schlüsselpaar:

![](../images/juice1.jpg)

Klicken Sie dann auf OK und geben Sie den usernamen auf dem Server und ev. das Kennwort ein.

![](../images/juice2.jpg)

Wenn Sie die Kaufversion von JuiceSSH haben, können Sie untern auf "Snippet erstellen" klicken, um das Hochladen des öffentlichen Schlüssels zu automatisieren.

* Erstellen Sie eine neue Verbindung für Ihre Praxis und ordnen Sie dieser Verbindung die vorhin erstellte Identität zu.

![](../images/juice3.jpg)

Vergessen Sie nicht, auf das Häkchen rechts oben zu drücken, um die Verbindung zu speichern.

* Als Letztes müssen wir noch die Port-Weiterleitung einrichten (Die Theorie dazu habe ich weiter oben unter "Linux" beschrieben).

![](../images/juice4.jpg)

Wenn Sie jetzt die SSH Verbindung in JuiceSSH öffnen, wird direkt der Browser mit Webelexis gestartet. Allerdings hat Webelexis in der derzeitigen Version noch keine gute Drarsellung für kleine Mobilbildschirme. Wählen Sie in den Browser-Optionen die "Desktop-Version" an, um damit arbeiten zu können.

### iOS

### Windows

Unter Windows erledigen Sie die SSH-Verbindung am besten mit dem Programm [Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html). Sie benötigen eigentlich nur "putty.exe" und "puttygen.exe", nicht den kompletten Installer.

* Erstellen Sie ein Schlüsselpaar mit puttygen.exe

![](../images/puttygen.png)

Speichern Sie den privaten Schlüssel an einem Ort, den Sie später wiederfinden, zum Beispiel als 'praxis_key.ppk'. Den öffentlichen Schlüssel können Sie auf einem tragbaren Medium speichern, oder per strg+X aus dem oberen Feld ausschneiden. Dieser muss nach 'authorized_keys' auf dem Server.

* Erstellen Sie eine neue Verbindung in putty.exe.

![](../images/putty1.png)

Speichern Sie die Verbindung.

* Geben Sie die benötigten Daten ein (Zur Theorie, siehe den Abschnitt unter "Linux".)

Username eingeben: 

![](../images/putty2.png)

Privaten Schlüssel angeben:

![](../images/putty3.png)

Tunnels konfigurieren:

![](../images/putty4.png)

Vergessen Sie nicht, am Ende wieder zur Anfangsseite (Session) zurückzukehren, und die Verbindung nochmal zu speichern, wenn Sie alles eingegeben haben. Sonst "vergisst" Putty es bis zum  nächsten Mal wieder.

Von da an können Sie einfach auf die gespeicherte Session doppelklicken, um die Verbindung zu Ihrer Praxis erzustellen. Sie können dann entweder eine Elexis-Verbindung zu localhost auf Port 3307 oder eine Browser-Verbindung zu localhost auf Port 2018 machen, die von putty zum SSH Server der Praxis durchgeleitet wird.


## Absichern

Wenn die Schlüsselerstellung auf allen SSH-berechtigten Computern  aller zugelassenen Anwender durchgeführt wurde, kann man auf dem Server in /etc/ssh/sshd_config die Zeile PasswoerAuthentication auf 'no' setzen und den SSH Server mit `sudo service sshd restart`bzw. `sudo systemctl restart sshd` neu starten. Von da an ist der Zugriff nur noch via Schlüssel möglich.

