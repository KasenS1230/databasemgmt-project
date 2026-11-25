/* ------------------------------------------------------------------
   LSU-VET front end
   ------------------------------------------------------------------
   Everything entity-specific lives in the ENTITIES config below.
   To hook up the real database:
     1. Replace the arrays in js/data.js with query / API results
        (same column names as the ER diagram).
     2. Only touch ENTITIES if you want to change what is displayed.
------------------------------------------------------------------- */

/* ---------- primary keys per table ---------- */
const PK = {
  clients: "client_id", pets: "pet_id", staff: "staff_id", appointments: "appt_id",
  medications: "med_id", prescriptions: "rx_id", invoices: "invoice_id", payments: "payment_no",
};
const pk = (table, row) => row[PK[table]];
const find = (table, id) => DB[table].find(r => pk(table, r) === id) || null;
const where = (table, col, val) => DB[table].filter(r => r[col] === val);

/* ---------- formatting ---------- */
const TODAY = new Date();
const money = n => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = d => d ? new Date(d.length === 10 ? d + "T00:00" : d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtDT = d => new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const initials = (f, l) => (f[0] + l[0]).toUpperCase();
const SPECIES_EMOJI = { Dog: "🐕", Cat: "🐈", Hamster: "🐹", Bird: "🐦", Rabbit: "🐇" };

/* ---------- derived attributes (the () fields in the ER diagram) ---------- */
const fullName = r => `${r.first_name} ${r.last_name}`;
const address = c => `${c.street}, ${c.city}, ${c.state} ${c.zip}`;
const fmtPhone = n => { const d = String(n ?? "").replace(/\D/g, ""); return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d; };

// PET.age(): years between birth_date and today (or deceased_date)
function age(p) {
  const end = p.deceased_date ? new Date(p.deceased_date) : TODAY;
  const b = new Date(p.birth_date);
  let months = (end.getFullYear() - b.getFullYear()) * 12 + end.getMonth() - b.getMonth();
  if (end.getDate() < b.getDate()) months--;
  return months < 12 ? `${months} mo` : `${Math.floor(months / 12)} yr${months >= 24 ? "s" : ""}`;
}
const ownerOf = p => find("clients", p.client_id);

// INVOICE.total and balance_due are stored columns in vet.db
const total = inv => inv.total;
const balanceDue = inv => inv.balance_due;
const apptOfInvoice = inv => find("appointments", inv.appt_id);
const petOfAppt = a => find("pets", a.pet_id);
const clientOfAppt = a => ownerOf(petOfAppt(a));
const petStatus = p => (p.deceased_date ? "Deceased" : p.alerts ? "Alert" : "");

/* helpers for related lists: rel(table, rows, optionalSubtitleFn) */
const rel = (entity, rows, sub) => ({ entity, items: rows.filter(Boolean).map(row => ({ row, sub: sub ? sub(row) : null })) });

/* ---------- entity config ---------- */
const ENTITIES = {
  clients: {
    label: "Clients", icon: "users",
    rows: () => DB.clients,
    title: fullName,
    subtitle: r => r.email,
    tags: r => [r.city, fmtPhone(r.phone_number)],
    avatar: r => ({ text: initials(r.first_name, r.last_name) }),
    searchText: r => [fullName(r), r.email, address(r), String(r.phone_number ?? ""), "#" + r.client_id],
    filters: { City: r => r.city },
    contact: r => [["mail", "Email", r.email], ["phone", "Phone", fmtPhone(r.phone_number)], ["home", "Address", address(r)]],
    facts: r => [["Client ID", "#" + r.client_id], ["First name", r.first_name], ["Last name", r.last_name], ["Email", r.email, "wide"]],
    related: r => {
      const pets = where("pets", "client_id", r.client_id);
      const invs = DB.invoices.filter(i => clientOfAppt(apptOfInvoice(i)).client_id === r.client_id);
      return [
        { title: "Pets (owns)", ...rel("pets", pets) },
        { title: "Invoices", ...rel("invoices", invs) },
      ];
    },
  },

  pets: {
    label: "Pets", icon: "paw",
    rows: () => DB.pets,
    title: r => r.name,
    subtitle: r => `${r.breed} · ${fullName(ownerOf(r))}`,
    status: petStatus,
    tags: r => [r.species, age(r), r.sex],
    avatar: r => ({ emoji: SPECIES_EMOJI[r.species] || "🐾" }),
    searchText: r => [r.name, r.species, r.breed, r.alerts, fullName(ownerOf(r)), "#" + r.pet_id],
    filters: { Species: r => r.species, Sex: r => (r.sex), Status: r => (r.deceased_date ? "Deceased" : "Living") },
    contact: () => [],
    facts: r => [
      ["Pet ID", "#" + r.pet_id], ["Name", r.name], ["Species", r.species], ["Breed", r.breed],
      ["Sex", r.sex], ["Birth date", fmtDate(r.birth_date)], ["Age()", age(r)],
      ["Deceased date", r.deceased_date ? fmtDate(r.deceased_date) : "—"],
      ...(r.alerts ? [["⚠ Alerts", r.alerts, "wide alert"]] : []),
    ],
    related: r => {
      const appts = where("appointments", "pet_id", r.pet_id);
      const ids = appts.map(a => a.appt_id);
      return [
        { title: "Owner", ...rel("clients", [ownerOf(r)]) },
        { title: "Appointments", ...rel("appointments", appts) },
        { title: "Prescriptions", ...rel("prescriptions", DB.prescriptions.filter(p => ids.includes(p.appt_id))) },
        { title: "Vaccines & meds given", ...rel("medications",
            DB.administered.filter(a => ids.includes(a.appt_id)).map(a => ({ ...find("medications", a.med_id), _adm: a })),
            m => `Qty ${m._adm.quantity_given} · ${fmtDate(find("appointments", m._adm.appt_id).appt_datetime)}${m._adm.next_due_date ? " · next due " + fmtDate(m._adm.next_due_date) : ""}`) },
      ];
    },
  },

  staff: {
    label: "Staff", icon: "stethoscope",
    rows: () => DB.staff,
    title: fullName,
    subtitle: r => r.role,
    tags: r => [r.license_no, "Hired " + fmtDate(r.hire_date)],
    avatar: r => ({ text: initials(r.first_name, r.last_name) }),
    searchText: r => [fullName(r), r.role, r.license_no, "#" + r.staff_id],
    filters: { Role: r => r.role },
    contact: () => [],
    facts: r => [["Staff ID", "#" + r.staff_id], ["Role", r.role], ["First name", r.first_name], ["Last name", r.last_name],
      ["Hire date", fmtDate(r.hire_date)], ["License no.", r.license_no || "—"]],
    related: r => [{ title: "Appointments (saw)", ...rel("appointments", where("appointments", "staff_id", r.staff_id)) }],
  },

  appointments: {
    label: "Appointments", icon: "calendar",
    rows: () => [...DB.appointments].sort((a, b) => b.appt_datetime.localeCompare(a.appt_datetime)),
    title: r => r.reason,
    subtitle: r => `${petOfAppt(r).name} · ${fmtDT(r.appt_datetime)}`,
    status: r => r.status,
    tags: r => [fullName(find("staff", r.staff_id)), r.diagnosis],
    avatar: r => ({ emoji: SPECIES_EMOJI[petOfAppt(r).species] || "📅" }),
    searchText: r => [r.reason, r.diagnosis, r.exam_notes, petOfAppt(r).name, fullName(find("staff", r.staff_id)), fullName(clientOfAppt(r)), "#" + r.appt_id],
    filters: { Status: r => r.status, Vet: r => fullName(find("staff", r.staff_id)) },
    contact: () => [],
    facts: r => [
      ["Appt ID", "#" + r.appt_id], ["Date & time", fmtDT(r.appt_datetime)], ["Status", r.status],
      ["Weight", r.weight || "—"], ["Temp", r.temp ? r.temp + " °F" : "—"], ["Diagnosis", r.diagnosis || "—"],
      ["Exam notes", r.exam_notes || "—", "wide"],
    ],
    related: r => [
      { title: "Pet (scheduled)", ...rel("pets", [petOfAppt(r)]) },
      { title: "Owner", ...rel("clients", [clientOfAppt(r)]) },
      { title: "Seen by", ...rel("staff", [find("staff", r.staff_id)]) },
      { title: "Administered", ...rel("medications",
          where("administered", "appt_id", r.appt_id).map(a => ({ ...find("medications", a.med_id), _adm: a })),
          m => `Qty ${m._adm.quantity_given}${m._adm.next_due_date ? " · next due " + fmtDate(m._adm.next_due_date) : ""}`) },
      { title: "Prescribed", ...rel("prescriptions", where("prescriptions", "appt_id", r.appt_id)) },
      { title: "Invoice (billed)", ...rel("invoices", where("invoices", "appt_id", r.appt_id)) },
    ],
  },

  medications: {
    label: "Medications", icon: "pill",
    rows: () => DB.medications,
    title: r => r.name,
    subtitle: r => `${r.form} · ${r.mg_no} mg`,
    tags: r => [r.form, money(r.unit_price)],
    avatar: () => ({ emoji: "💊" }),
    searchText: r => [r.name, r.form, "#" + r.med_id],
    filters: { Form: r => r.form },
    contact: () => [],
    facts: r => [["Med ID", "#" + r.med_id], ["Name", r.name], ["Form", r.form], ["mg_no", r.mg_no], ["Unit price", money(r.unit_price)]],
    related: r => [
      { title: "Administered at", ...rel("appointments",
          where("administered", "med_id", r.med_id).map(a => ({ ...find("appointments", a.appt_id), _adm: a })),
          a => `${petOfAppt(a).name} · qty ${a._adm.quantity_given}`) },
      { title: "Prescriptions (drug)", ...rel("prescriptions", where("prescriptions", "med_id", r.med_id)) },
    ],
  },

  prescriptions: {
    label: "Prescriptions", icon: "clipboard",
    rows: () => DB.prescriptions,
    title: r => find("medications", r.med_id).name,
    subtitle: r => `For ${petOfAppt(find("appointments", r.appt_id)).name} · ${fmtDate(r.date_written)}`,
    tags: r => [`Qty ${r.quantity}`, `${r.refills} refill${r.refills === 1 ? "" : "s"}`],
    avatar: () => ({ emoji: "📋" }),
    searchText: r => [find("medications", r.med_id).name, petOfAppt(find("appointments", r.appt_id)).name, r.instructions, "#" + r.rx_id],
    filters: {},
    contact: () => [],
    facts: r => [["Rx ID", "#" + r.rx_id], ["Date written", fmtDate(r.date_written)], ["Quantity", r.quantity], ["Refills", r.refills],
      ["Instructions", r.instructions, "wide"]],
    related: r => {
      const a = find("appointments", r.appt_id);
      return [
        { title: "Medication (drug)", ...rel("medications", [find("medications", r.med_id)]) },
        { title: "Prescribed at", ...rel("appointments", [a]) },
        { title: "Pet", ...rel("pets", [petOfAppt(a)]) },
        { title: "Prescribing vet", ...rel("staff", [find("staff", a.staff_id)]) },
      ];
    },
  },

  invoices: {
    label: "Invoices", icon: "receipt",
    rows: () => DB.invoices,
    title: r => `Invoice #${r.invoice_id}`,
    subtitle: r => `${fullName(clientOfAppt(apptOfInvoice(r)))} · ${money(total(r))}`,
    tags: r => [petOfAppt(apptOfInvoice(r)).name, "Balance " + money(balanceDue(r))],
    avatar: () => ({ emoji: "🧾" }),
    searchText: r => ["#" + r.invoice_id, String(r.invoice_id), fullName(clientOfAppt(apptOfInvoice(r))), petOfAppt(apptOfInvoice(r)).name],
    filters: {},
    contact: () => [],
    facts: r => [["Invoice ID", "#" + r.invoice_id], ["Exam fee", money(r.exam_fee)], ["Total", money(total(r))], ["Balance due", money(balanceDue(r))]],
    related: r => {
      const a = apptOfInvoice(r);
      return [
        { title: "Billed appointment", ...rel("appointments", [a]) },
        { title: "Client", ...rel("clients", [clientOfAppt(a)]) },
        { title: "Pet", ...rel("pets", [petOfAppt(a)]) },
        { title: "Payments", ...rel("payments", where("payments", "invoice_id", r.invoice_id)) },
      ];
    },
  },

  payments: {
    label: "Payments", icon: "card",
    rows: () => DB.payments,
    title: r => money(r.amount),
    subtitle: r => `Invoice #${r.invoice_id} · ${fmtDate(r.pay_date)}`,
    tags: r => [r.method, fullName(clientOfAppt(apptOfInvoice(find("invoices", r.invoice_id))))],
    avatar: () => ({ emoji: "💳" }),
    searchText: r => [r.method, "#" + r.payment_no, String(r.invoice_id), fullName(clientOfAppt(apptOfInvoice(find("invoices", r.invoice_id))))],
    filters: { Method: r => r.method },
    contact: () => [],
    facts: r => [["Payment no.", "#" + r.payment_no], ["Amount", money(r.amount)], ["Method", r.method], ["Pay date", fmtDate(r.pay_date)]],
    related: r => [{ title: "Invoice (paid)", ...rel("invoices", [find("invoices", r.invoice_id)]) }],
  },
};

/* icons + toast live in js/shell.js */

/* ---------- app state ---------- */
const state = { entity: "all", query: "", filters: {}, selected: null };

/* ---------- rendering ---------- */
const $ = sel => document.querySelector(sel);
const hue = id => (id * 47) % 360;

function avatarHTML(key, row, size = "") {
  const a = ENTITIES[key].avatar(row);
  const h = hue(pk(key, row));
  if (a.emoji) return `<div class="avatar ${size} emoji" style="--h:${h}">${a.emoji}</div>`;
  return `<div class="avatar ${size}" style="--h:${h}">${esc(a.text)}</div>`;
}

function statusHTML(status) {
  if (!status) return "";
  const cls = status.toLowerCase().replace(/\s+/g, "-");
  return `<span class="status status-${cls}">${esc(status)}</span>`;
}

function visibleRecords() {
  const keys = state.entity === "all" ? Object.keys(ENTITIES) : [state.entity];
  const q = state.query.trim().toLowerCase();
  const out = [];
  for (const key of keys) {
    const cfg = ENTITIES[key];
    for (const row of cfg.rows()) {
      if (q && !cfg.searchText(row).filter(Boolean).join(" ").toLowerCase().includes(q)) continue;
      if (state.entity !== "all") {
        const ok = Object.entries(state.filters).every(([label, v]) => !v || String(cfg.filters[label](row)) === v);
        if (!ok) continue;
      }
      out.push({ key, row });
    }
  }
  return out;
}

function renderTabs() {
  const tabs = [["all", "All", "grid"], ...Object.entries(ENTITIES).map(([k, c]) => [k, c.label, c.icon])];
  $("#entityTabs").innerHTML = tabs.map(([k, label, ic]) => {
    const count = k === "all" ? Object.values(ENTITIES).reduce((n, c) => n + c.rows().length, 0) : ENTITIES[k].rows().length;
    return `<button class="tab ${state.entity === k ? "active" : ""}" data-entity="${k}" role="tab" aria-selected="${state.entity === k}">
      ${icon(ic)}<span>${label}</span><span class="tab-count">${count}</span></button>`;
  }).join("");
}

function renderFilters() {
  const wrap = $("#filters");
  if (state.entity === "all") { wrap.innerHTML = ""; return; }
  const cfg = ENTITIES[state.entity];
  wrap.innerHTML = Object.entries(cfg.filters).map(([label, get]) => {
    const values = [...new Set(cfg.rows().map(r => String(get(r))))].sort();
    const cur = state.filters[label] || "";
    return `<label class="filter ${cur ? "set" : ""}">
      <select data-filter="${esc(label)}" aria-label="Filter by ${esc(label)}">
        <option value="">${esc(label)}</option>
        ${values.map(v => `<option value="${esc(v)}" ${v === cur ? "selected" : ""}>${esc(v)}</option>`).join("")}
      </select></label>`;
  }).join("");
}

function cardHTML({ key, row }) {
  const cfg = ENTITIES[key];
  const id = pk(key, row);
  const sel = state.selected && state.selected.key === key && state.selected.id === id;
  const tags = (cfg.tags(row) || []).filter(Boolean);
  return `<article class="card ${sel ? "selected" : ""}" data-key="${key}" data-id="${id}" tabindex="0">
    <div class="card-top">
      ${avatarHTML(key, row)}
      ${cfg.status ? statusHTML(cfg.status(row)) : ""}
    </div>
    ${state.entity === "all" ? `<div class="card-type">${icon(cfg.icon)}${cfg.label}</div>` : ""}
    <h3 class="card-title">${esc(cfg.title(row))}</h3>
    <p class="card-sub">${esc(cfg.subtitle(row))}</p>
    <div class="tags">${tags.map((t, i) => `<span class="tag ${i === 0 ? "accent" : ""}">${esc(t)}</span>`).join("")}</div>
  </article>`;
}

function renderGrid() {
  const recs = visibleRecords();
  $("#sectionTitle").textContent = state.entity === "all" ? "All records" : ENTITIES[state.entity].label;
  $("#resultCount").textContent = `${recs.length} result${recs.length === 1 ? "" : "s"}`;
  $("#grid").innerHTML = recs.length
    ? recs.map(cardHTML).join("")
    : `<div class="empty">${icon("search")}<p>No matches${state.query ? ` for “${esc(state.query)}”` : ""}.</p><span>Try a different name, ID, or filter.</span></div>`;
}

function renderDetail() {
  const panel = $("#detail");
  if (!state.selected) {
    panel.classList.remove("open");
    panel.innerHTML = `<div class="detail-empty">${icon("paw")}<h3>Nothing selected</h3><p>Pick a card to see full details and linked records.</p></div>`;
    return;
  }
  const { key, id } = state.selected;
  const cfg = ENTITIES[key];
  const row = find(key, id);
  const contact = cfg.contact(row).filter(c => c[2]);
  const related = cfg.related(row).filter(g => g.items.length);
  const status = cfg.status ? cfg.status(row) : "";

  panel.classList.add("open");
  panel.innerHTML = `
    <button class="detail-close" aria-label="Close details">${icon("close")}</button>
    <div class="hero" style="--h:${hue(id)}">
      <div class="hero-avatar">${avatarHTML(key, row, "xl")}</div>
      <div class="hero-card">
        <div class="hero-meta"><span class="hero-type">${cfg.label.replace(/s$/, "")}</span>${statusHTML(status)}</div>
        <h2>${esc(cfg.title(row))}</h2>
        <p>${esc(cfg.subtitle(row))}</p>
      </div>
    </div>

    ${contact.length ? `<h4 class="detail-h">Contact details</h4>
    <ul class="contact">${contact.map(([ic, label, val]) => `
      <li><span class="contact-ic">${icon(ic)}</span><div><small>${esc(label)}</small><strong>${esc(val)}</strong></div></li>`).join("")}
    </ul>` : ""}

    <h4 class="detail-h">Details</h4>
    <div class="facts">${cfg.facts(row).map(([k, v, cls = ""]) => `<div class="fact ${cls}"><small>${esc(k)}</small><strong>${esc(v)}</strong></div>`).join("")}</div>

    ${related.map(g => `<h4 class="detail-h">${esc(g.title)} <span class="count">${g.items.length}</span></h4>
      <div class="related">${g.items.map(({ row: r, sub }) => {
        const rc = ENTITIES[g.entity];
        return `<button class="related-item" data-key="${g.entity}" data-id="${pk(g.entity, r)}">
          <div><strong>${esc(rc.title(r))}</strong><small>${esc(sub || rc.subtitle(r))}</small></div>${icon("chevron")}</button>`;
      }).join("")}</div>`).join("")}
  `;
}

function render() { renderTabs(); renderFilters(); renderGrid(); renderDetail(); }

function select(key, id) {
  state.selected = { key, id };
  renderGrid();
  renderDetail();
  $("#detail").scrollTop = 0;
}

/* ---------- events ---------- */
dbReady.then(() => {
  $("#search").addEventListener("input", e => { state.query = e.target.value; renderGrid(); });

  $("#entityTabs").addEventListener("click", e => {
    const b = e.target.closest(".tab");
    if (!b) return;
    state.entity = b.dataset.entity;
    state.filters = {};
    render();
  });

  $("#filters").addEventListener("change", e => {
    const s = e.target.closest("select");
    if (!s) return;
    state.filters[s.dataset.filter] = s.value;
    renderFilters();
    renderGrid();
  });

  $("#grid").addEventListener("click", e => {
    const c = e.target.closest(".card");
    if (c) select(c.dataset.key, +c.dataset.id);
  });
  $("#grid").addEventListener("keydown", e => {
    const c = e.target.closest(".card");
    if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(c.dataset.key, +c.dataset.id); }
  });

  $("#detail").addEventListener("click", e => {
    const r = e.target.closest(".related-item");
    if (r) return select(r.dataset.key, +r.dataset.id);
    if (e.target.closest(".detail-close")) { state.selected = null; renderGrid(); renderDetail(); }
  });

  render();
});
