# Backup

##  Grundlagen

Datensicherung ist nie überflüssig. Jede Computer-Festplatte wird irgendwann defekt sein. Leider weiss man nicht wann. Die Ausfallrate ist am Anfang relativ hoch (wegen Produktionsfehlern), sinkt dann auf sehr geringe Werte ab und steigt ab etwa dem dritten Jahr wieder an. Die Datensapeicherungs-Firma Backblaze gibt regelmössig Lebensdauerwerte ihrer derzeit rund 100000 Festplatten an: <https://www.backblaze.com/blog/2018-hard-drive-failure-rates/>. Die durchschnittliche jährliche Ausfallrate wird mit rund 1.7% errechnet, wobei die Firma ihre Platten jeweils nach etwa 4 Jahren austauscht. 

Bei SSDs gibt es naturgemäss noch wenige Daten, als bei magnetischen Festplatten, aber es ist bekannt, dass jede SSD-Spüeicherzelle nur eine limitierte Zahl von Schreibvorgängen aushält (die allerdings immerhin wesentlich grösser ist, als früher angenommen).

Wie auch immer: Das Prinzip Hoffnung ist verkehrt, wenn es um wichtige Daten geht. Und es nützt auch nicht viel, ein RAID statt einer einzelnen Platte zu verwenden. Einige Überlegungen dazu habe ich [hier](http://rgwch.github.io/2015/09/datensicherheit) zusammengefasst.

Bevor wir uns für ein Datensicherungskonzept entscheiden, brauchen wir einen Anforderungskatalog:

Das Backup-System muss folgende Eingenschaften haben:

* Vom Hauptsystem unabhängig - Wir müssen ja auf die Daten auch dann zugreifen können, wenn nicht nur die Platte, sondern der ganze Server ausfällt.

* Versioniert - Wir brauchen nicht nur den momentanen Stand, sondern auch einige ältere Versionen. Stellen Sie sich vor, ein Erpressungs-Trojaner oder ein Hardware-Defeklt oder eine Fehlbedienung zerstört einen Teil Ihrer Daten, und Sie merken das erst nach dem Backup - Ein einzelnes Backup wäre dann auch gleich zerstört. Dann muss es die Möglichkeit geben, eine ältere Version einzuspielen.

* Verschlüsselt - In der Datensicherung sind exakt dieselben Daten, wie im Hauptsystem, und diese müssen genauso sicher gegen unerlaubten Zugriff gesichert sein.

* Automatisierbar - Wenn Sie dran denken müssen, ein Backup anzufertigen, dann werden Sie es vergessen. Und [Murphy's law](https://de.wikipedia.org/wiki/Murphy’s_Law) garantiert, dass der Server genau dann kaputt geht, wenn das letzte  Backup länger als zwei Wochen her ist.

* Wiederherstellbar - Das ist natürlich eine Binsenweisheit. Was nützt ein Backup, das nicht wiederhersgestellt werden kann? Leider ist es durchaus nicht selbstverständlich. Backups laufen ja, wie oben betont, idealerweise automatisch ab, zum Beispiel mit einem nächtlichen Hintergrund-Job. Je nachdem passiert dabei ein Fehler und niemand sieht die Fehlermeldung... Und wenn Sie an den Punkt Verschlüsselung denken: Sie müssen sicher sein, dass die Verschlüsselung auch wieder entschlüsselt werden kann. Dazu gehört, dass Sie ein Programm benötigen, das den angewendeten Algorithmus beherrscht, und Sie müüssen sich auch nach 10 Jahren noch an das verwendete Pasxswort erinnern. Und last but not least müssen auch die verwendeten Speichermedien  mit dem Computer, den Sie in 10 Jahren benutzen werden, noch lesbar sein. Auch das ist nicht so selbstverständlich, wie man meinen könnte: Wenn Sie vor 20 Jahren Ihre Daten auf den damals weit verbreiteten Floppy Disks gespeichert haben, dann werden Sie heute echte Probleme haben, an diese Daten wieder heranzukommen. Und zwar sogar dann, wenn Sie auch ein Laufwerk für solche Floppy Disks aufbewahrt haben: Sie werden es an Ihren heutigen PC nicht anschliessen können. Und wenn Sie Ihre Datensicherung auf CDs oder DVDs speichern, dann ist die Gefahr nicht vernachlässigbar, dass diese nach 10 Jahren nicht mehr vollständig lesbar sind. Dasselbe gilt für magnetische Platten.

### Backup-Konzepte

#### Plattenrotation

Eine tragbare Festplatte nimmt jeweils ein Backup auf und wird dann gegen eine andere identische Pkatte ausgetauscht. Wenn man beispielsweise fünf solcher Platten verwendet, kann man an jedem Arbeitstag eine andere einsetzen, und auf jeder vielleicht 10 Datensicherungs-Generationen speichern, die dann jeweils eine Woche auseinander liegen. Damit wird der Verlust jeder einzelnen Platte oder sogar mehrere Platten verschmerzbar. Idealerweise lagern Sie die Platten auch an verschiedenen Orten, so dass auch bei einem Euinbruch oder Brand nicht alles verloren ist.

* Vorteil: Dadurch, dass Sie jede Platte immer wieder verwenden, ist sichergestellt, dass sie funktionieren. Trotzdem sollten Sie sie nach etwa 5 Jahren auswechseln.

* Nachteil: Man muss doch wieder an etwas denken... Wenn man vergisst, die Platten auszutauschen, baut man ein "Klumpenrisiko" mit der gerade angeschlossenen Platte auf, und gemäss Murphy werden Sie erst merken, dass diese Platte schon länger ausgefallen ist, wenn Ihre Server-Festplatte aussteigt, und Sie ein möglichst aktuelles Backup benötigen.

#### Fernbackup

Sie können Ihre Daten mit einem geeigneten Programm auf einen oder mehrere andere Computer sichern. Dies kann man genausn leicht automatisieren, wie dier Sicherung auf eine externe Festplatte.

* Vorteil: Keine zusätzliche Hardware am Praxis-System, man muss nicht an Plattentausch etc. denken.

* Nachteil: Das Backup wird viel länger dauern, da das Netzwerk langsamer ist, als eine angeschlossene Fewstplatte. Weiterer Nachteil: Murphy wird dafür sorgen, dass der Internetzugang just dann schanrchlangsam oder ganz ausgefallen ist, wenn Sie Ihr Backup dringend zurückspielen wollen

