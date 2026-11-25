
let sqlDb = null;

const dbReady = (async () => {
  const SQL = await initSqlJs({
    locateFile: f => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/" + f
  });
  const buf = await fetch("vet.db").then(r => r.arrayBuffer());
  sqlDb = new SQL.Database(new Uint8Array(buf));


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