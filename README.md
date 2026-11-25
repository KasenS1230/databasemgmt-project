# databasemgmt-project · LSU-VET

A vet clinic database (SQLite, `vet.db`) and a 6-page website that reads and edits it.

## Open the website

**Online (easiest):** https://kasens1230.github.io/databasemgmt-project/

Nothing to install. It works in any modern browser.

**On your own computer:**

1. Clone or download this repo.
2. Open a terminal in the project folder and run:
   ```
   python -m http.server
   ```
   (Use `python3` on Mac/Linux or `py` on Windows if `python` isn't recognized.)
3. Go to http://localhost:8000

Opening the HTML files by double-clicking won't work. Browsers block pages opened that way from loading `vet.db`.

## Using it

- **Switch users** with **Signed in as** (top right). Each role sees different pages.
- **Edit, add and delete** records on any page. Every change runs a real `INSERT`, `UPDATE` or `DELETE` on the database, and the change shows up on all pages.
- **Reset demo data** (bottom left) undoes every change and reloads the original `vet.db`. Closing the tab does the same thing.

The `vet.db` file in the repo is never changed by the website, so every visitor starts from the same data.

## How it works

The website uses [sql.js](https://sql.js.org) (SQLite compiled to JavaScript) to open `vet.db` inside the browser, so no server or backend is needed.

1. **Load:** `js/db.js` downloads `vet.db`, runs a `SELECT` on each table, and gives the rows to the pages.
2. **Save:** after each Save / New / Delete, `js/store.js` works out which rows changed and `applyChanges()` in `js/db.js` runs the matching SQL in one transaction, with foreign keys turned on.
3. **Carry over:** the edited database is kept in the tab's `sessionStorage`, so all 6 pages see the same data until you reset or close the tab.

`db.js` also converts dates between the two formats. The website uses `2026-07-01` and `2026-07-01T13:00`. `vet.db` uses `07-01-2026`, `07-01-2026 13:00:00`, and `04-12-20` for `pet.birth_date`.

## Rebuild the database

To recreate `vet.db` from scratch (for example, after changing the sample data):

```
del vet.db          (Mac/Linux: rm vet.db)
python init_db.py
python insert_data.py
```

Delete the old `vet.db` first. Otherwise the inserts fail because the rows already exist.

## Files

```
vet.db                       the database
init_db.py                   creates the tables
insert_data.py               fills them with sample data
queries.sql                  the SELECT / INSERT / UPDATE / DELETE queries for each table

index.html                   redirects to home.html
home.html                    dashboard
front-desk.html, schedule.html, clinical.html, billing.html, admin.html
css/styles.css               styles

js/db.js                     opens vet.db, loads the tables, saves changes
js/store.js                  tracks edits and sends them to db.js
js/data.js                   empty DB object, filled by db.js
js/shell.js                  sidebar, role picker, reset button
js/app.js, js/crud.js        page logic
```
