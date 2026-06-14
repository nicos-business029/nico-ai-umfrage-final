const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "engpass-admin";
// DATA_DIR kann per Umgebungsvariable überschrieben werden (z. B. für einen
// persistenten Volume-Mount beim Hoster). Lokal: server/data.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "responses.db");
const DIST = path.join(__dirname, "..", "dist");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS responses (
    id TEXT PRIMARY KEY,
    submitted_at TEXT NOT NULL,
    data TEXT NOT NULL
  )
`);

const app = express();
app.use(cors());
app.use(express.json());

function requireAuth(req, res, next) {
  const auth = req.headers["authorization"] || "";
  const token = auth.replace("Bearer ", "").trim();
  if (token !== ADMIN_PASSWORD) return res.status(401).json({ error: "Nicht autorisiert" });
  next();
}

// --- API routes ---

app.post("/api/responses", (req, res) => {
  const id = crypto.randomUUID();
  const submitted_at = new Date().toISOString();
  db.prepare("INSERT INTO responses (id, submitted_at, data) VALUES (?, ?, ?)").run(id, submitted_at, JSON.stringify(req.body));
  res.json({ id });
});

app.get("/api/responses/export.csv", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT id, submitted_at, data FROM responses ORDER BY submitted_at DESC").all();
  const parsed = rows.map((r) => ({ id: r.id, submitted_at: r.submitted_at, ...JSON.parse(r.data) }));
  const fields = [
    "id", "submitted_at", "sprache",
    "hauptaufgabe", "haeufigkeit",
    "manuelleArbeit", "aktuelleLoesung",
    "belastung", "schonGezahlt", "schonGezahltWofuer",
    "wunschtool",
  ];
  const esc = (v) => { if (v == null) return ""; return `"${String(v).replace(/"/g, '""')}"`; };
  const csv = [fields.join(";"), ...parsed.map((r) => fields.map((f) => esc(r[f])).join(";"))].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=umfrage-antworten.csv");
  res.send("﻿" + csv);
});

app.get("/api/responses", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT id, submitted_at, data FROM responses ORDER BY submitted_at DESC").all();
  res.json(rows.map((r) => ({ id: r.id, submitted_at: r.submitted_at, ...JSON.parse(r.data) })));
});

app.delete("/api/responses/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM responses WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// --- Serve built frontend in production ---
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  // SPA-Fallback: alle nicht-API-Routen liefern index.html (Express-5-kompatibel)
  app.use((req, res) => res.sendFile(path.join(DIST, "index.html")));
}

app.listen(PORT, () => {
  console.log(`\n✓ Server läuft auf http://localhost:${PORT}`);
  console.log(`✓ Datenbank: ${DB_PATH}`);
  console.log(`✓ Admin-Passwort: ${ADMIN_PASSWORD}\n`);
});
