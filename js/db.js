
const SAVE_KEY = "vetdb.session";
let sqlDb = null;

const dbReady = (async () => {
  const SQL = await initSqlJs({
    locateFile: f => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/" + f
  });
    // Use the edited copy from this tab if there is one, otherwise the real vet.db
  const saved = sessionStorage.getItem(SAVE_KEY);
  if (saved) {
    sqlDb = new SQL.Database(fromBase64(saved));
  } else {
    const buf = await fetch("vet.db", { cache: "no-store" }).then(r => r.arrayBuffer());
    sqlDb = new SQL.Database(new Uint8Array(buf));
  }
  sqlDb.run("PRAGMA foreign_keys = ON");


  if (document.readyState === "loading") {
    await new Promise(r => document.addEventListener("DOMContentLoaded", r));
  }

  loadFromVetDb();  
  



})();



// Website name -> [vet.db table, primary key]
const TABLES = {
  clients: ["client", "client_id"],
  staff: ["staff", "staff_id"],
  pets: ["pet", "pet_id"],
  medications: ["medication", "med_id"],
  appointments: ["appointment", "appt_id"],
  administered: ["administered", "administer_id"],
  prescriptions: ["prescription", "rx_id"],
  invoices: ["invoice", "invoice_id"],
  payments: ["payment", "payment_no"],
};

// Columns stored as MM-DD-YYYY (or MM-DD-YY) in vet.db
const DATE_COLS = {
  staff: ["hire_date"],
  pets: ["birth_date", "deceased_date"],
  administered: ["next_due_date"],
  prescriptions: ["date_written"],
  payments: ["pay_date"],
};

// "07-01-2026" or "04-12-20" -> "2026-07-01" / "2020-04-12"
function dateToIso(s) {
  if (!s) return s;
  let [m, d, y] = s.split("-");
  if (y.length === 2) y = "20" + y;
  return `${y}-${m}-${d}`;
}

// "07-01-2026 13:00:00" -> "2026-07-01T13:00"
function dateTimeToIso(s) {
  if (!s) return s;
  const [date, time] = s.split(" ");
  const [h, min] = time.split(":");
  return `${dateToIso(date)}T${h.padStart(2, "0")}:${min}`;
}

// Fill DB with every table from vet.db
function loadFromVetDb() {
  for (const [site, [table, key]] of Object.entries(TABLES)) {
    const stmt = sqlDb.prepare(`SELECT * FROM ${table} ORDER BY ${key}`);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    for (const r of rows) {
      for (const c of DATE_COLS[site] || []) r[c] = dateToIso(r[c]);
      if (site === "appointments") r.appt_datetime = dateTimeToIso(r.appt_datetime);
    }
    DB[site] = rows;
  }
}

// sessionStorage can only hold text, so the database bytes are stored as base64
function toBase64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}
function fromBase64(str) {
  const s = atob(str);
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes;
}

// Keep the edited database for the other pages (until the tab is closed)
function saveSession() {
  sessionStorage.setItem(SAVE_KEY, toBase64(sqlDb.export()));
}
// "Reset demo data": forget the edits so the next load uses vet.db again
function clearSession() {
  sessionStorage.removeItem(SAVE_KEY);
}

// "2026-07-01" -> "07-01-2026"   (birth_date: "2020-04-12" -> "04-12-20")
function isoToDate(s, shortYear) {
  if (!s) return s;
  const [y, m, d] = s.split("-");
  return `${m}-${d}-${shortYear ? y.slice(2) : y}`;
}
// "2026-07-01T13:00" -> "07-01-2026 13:00:00"
function isoToDateTime(s) {
  if (!s) return s;
  const [date, time] = s.split("T");
  return `${isoToDate(date)} ${time}:00`;
}

// Turn a website row into a vet.db row (only real columns, dates converted)
function toDbRow(site, row) {
  const [table] = TABLES[site];
  const cols = sqlDb.exec(`PRAGMA table_info(${table})`)[0].values.map(c => c[1]);
  const out = {};
  for (const c of cols) if (c in row) out[c] = row[c] ?? null;
  for (const c of DATE_COLS[site] || []) if (c in out) out[c] = isoToDate(out[c], c === "birth_date");
  if (site === "appointments" && out.appt_datetime) out.appt_datetime = isoToDateTime(out.appt_datetime);
  return out;
}

// Run the website's changes as INSERT / UPDATE / DELETE, all or nothing
function applyChanges(changes) {
  sqlDb.run("BEGIN");
  try {
    for (const c of changes) {
      const [table, key] = TABLES[c.table];
      if (c.op === "delete") {
        sqlDb.run(`DELETE FROM ${table} WHERE ${key} = ?`, [c.key[key]]);
        continue;
      }
      const row = toDbRow(c.table, c.row);
      const cols = Object.keys(row);
      const vals = cols.map(k => row[k]);
      if (c.op === "insert") {
        sqlDb.run(`INSERT INTO ${table} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`, vals);
      } else {
        sqlDb.run(`UPDATE ${table} SET ${cols.map(k => k + " = ?").join(", ")} WHERE ${key} = ?`, [...vals, c.key[key]]);
      }
    }
    sqlDb.run("COMMIT");
  } catch (e) {
    sqlDb.run("ROLLBACK");
    throw e;
  }
  saveSession();
}