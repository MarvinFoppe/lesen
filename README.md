# 📚 Mein Leseregal

Privates Tool zum Erfassen gelesener **Bücher, Zeitschriften & Comics** – mit
Barcode-/ISBN-Scan, Fortschritt (Seite X von Y), Vorschlägen auf Basis deines
Leseverhaltens, Geräte-Sync und Import aus der Bookshelf-App.

Alles steckt in einer einzigen Datei: **`index.html`**.

---

## Funktionen

- **Erfassen per Kamera-Scan** (ISBN-Barcode), per **Suche** (Titel/Autor/ISBN) oder **manuell**.
- Buchdaten aus **Open Library** (primär) + **Google Books** (Fallback): Titel, Autor, Cover, Seitenzahl, Jahr, Genre.
- **Art:** Buch / Zeitschrift / Comic. **Status:** ungelesen · lese gerade · gelesen · abgebrochen.
- **Fortschritt** als *Seite X von Y* – mit +/–-Buttons und automatischer Prozentanzeige.
- **Serien/Reihen** mit Band-Nummer.
- **Vorschläge „Schon gelesen?"** – Durchklick-Deck aus:
  - fehlenden **Bänden** deiner Reihen,
  - weiteren Werken deiner **Lieblingsautor:innen**,
  - Titeln aus deinen **Genres**,
  - **Klassikern** deiner Lieblingsbereiche.
- **Statistik:** gelesene Seiten, Verteilung nach Art, Top-Autor:innen, Serien-Fortschritt.
- **Geräte-Sync** über ein Google Sheet (gleicher Sync-Code auf allen Geräten).
- **Import** aus Bookshelf / Goodreads / beliebiger CSV & Excel mit Spalten-Vorschau.
- **Backup** als JSON (Export/Restore).

---

## 1) Geräte-Sync einrichten (optional, aber empfohlen)

1. `sheets.new` → neues Google Sheet anlegen.
2. **Erweiterungen → Apps Script**.
3. Inhalt aus **`AppsScript.gs`** einfügen, speichern.
4. **Bereitstellen → Neue Bereitstellung → Web-App**
   - *Ausführen als:* Ich
   - *Zugriff:* **Jeder**
   - Autorisieren (ggf. „Erweitert" → „Zu … (unsicher)" → Zulassen).
5. **Web-App-URL** kopieren (endet auf `/exec`).
6. In `index.html` ganz oben im Script eintragen:
   ```js
   const ENDPOINT = "https://script.google.com/macros/s/DEINE-ID/exec";
   ```
7. In der App unter **⚙️ Mehr → Sync-Code** auf jedem Gerät denselben Code eingeben
   (z. B. `marvin-buecher`).

> Ohne ENDPOINT läuft alles trotzdem lokal (localStorage) + JSON-Backup.

---

## 2) Auf GitHub Pages veröffentlichen

Kamera-Scan braucht **HTTPS** – deshalb GitHub Pages (nicht `file://`).

```bash
cd ~/Desktop/Marvin/Seiten/lesen
git init
git add index.html            # AppsScript.gs/README optional
git commit -m "Leseregal"
git branch -M main
git remote add origin https://github.com/MarvinFoppe/lesen.git   # Repo vorher anlegen
git push -u origin main
```

Dann auf GitHub: **Settings → Pages → Branch: `main` / root**.
Live unter `https://marvinfoppe.github.io/lesen/`.

Auf dem Handy im Browser öffnen → beim Scannen Kamerazugriff erlauben →
„Zum Home-Bildschirm" für App-Feeling.

---

## 3) Aus der Bookshelf-App importieren

1. In **Bookshelf** die Bibliothek exportieren (Einstellungen → Export, CSV oder Excel).
2. In dieser App: **⚙️ Mehr → „CSV / Excel hochladen"**.
3. Datei wählen → die Spalten werden **automatisch erkannt**; in der Vorschau
   ggf. korrigieren (Titel, Autor, ISBN, Seiten, Status/Regal, Serie …).
4. Optional „Cover & fehlende Infos online nachladen" anhaken.
5. **Importieren** – Dubletten (gleiche ISBN oder Titel+Autor) werden übersprungen.

Der Importer versteht auch **Goodreads-CSV** und andere Tabellen.

---

## Hinweise

- Daten liegen im Browser (localStorage) und – bei aktivem Sync – im Google Sheet.
- Sync ist eintrags-basiert (Zeitstempel je Titel), damit zwei Geräte sich nicht
  gegenseitig überschreiben.
- Externe Libraries per CDN: ZXing (Barcode), SheetJS (Excel). Google Fonts (Fraunces/DM Sans).
