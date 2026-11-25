/* ------------------------------------------------------------------
   LSU-VET · data store
   ------------------------------------------------------------------
   Right now the site runs on MOCK DATA:
     • js/data.js holds every table as `const DB = { pets: [...], ... }`
     • edits are kept in this browser (localStorage); "Reset demo data"
       puts the mock data back

   TO CONNECT THE DATABASE (see README → "Connecting the database"):
     1. Load:  fill `DB` with the real rows (the SELECTs in queries.sql)
               instead of the mock data in js/data.js.
     2. Save:  fill in sendToDatabase() below. It already receives every
               insert / update / delete the user makes, one object per row.
   Nothing else in the frontend needs to change.
------------------------------------------------------------------- */
dbReady.then(function () {
  const KEY = "lsuvet.db.v2";
  const clone = o => JSON.parse(JSON.stringify(o));

  /* ================================================================
     CONNECT THE DATABASE HERE
     ----------------------------------------------------------------
     Called after every Save / New / Delete with the list of rows that
     changed. Each change looks like one of these:

       { op: "insert", table: "pets", row: { pet_id: 21, name: "Rex", ... } }
       { op: "update", table: "pets", key: { pet_id: 1 }, row: { ...all columns } }
       { op: "delete", table: "pets", key: { pet_id: 1 } }

     Each one maps to exactly one query in queries.sql (the section
     named after `table`). Run the whole list in ONE transaction, in the
     order given: it is already sorted so foreign keys never break.

     Dates in `row` are ISO ("2020-04-12", "2026-07-01T13:30"); convert
     them to the format vet.db uses (see README) before saving.

     Until this is connected it only prints the changes to the browser
     console (F12 → Console), so you can see exactly what will be sent.
     Example once a backend exists:

       return fetch("/api/sync", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ ops: changes }),
       }).then(r => { if (!r.ok) throw new Error("Save failed"); });
     ================================================================ */
    function sendToDatabase(changes) {
    try {
      applyChanges(changes);
    } catch (e) {
      console.error(e);
      toast("Database error: " + e.message);
    }
  }

  // Primary key of every table, in parent → child order (FK-safe).
  const TABLES = [
    ["clients", ["client_id"]],
    ["staff", ["staff_id"]],
    ["pets", ["pet_id"]],
    ["medications", ["med_id"]],
    ["appointments", ["appt_id"]],
    ["administered", ["administer_id"]],
    ["prescriptions", ["rx_id"]],
    ["invoices", ["invoice_id"]],
    ["payments", ["payment_no"]],
  ];


  let snapshot = clone(DB);

  // Compare the last saved state with DB and list the row changes.
  function diff() {
    const ops = { del: [], put: [] };
    for (const [t, cols] of TABLES) {
      const keyOf = r => JSON.stringify(cols.map(c => r[c]));
      const keyObj = r => Object.fromEntries(cols.map(c => [c, r[c]]));
      const before = new Map((snapshot[t] || []).map(r => [keyOf(r), r]));
      const after = new Map((DB[t] || []).map(r => [keyOf(r), r]));
      for (const [k, r] of before) if (!after.has(k)) ops.del.push({ op: "delete", table: t, key: keyObj(r) });
      for (const [k, r] of after) {
        const old = before.get(k);
        if (!old) ops.put.push({ op: "insert", table: t, row: r });
        else if (JSON.stringify(old) !== JSON.stringify(r)) ops.put.push({ op: "update", table: t, key: keyObj(old), row: r });
      }
    }
    return [...ops.del.reverse(), ...ops.put]; // delete children first, insert parents first
  }

  window.Store = {
    // Called by the pages after every Save / New / Delete.
    save() {
      const changes = diff();
      snapshot = clone(DB);
      if (changes.length) sendToDatabase(changes);
    },
    // "Reset demo data": back to the mock data in js/data.js.
    reset() {
      clearSession();
    },
  };
});
