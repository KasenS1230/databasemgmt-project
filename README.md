# databasemgmt-project · LSU-VET

Vet clinic database (SQLite) + website. The website runs on **mock data** right now. It isn't connected to `vet.db` yet.

## Run it

Double-click `home.html`. Nothing to install.

Edits save in your browser. **Reset demo data** (bottom left) undoes them.
Switch users with **Signed in as** (top right).

If `vet.db` is missing, rebuild it:

```
python init_db.py
python insert_data.py
```

## Connect it to vet.db

Two spots to change. Both already use the real table and column names.

**1. Load.** Pages read their data from `const DB = {...}` in `js/data.js` (mock data).
Fill it with real rows from the `SELECT` queries in `queries.sql`.

**2. Save.** `sendToDatabase(changes)` in `js/store.js` runs after every Save / New / Delete. Right now it only prints to the console (F12).
Each change is one of:

```js
{ op: "insert", table: "pets", row: {...} }
{ op: "update", table: "pets", key: { pet_id: 1 }, row: {...} }
{ op: "delete", table: "pets", key: { pet_id: 1 } }
```

Run the matching `INSERT` / `UPDATE` / `DELETE` from `queries.sql`.

**Names.** The website uses plural names. `pets` = `pet`, `clients` = `client`, and so on (`staff` and `administered` stay the same).

**Dates.** The website uses `2020-04-12` and `2026-07-01T10:00`. `vet.db` uses `07-01-2026`, `07-01-2026 10:00:00`, and `04-12-20` for `pet.birth_date`. Convert both ways.

## Files

```
init_db.py, insert_data.py   build vet.db
vet.db                       the database
queries.sql                  every SELECT / INSERT / UPDATE / DELETE, per table
*.html, css/, js/            the website
js/data.js                   mock data   ← replace with real data
js/store.js                  saving      ← sendToDatabase()
```
