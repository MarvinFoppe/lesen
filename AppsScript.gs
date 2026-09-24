/**
 * Mein Leseregal – Google Sheets Sync-Backend
 *
 * Einmalig einrichten:
 *  1. Neues Google Sheet anlegen: sheets.new  (im Google-Konto, das du nutzen willst).
 *  2. Menü: Erweiterungen → Apps Script.
 *  3. Den kompletten Standard-Code löschen und DIESEN Code einfügen. Speichern (💾).
 *  4. Oben rechts: Bereitstellen → Neue Bereitstellung.
 *     - Typ (Zahnrad): Web-App
 *     - Ausführen als: Ich
 *     - Zugriff: Jeder  (wichtig, damit die Webseite es aufrufen darf)
 *     - Bereitstellen → Zugriff autorisieren
 *       (Konto wählen → „Erweitert" → „Zu … (unsicher)" → Zulassen).
 *  5. Die „Web-App-URL" kopieren (endet auf /exec).
 *  6. In index.html oben bei  const ENDPOINT = "…"  einfügen.
 *
 * Speichert pro Sync-Code (room) den kompletten Regal-Stand als JSON in einer Zeile.
 * Der Client mergt vor dem Speichern eintrags-weise (updatedAt je Buch) → kein Datenverlust
 * zwischen Geräten.
 */

var HEADERS = ['room', 'data', 'updated_at'];

function getSheet() {
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (s.getLastRow() === 0) s.appendRow(HEADERS);
  return s;
}

function findRow(s, room) {
  var vals = s.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) {
    if (String(vals[i][0]) === String(room)) return i + 1; // 1-basiert
  }
  return -1;
}

// Laden: GET ?room=xxx
function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var p = e.parameter || {};
    var s = getSheet();
    var row = findRow(s, p.room);
    if (row < 0) return json({ ok: true, data: null });
    var data = s.getRange(row, 2).getValue();
    var upd = s.getRange(row, 3).getValue();
    var parsed = null;
    try { parsed = JSON.parse(data); } catch (_) {}
    return json({ ok: true, data: parsed, updated_at: upd });
  } finally {
    lock.releaseLock();
  }
}

// Speichern: POST body {room, data}   (data = JSON-String des kompletten state)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var body = {};
    try { body = JSON.parse(e.postData.contents); } catch (_) {}
    var room = body.room;
    var data = body.data || '';
    if (!room) return json({ ok: false, error: 'no room' });
    var upd = new Date().toISOString();

    var s = getSheet();
    var row = findRow(s, room);
    if (row < 0) {
      s.appendRow([room, data, upd]);
    } else {
      s.getRange(row, 2).setValue(data);
      s.getRange(row, 3).setValue(upd);
    }
    return json({ ok: true, updated_at: upd });
  } finally {
    lock.releaseLock();
  }
}

function json(o) {
  return ContentService
    .createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
