/* ------------------------------------------------------------------
   LSU-VET · data-entry workspaces (insert / update / delete)
   ------------------------------------------------------------------
   SCHEMA  – one entry per table: fields, validation, FK rules.
   VIEWS   – the 5 user interfaces. Each lists which tables (and which
             fields of them) a given kind of user works with.
   mount() – renders a workspace page. Called from each *.html page.

   Referential integrity mirrors the database:
     • FK fields must point at an existing row.
     • Deleting a row that other rows reference is blocked.
     • invoice.balance_due is kept equal to total − payments.
------------------------------------------------------------------- */
const Workspace = (function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = d => d ? new Date(d.length === 10 ? d + "T00:00" : d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
  const fmtDT = d => d ? new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—";
  const localToday = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
  const fullName = r => r ? `${r.first_name} ${r.last_name}` : "—";
  const slug = s => String(s).toLowerCase().replace(/\s+/g, "-");

  const byId = (t, id) => DB[t].find(r => r[SCHEMA[t].key] === id) || null;
  const apptPet = a => a ? byId("pets", a.pet_id) : null;
  const apptClient = a => { const p = apptPet(a); return p ? byId("clients", p.client_id) : null; };
  const medName = id => byId("medications", id)?.name || "—";
  const fmtPhone = n => { const d = String(n ?? "").replace(/\D/g, ""); return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d || "—"; };
  const CLINICAL_ROLES = ["Veterinarian", "Vet Technician"];

  const round2 = n => Math.round(n * 100) / 100;
  const medsGiven = apptId => DB.administered.filter(x => x.appt_id === apptId)
    .reduce((s, x) => s + x.quantity_given * (byId("medications", x.med_id)?.unit_price || 0), 0);
  // invoice.total is stored in the DB; balance_due = total − payments
  function invoiceParts(inv) {
    const paid = DB.payments.filter(p => p.invoice_id === inv.invoice_id).reduce((s, p) => s + p.amount, 0);
    const total = inv.total || 0;
    return { total, paid, balance: Math.max(0, round2(total - paid)) };
  }
  // keep the stored balance_due column in sync after any change
  function recalcBalances() {
    for (const inv of DB.invoices) {
      const b = invoiceParts(inv).balance;
      if (inv.balance_due !== b) inv.balance_due = b;
    }
  }
  const invStatus = inv => { const p = invoiceParts(inv); return p.balance <= 0 ? "Paid" : p.paid > 0 ? "Partial" : "Unpaid"; };

  /* ---------- table schemas ---------- */
  const SCHEMA = {
    clients: {
      key: "client_id", singular: "Client",
      title: fullName,
      label: r => `#${r.client_id} ${fullName(r)}`,
      dependents: [["pets", "client_id", "pet"]],
      fields: [
        { name: "first_name", label: "First name", type: "text", required: true },
        { name: "last_name", label: "Last name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true, wide: true, unique: true, uniqueMsg: "Another client already uses this email." },
        { name: "phone_number", label: "Phone number", type: "text", digits: true, wide: true, unique: true, uniqueMsg: "Another client already uses this phone number.",
          pattern: /^\d{7,15}$/, patternMsg: "Enter 7–15 digits.", placeholder: "2255550142" },
        { name: "street", label: "Street", type: "text", required: true, wide: true },
        { name: "city", label: "City", type: "text", required: true },
        { name: "state", label: "State", type: "text", required: true, upper: true, default: "LA", pattern: /^[A-Z]{2}$/, patternMsg: "Use a 2-letter code, e.g. LA." },
        { name: "zip", label: "ZIP", type: "text", required: true, pattern: /^\d{5}$/, patternMsg: "Use 5 digits." },
      ],
    },

    pets: {
      key: "pet_id", singular: "Pet",
      title: r => r.name,
      label: r => `#${r.pet_id} ${r.name} (${fullName(byId("clients", r.client_id))})`,
      dependents: [["appointments", "pet_id", "appointment"]],
      fields: [
        { name: "client_id", label: "Owner", type: "fk", ref: "clients", required: true, wide: true },
        { name: "name", label: "Name", type: "text", required: true },
        { name: "species", label: "Species", type: "select", required: true, options: ["Dog", "Cat", "Hamster", "Bird", "Rabbit", "Reptile", "Other"] },
        { name: "breed", label: "Breed", type: "text", required: true },
        { name: "sex", label: "Sex", type: "select", required: true, options: ["Male", "Female"] },
        { name: "birth_date", label: "Birth date", type: "date", required: true },
        { name: "deceased_date", label: "Deceased date", type: "date", help: "Leave blank if living." },
        { name: "alerts", label: "Alerts", type: "textarea", wide: true, placeholder: "Allergies, behavior, chronic conditions…" },
      ],
      rules: r => {
        const e = {};
        if (r.birth_date && r.birth_date > localToday()) e.birth_date = "Birth date can't be in the future.";
        if (r.deceased_date && r.birth_date && r.deceased_date < r.birth_date) e.deceased_date = "Must be on or after the birth date.";
        if (r.deceased_date && r.deceased_date > localToday()) e.deceased_date = "Can't be in the future.";
        return e;
      },
    },

    staff: {
      key: "staff_id", singular: "Staff member",
      title: fullName,
      label: r => `#${r.staff_id} ${fullName(r)} · ${r.role}`,
      dependents: [["appointments", "staff_id", "appointment"]],
      fields: [
        { name: "first_name", label: "First name", type: "text", required: true },
        { name: "last_name", label: "Last name", type: "text", required: true },
        { name: "role", label: "Role", type: "select", required: true, options: ["Veterinarian", "Vet Technician", "Front Desk", "Owner"] },
        { name: "hire_date", label: "Hire date", type: "date", required: true, default: localToday },
        { name: "license_no", label: "License no.", type: "number", integer: true, min: 1, wide: true, unique: true, uniqueMsg: "This license is already on file.",
          help: "Required for veterinarians and vet technicians." },
      ],
      rules: r => (CLINICAL_ROLES.includes(r.role) && !r.license_no ? { license_no: `A ${r.role.toLowerCase()} needs a license number.` } : {}),
    },

    appointments: {
      key: "appt_id", singular: "Appointment",
      title: r => r.reason,
      label: r => `#${r.appt_id} · ${apptPet(r)?.name || "?"} · ${fmtDate(r.appt_datetime)} · ${r.reason}`,
      dependents: [["administered", "appt_id", "administered medication"], ["prescriptions", "appt_id", "prescription"], ["invoices", "appt_id", "invoice"]],
      fields: [
        { name: "pet_id", label: "Pet", type: "fk", ref: "pets", required: true, wide: true, refFilter: p => !p.deceased_date },
        { name: "staff_id", label: "Seen by", type: "fk", ref: "staff", required: true, wide: true, refFilter: s => CLINICAL_ROLES.includes(s.role) },
        { name: "appt_datetime", label: "Date & time", type: "datetime", required: true, default: () => `${localToday()}T09:00` },
        { name: "status", label: "Status", type: "select", required: true, options: ["Incomplete", "Completed", "Cancelled"], default: "Incomplete" },
        { name: "reason", label: "Reason for visit", type: "text", required: true, wide: true },
        { name: "weight", label: "Weight", type: "text", required: true, placeholder: "e.g. 68.5 lbs",
          normalize: v => (/^\d+(\.\d+)?$/.test(v) ? `${v} lbs` : v), pattern: /^\d+(\.\d+)?\s*(lbs?|kg|oz)$/i, patternMsg: "Use a number and unit, e.g. 68.5 lbs." },
        { name: "temp", label: "Temp (°F)", type: "number", required: true, step: "0.1", min: 90, max: 110 },
        { name: "diagnosis", label: "Diagnosis", type: "text", wide: true },
        { name: "exam_notes", label: "Exam notes", type: "textarea", wide: true },
      ],
      rules: (r, orig) => {
        const e = {};
        const s = byId("staff", r.staff_id);
        if (s && !CLINICAL_ROLES.includes(s.role)) e.staff_id = "Appointments must be with a veterinarian or vet technician.";
        const p = byId("pets", r.pet_id);
        if (p && p.deceased_date && r.status === "Incomplete" && r.appt_datetime?.slice(0, 10) > p.deceased_date) e.pet_id = `${p.name} is recorded as deceased.`;
        if (r.status === "Completed" && !r.diagnosis) e.diagnosis = "Record a diagnosis before marking the visit Completed (done in Clinical).";
        if (orig && orig.status === "Completed" && r.status !== "Completed" && DB.invoices.some(i => i.appt_id === r.appt_id))
          e.status = "This visit has already been invoiced, so it has to stay Completed.";
        return e;
      },
    },

    medications: {
      key: "med_id", singular: "Medication",
      title: r => r.name,
      label: r => `#${r.med_id} ${r.name} ${r.mg_no} mg ${r.form.toLowerCase()} (${money(r.unit_price)})`,
      dependents: [["administered", "med_id", "administered record"], ["prescriptions", "med_id", "prescription"]],
      fields: [
        { name: "name", label: "Name", type: "text", required: true, wide: true, unique: true, uniqueMsg: "This medication is already in the catalog." },
        { name: "form", label: "Form", type: "select", required: true, options: ["Tablet", "Capsule", "Injection", "Liquid", "Topical"] },
        { name: "mg_no", label: "Strength (mg)", type: "number", required: true, min: 0.01, step: "0.01" },
        { name: "unit_price", label: "Unit price ($)", type: "number", required: true, min: 0, step: "0.01" },
      ],
    },

    administered: {
      key: "administer_id", singular: "Administered medication",
      title: r => `${medName(r.med_id)} × ${r.quantity_given}`,
      label: r => `#${r.administer_id} ${medName(r.med_id)}`,
      ref: r => `#${r.administer_id} · Appt #${r.appt_id}`,
      fields: [
        { name: "appt_id", label: "Appointment", type: "fk", ref: "appointments", required: true, wide: true, refFilter: a => a.status !== "Cancelled" },
        { name: "med_id", label: "Medication / vaccine", type: "fk", ref: "medications", required: true, wide: true },
        { name: "quantity_given", label: "Quantity given", type: "number", required: true, min: 1, integer: true, default: 1 },
        { name: "next_due_date", label: "Next due date", type: "date", required: true, help: "When the next dose or booster is due." },
      ],
      rules: (r, orig) => {
        const e = {};
        if (DB.administered.some(x => x !== orig && x.appt_id === r.appt_id && x.med_id === r.med_id))
          e.med_id = "Already recorded for this appointment. Edit that entry's quantity instead.";
        const a = byId("appointments", r.appt_id);
        if (a && a.status === "Cancelled") e.appt_id = "That appointment was cancelled.";
        if (a && r.next_due_date && r.next_due_date <= a.appt_datetime.slice(0, 10)) e.next_due_date = "Must be after the appointment date.";
        return e;
      },
    },

    prescriptions: {
      key: "rx_id", singular: "Prescription",
      title: r => medName(r.med_id),
      label: r => `#${r.rx_id} ${medName(r.med_id)}`,
      fields: [
        { name: "appt_id", label: "Prescribed at appointment", type: "fk", ref: "appointments", required: true, wide: true, refFilter: a => a.status !== "Cancelled" },
        { name: "med_id", label: "Drug", type: "fk", ref: "medications", required: true, wide: true },
        { name: "date_written", label: "Date written", type: "date", required: true, default: localToday },
        { name: "quantity", label: "Quantity", type: "number", required: true, min: 1, integer: true },
        { name: "refills", label: "Refills", type: "number", required: true, min: 0, max: 12, integer: true, default: 0 },
        { name: "instructions", label: "Instructions", type: "textarea", required: true, wide: true, placeholder: "e.g. 1 tablet twice daily with food" },
      ],
      rules: r => {
        const e = {};
        const a = byId("appointments", r.appt_id);
        if (a && a.status === "Cancelled") e.appt_id = "That appointment was cancelled.";
        if (a && r.date_written && r.date_written < a.appt_datetime.slice(0, 10)) e.date_written = "Can't be before the appointment.";
        return e;
      },
    },

    invoices: {
      key: "invoice_id", singular: "Invoice",
      title: r => `Invoice #${r.invoice_id}`,
      label: r => `#${r.invoice_id} · ${fullName(apptClient(byId("appointments", r.appt_id)))} · balance ${money(invoiceParts(r).balance)}`,
      dependents: [["payments", "invoice_id", "payment"]],
      fields: [
        { name: "appt_id", label: "Billed appointment", type: "fk", ref: "appointments", required: true, wide: true, unique: true,
          uniqueMsg: "That appointment already has an invoice.",
          refFilter: a => a.status !== "Cancelled" && !DB.invoices.some(i => i.appt_id === a.appt_id) },
        { name: "exam_fee", label: "Exam fee ($)", type: "number", required: true, min: 0, step: "0.01", default: 100 },
        { name: "total", label: "Total ($)", type: "number", min: 0, step: "0.01",
          help: "Leave blank to use exam fee + medications given at the visit. Balance due updates from payments." },
      ],
      rules: r => (r.total != null && r.total < r.exam_fee ? { total: "Total can't be less than the exam fee." } : {}),
    },

    payments: {
      key: "payment_no", singular: "Payment",
      title: r => money(r.amount),
      label: r => `#${r.payment_no} ${money(r.amount)}`,
      fields: [
        { name: "invoice_id", label: "Invoice", type: "fk", ref: "invoices", required: true, wide: true },
        { name: "amount", label: "Amount ($)", type: "number", required: true, min: 0.01, step: "0.01" },
        { name: "method", label: "Method", type: "select", required: true, options: ["Cash", "Credit Card", "Debit Card", "Check"] },
        { name: "pay_date", label: "Pay date", type: "date", required: true, default: localToday, wide: true },
      ],
      rules: (r, orig) => {
        const e = {};
        const inv = byId("invoices", r.invoice_id);
        if (inv && Number.isFinite(r.amount)) {
          const credit = orig && orig.invoice_id === r.invoice_id ? orig.amount : 0;
          const max = Math.round((invoiceParts(inv).balance + credit) * 100) / 100;
          if (r.amount > max + 1e-9) e.amount = max > 0 ? `More than the balance due (${money(max)}).` : "This invoice is already paid in full.";
        }
        if (r.pay_date && r.pay_date > localToday()) e.pay_date = "Can't be in the future.";
        return e;
      },
    },
  };

  /* ---------- the 5 user interfaces ---------- */
  const pill = v => v ? `<span class="status status-${slug(v)}">${esc(v)}</span>` : "—";
  const petStatus = p => p.deceased_date ? "Deceased" : p.alerts ? "Alert" : "Active";
  const byDateDesc = col => (a, b) => String(b[col]).localeCompare(String(a[col]));

  const VIEWS = {
    /* 1 · Front Desk: register clients and pets */
    frontdesk: [
      { table: "clients", label: "Clients", icon: "users",
        columns: [
          { h: "ID", v: r => "#" + r.client_id },
          { h: "Name", v: fullName, strong: true },
          { h: "Email", v: r => r.email },
          { h: "Phone", v: r => fmtPhone(r.phone_number) },
          { h: "City", v: r => r.city },
          { h: "Pets", v: r => String(DB.pets.filter(p => p.client_id === r.client_id).length) },
        ] },
      { table: "pets", label: "Pets", icon: "paw",
        columns: [
          { h: "ID", v: r => "#" + r.pet_id },
          { h: "Name", v: r => r.name, strong: true },
          { h: "Species", v: r => r.species },
          { h: "Breed", v: r => r.breed },
          { h: "Owner", v: r => fullName(byId("clients", r.client_id)) },
          { h: "Status", v: petStatus, pill: true },
        ] },
    ],

    /* 2 · Front Desk / vets: book & manage appointments */
    schedule: [
      { table: "appointments", label: "Appointments", icon: "calendar",
        fields: ["pet_id", "staff_id", "appt_datetime", "status", "reason", "weight", "temp"],
        sort: byDateDesc("appt_datetime"),
        hint: "Book, reschedule, or cancel visits. Weight and temp are taken at check-in. Vets record exam results in Clinical.",
        columns: [
          { h: "ID", v: r => "#" + r.appt_id },
          { h: "When", v: r => fmtDT(r.appt_datetime), strong: true },
          { h: "Pet", v: r => apptPet(r)?.name || "—" },
          { h: "Owner", v: r => fullName(apptClient(r)) },
          { h: "Seen by", v: r => fullName(byId("staff", r.staff_id)) },
          { h: "Reason", v: r => r.reason },
          { h: "Status", v: r => r.status, pill: true },
        ] },
    ],

    /* 3 · Vets & techs: exams, meds given, prescriptions */
    clinical: [
      { table: "appointments", label: "Exams", icon: "stethoscope",
        fields: ["status", "weight", "temp", "diagnosis", "exam_notes"],
        canCreate: false, canDelete: false,
        filter: r => r.status !== "Cancelled",
        sort: byDateDesc("appt_datetime"),
        hint: "Pick a visit to record vitals, notes, and a diagnosis. Set it to Completed when the exam is done.",
        summary: a => {
          const p = apptPet(a);
          return [
            ["Pet", p ? `${p.name} (${p.species})` : "—"], ["Owner", fullName(apptClient(a))],
            ["When", fmtDT(a.appt_datetime)], ["Seen by", fullName(byId("staff", a.staff_id))],
            ["Reason", a.reason, "wide"],
            ...(p && p.alerts ? [["⚠ Alerts", p.alerts, "wide alert"]] : []),
          ];
        },
        columns: [
          { h: "ID", v: r => "#" + r.appt_id },
          { h: "When", v: r => fmtDT(r.appt_datetime), strong: true },
          { h: "Pet", v: r => apptPet(r)?.name || "—" },
          { h: "Reason", v: r => r.reason },
          { h: "Diagnosis", v: r => r.diagnosis || "—" },
          { h: "Status", v: r => r.status, pill: true },
        ] },
      { table: "administered", label: "Meds given", icon: "syringe",
        sort: (a, b) => b.administer_id - a.administer_id,
        hint: "Vaccines and medications given in the clinic.",
        columns: [
          { h: "ID", v: r => "#" + r.administer_id },
          { h: "Appt", v: r => "#" + r.appt_id },
          { h: "Pet", v: r => apptPet(byId("appointments", r.appt_id))?.name || "—" },
          { h: "Medication", v: r => medName(r.med_id), strong: true },
          { h: "Qty", v: r => String(r.quantity_given) },
          { h: "Next due", v: r => fmtDate(r.next_due_date) },
        ] },
      { table: "prescriptions", label: "Prescriptions", icon: "clipboard",
        writeRoles: ["Veterinarian", "Owner"],
        readonlyNote: "Only veterinarians can write prescriptions.",
        sort: byDateDesc("date_written"),
        columns: [
          { h: "Rx", v: r => "#" + r.rx_id },
          { h: "Drug", v: r => medName(r.med_id), strong: true },
          { h: "Pet", v: r => apptPet(byId("appointments", r.appt_id))?.name || "—" },
          { h: "Written", v: r => fmtDate(r.date_written) },
          { h: "Qty", v: r => String(r.quantity) },
          { h: "Refills", v: r => String(r.refills) },
        ] },
    ],

    /* 4 · Front desk / manager: invoices & payments */
    billing: [
      { table: "invoices", label: "Invoices", icon: "receipt",
        hint: "Balance due is updated automatically whenever a payment is added, edited, or deleted.",
        summary: inv => {
          const p = invoiceParts(inv), a = byId("appointments", inv.appt_id);
          return [
            ["Client", fullName(apptClient(a))], ["Pet", apptPet(a)?.name || "—"],
            ["Total", money(p.total)], ["Paid", money(p.paid)],
            ["Balance due", money(p.balance), p.balance > 0 ? "wide alert" : "wide"],
          ];
        },
        columns: [
          { h: "Invoice", v: r => "#" + r.invoice_id, strong: true },
          { h: "Client", v: r => fullName(apptClient(byId("appointments", r.appt_id))) },
          { h: "Visit", v: r => fmtDate(byId("appointments", r.appt_id)?.appt_datetime) },
          { h: "Total", v: r => money(invoiceParts(r).total) },
          { h: "Balance", v: r => money(invoiceParts(r).balance) },
          { h: "Status", v: invStatus, pill: true },
        ] },
      { table: "payments", label: "Payments", icon: "card",
        sort: byDateDesc("pay_date"),
        columns: [
          { h: "No.", v: r => "#" + r.payment_no },
          { h: "Amount", v: r => money(r.amount), strong: true },
          { h: "Invoice", v: r => "#" + r.invoice_id },
          { h: "Client", v: r => fullName(apptClient(byId("appointments", byId("invoices", r.invoice_id)?.appt_id))) },
          { h: "Method", v: r => r.method },
          { h: "Date", v: r => fmtDate(r.pay_date) },
        ] },
    ],

    /* 5 · Owner: staff & medication catalog */
    admin: [
      { table: "staff", label: "Staff", icon: "stethoscope",
        columns: [
          { h: "ID", v: r => "#" + r.staff_id },
          { h: "Name", v: fullName, strong: true },
          { h: "Role", v: r => r.role },
          { h: "Hired", v: r => fmtDate(r.hire_date) },
          { h: "License", v: r => r.license_no || "—" },
        ] },
      { table: "medications", label: "Medications", icon: "pill",
        hint: "Prices here are used when invoices are totaled.",
        columns: [
          { h: "ID", v: r => "#" + r.med_id },
          { h: "Name", v: r => r.name, strong: true },
          { h: "Form", v: r => r.form },
          { h: "Strength", v: r => r.mg_no + " mg" },
          { h: "Unit price", v: r => money(r.unit_price) },
        ] },
    ],
  };

  /* ---------- generic record helpers ---------- */
  const keyOf = (t, r) => { const k = SCHEMA[t].key; return Array.isArray(k) ? k.map(c => r[c]).join("-") : String(r[k]); };
  const findKey = (t, k) => DB[t].find(r => keyOf(t, r) === k) || null;
  const nextId = t => Math.max(0, ...DB[t].map(r => r[SCHEMA[t].key])) + 1;
  const defaultRaw = f => typeof f.default === "function" ? f.default() : f.default ?? "";
  const textual = f => ["text", "textarea", "email"].includes(f.type);

  function parse(f, raw) {
    const x = String(raw ?? "").trim();
    if (f.digits) { const d = x.replace(/\D/g, ""); return d ? (/^\d{7,15}$/.test(d) ? Number(d) : d) : null; }
    if (x === "") return textual(f) && !f.nullable ? "" : null;
    if (f.normalize) return f.normalize(x);
    if (f.type === "number" || f.type === "fk") return Number(x);
    return f.upper ? x.toUpperCase() : x;
  }

  function formValues(t, orig) {
    const out = {};
    for (const f of SCHEMA[t].fields) {
      if (f.virtual) out[f.name] = f.virtual.get(orig);
      else out[f.name] = orig ? orig[f.name] ?? "" : defaultRaw(f);
    }
    return out;
  }

  function blankRow(t) {
    const row = {};
    for (const f of SCHEMA[t].fields) if (!f.virtual) row[f.name] = parse(f, defaultRaw(f));
    return row;
  }

  function validate(t, row, orig, fields, parsed) {
    const e = {};
    for (const f of fields) {
      const v = parsed[f.name];
      if (v === null || v === "" || (Array.isArray(v) && !v.length)) { if (f.required) e[f.name] = "Required."; continue; }
      if (f.type === "number" && !Number.isFinite(v)) { e[f.name] = "Enter a number."; continue; }
      if (f.integer && !Number.isInteger(v)) e[f.name] = "Whole numbers only.";
      else if (f.min != null && v < f.min) e[f.name] = `Must be at least ${f.min}.`;
      else if (f.max != null && v > f.max) e[f.name] = `Must be at most ${f.max}.`;
      if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) e[f.name] = "Enter a valid email address.";
      if (f.pattern && !f.pattern.test(String(v))) e[f.name] = f.patternMsg;
      if (f.type === "fk" && !byId(f.ref, v)) e[f.name] = "Pick an existing record.";
      if (f.unique && DB[t].some(r => r !== orig && String(r[f.name] ?? "").toLowerCase() === String(v).toLowerCase()))
        e[f.name] = f.uniqueMsg || "Already in use.";
    }
    const extra = SCHEMA[t].rules ? SCHEMA[t].rules(row, orig) : {};
    for (const [k, m] of Object.entries(extra)) if (!e[k]) e[k] = m;
    return e;
  }

  /* ---------- workspace state & rendering ---------- */
  let wsId, WS, st;
  const view = () => WS[st.view];
  const writable = v => !v.writeRoles || v.writeRoles.includes(Shell.role());
  const fieldsOf = v => { const s = SCHEMA[v.table]; return v.fields ? v.fields.map(n => s.fields.find(f => f.name === n)) : s.fields; };
  const rowsOf = v => { const r = DB[v.table].filter(v.filter || (() => true)); return v.sort ? r.sort(v.sort) : r; };
  const resetForm = () => Object.assign(st, { mode: null, sel: null, draft: null, errors: {}, banner: "", confirm: false });

  function renderBody() {
    const body = $("#wsBody");
    const meta = Shell.workspace(wsId);
    if (!Shell.can(wsId)) {
      body.innerHTML = `<div class="locked-panel">${icon("lock")}<h2>No access</h2>
        <p><b>${esc(Shell.role())}</b> can't use ${esc(meta.label)}. It's for ${esc(meta.roles.join(", "))}.</p>
        <p>Switch roles with the menu at the top right.</p></div>`;
      return;
    }
    const v = view(), s = SCHEMA[v.table], w = writable(v);
    const canNew = w && v.canCreate !== false;
    body.innerHTML = `
      <div class="used-by">${icon("user")}For ${esc(meta.roles.join(" · "))}</div>
      ${WS.length > 1 ? `<div class="tabs" role="tablist">${WS.map((x, i) => `
        <button class="tab ${i === st.view ? "active" : ""}" data-view="${i}" role="tab" aria-selected="${i === st.view}">
          ${icon(x.icon)}<span>${esc(x.label)}</span><span class="tab-count">${rowsOf(x).length}</span></button>`).join("")}</div>` : ""}
      <div class="section-head">
        <div><h2>${esc(v.label)}</h2><span class="count" id="viewCount"></span></div>
        <div class="ws-actions">
          <label class="search search-sm">${icon("search")}
            <input id="viewSearch" type="search" placeholder="Search ${esc(v.label.toLowerCase())}…" value="${esc(st.q)}" autocomplete="off" /></label>
          ${canNew ? `<button class="btn btn-primary" data-act="new">${icon("plus")}New ${esc(s.singular.toLowerCase())}</button>` : ""}
        </div>
      </div>
      ${!w ? `<div class="notice">${icon("lock")}Read-only for ${esc(Shell.role())}. ${esc(v.readonlyNote || "")}</div>`
           : v.hint ? `<div class="notice info">${esc(v.hint)}</div>` : ""}
      <div class="table-wrap"><table class="records">
        <thead><tr>${v.columns.map(c => `<th>${esc(c.h)}</th>`).join("")}</tr></thead>
        <tbody id="rows"></tbody>
      </table></div>`;
    renderRows();
  }

  function renderRows() {
    const tbody = $("#rows");
    if (!tbody) return;
    const v = view();
    const q = st.q.trim().toLowerCase();
    const rows = rowsOf(v).filter(r => !q || v.columns.map(c => c.v(r)).join(" ").toLowerCase().includes(q));
    $("#viewCount").textContent = `${rows.length} record${rows.length === 1 ? "" : "s"}`;
    tbody.innerHTML = rows.length
      ? rows.map(r => {
          const k = keyOf(v.table, r);
          return `<tr data-key="${esc(k)}" tabindex="0" class="${st.sel === k ? "selected" : ""}">${v.columns.map(c => {
            const val = c.v(r);
            return `<td>${c.pill ? pill(val) : c.strong ? `<strong>${esc(val)}</strong>` : esc(val)}</td>`;
          }).join("")}</tr>`;
        }).join("")
      : `<tr><td colspan="${v.columns.length}" class="empty-row">No ${esc(v.label.toLowerCase())}${q ? ` match “${esc(st.q)}”` : " yet"}.</td></tr>`;
  }

  function fieldHTML(f, val, err, disabled) {
    const id = "f_" + f.name;
    const dis = disabled ? "disabled" : "";
    const v = val ?? "";
    let input;
    if (f.type === "textarea" || f.type === "lines") {
      input = `<textarea id="${id}" name="${f.name}" rows="3" ${dis} placeholder="${esc(f.placeholder || "")}">${esc(v)}</textarea>`;
    } else if (f.type === "select") {
      const opts = f.options.map(o => Array.isArray(o) ? o : [o, o]);
      if (v !== "" && !opts.some(([ov]) => String(ov) === String(v))) opts.push([v, v]); // keep values not in the list
      input = `<select id="${id}" name="${f.name}" ${dis}><option value="">Choose…</option>
        ${opts.map(([ov, ol]) => `<option value="${esc(ov)}" ${String(ov) === String(v) ? "selected" : ""}>${esc(ol)}</option>`).join("")}</select>`;
    } else if (f.type === "fk") {
      const rs = SCHEMA[f.ref];
      const opts = DB[f.ref].filter(r => String(r[rs.key]) === String(v) || !f.refFilter || f.refFilter(r));
      input = `<select id="${id}" name="${f.name}" ${dis}><option value="">Choose…</option>
        ${opts.map(r => `<option value="${r[rs.key]}" ${String(r[rs.key]) === String(v) ? "selected" : ""}>${esc(rs.label(r))}</option>`).join("")}</select>`;
    } else {
      const type = { datetime: "datetime-local", number: "number", date: "date", email: "email" }[f.type] || "text";
      const attrs = [f.step && `step="${f.step}"`, f.min != null && `min="${f.min}"`, f.max != null && `max="${f.max}"`,
        f.placeholder && `placeholder="${esc(f.placeholder)}"`].filter(Boolean).join(" ");
      input = `<input id="${id}" name="${f.name}" type="${type}" value="${esc(v)}" ${attrs} ${dis} />`;
    }
    const hint = err ? `<small class="err" id="${id}_msg">${esc(err)}</small>` : f.help ? `<small>${esc(f.help)}</small>` : "";
    return `<div class="field ${f.wide ? "wide" : ""} ${err ? "invalid" : ""}">
      <label for="${id}">${esc(f.label)}${f.required && !disabled ? '<i aria-hidden="true">*</i>' : ""}</label>${input}${hint}</div>`;
  }

  function renderDetail() {
    const panel = $("#detail");
    const v = view(), s = SCHEMA[v.table], w = writable(v);
    const allowed = Shell.can(wsId);
    if (!allowed || !st.mode) {
      panel.classList.remove("open");
      const canNew = allowed && w && v.canCreate !== false;
      panel.innerHTML = `<div class="detail-empty">${icon(allowed ? v.icon : "lock")}
        <h3>${allowed ? "Nothing selected" : "Locked"}</h3>
        <p>${allowed ? `Pick a row to ${w ? "edit" : "view"} it${canNew ? `, or add a new ${esc(s.singular.toLowerCase())}` : ""}.` : "Switch to a role with access."}</p>
        ${canNew ? `<div><button class="btn btn-primary" data-act="new" style="margin-top:16px">${icon("plus")}New ${esc(s.singular.toLowerCase())}</button></div>` : ""}</div>`;
      return;
    }
    const orig = st.mode === "edit" ? findKey(v.table, st.sel) : null;
    if (st.mode === "edit" && !orig) { resetForm(); return renderDetail(); }

    const fields = fieldsOf(v);
    const src = st.draft || formValues(v.table, orig);
    const offForm = Object.entries(st.errors).filter(([k]) => !fields.some(f => f.name === k))
      .map(([k, m]) => `${s.fields.find(f => f.name === k)?.label || k}: ${m}`);
    const banners = [st.banner, ...offForm].filter(Boolean);
    const summary = orig && v.summary ? v.summary(orig) : [];
    const refLine = orig ? (s.ref ? s.ref(orig) : `${s.singular} #${keyOf(v.table, orig)}`) : "";

    panel.classList.add("open");
    panel.innerHTML = `
      <button class="detail-close" type="button" data-act="cancel" aria-label="Close">${icon("close")}</button>
      <form class="form" id="recordForm" novalidate>
        <div class="form-head">
          <span class="hero-type">${st.mode === "new" ? "New record" : w ? "Edit record" : "View record"}</span>
          <h2>${st.mode === "new" ? `New ${esc(s.singular.toLowerCase())}` : esc(s.title(orig))}</h2>
          ${refLine ? `<p>${esc(refLine)}</p>` : ""}
        </div>
        ${summary.length ? `<div class="facts">${summary.map(([k, val, cls = ""]) => `<div class="fact ${cls}"><small>${esc(k)}</small><strong>${esc(val)}</strong></div>`).join("")}</div>` : ""}
        ${banners.length ? `<div class="form-error" role="alert">${banners.map(b => `<p>${esc(b)}</p>`).join("")}</div>` : ""}
        <div class="fields">${fields.map(f => fieldHTML(f, src[f.name], st.errors[f.name], !w)).join("")}</div>
        ${w ? `<div class="form-actions">
          <button type="submit" class="btn btn-primary">${st.mode === "new" ? "Create" : "Save changes"}</button>
          <button type="button" class="btn btn-ghost" data-act="cancel">Cancel</button>
          ${st.mode === "edit" && v.canDelete !== false ? (st.confirm
            ? `<span class="confirm">Delete permanently?
                 <button type="button" class="btn btn-danger" data-act="delete-yes">Delete</button>
                 <button type="button" class="btn btn-ghost" data-act="delete-no">Keep</button></span>`
            : `<button type="button" class="btn btn-danger-ghost" data-act="delete">${icon("trash")}Delete</button>`) : ""}
        </div>` : ""}
      </form>`;
  }

  const renderAll = () => { renderBody(); renderDetail(); };

  /* ---------- actions ---------- */
  function openRecord(k) {
    resetForm();
    Object.assign(st, { mode: "edit", sel: k });
    renderRows(); renderDetail();
    $("#detail").scrollTop = 0;
  }

  function startNew() {
    resetForm();
    st.mode = "new";
    renderRows(); renderDetail();
    $("#detail").scrollTop = 0;
    $("#recordForm [name]")?.focus();
  }

  function save(form) {
    const v = view(), t = v.table, s = SCHEMA[t];
    if (!writable(v)) return;
    const fields = fieldsOf(v);
    const fd = new FormData(form);
    const raw = {}, parsed = {};
    for (const f of fields) { raw[f.name] = String(fd.get(f.name) ?? ""); parsed[f.name] = parse(f, raw[f.name]); }

    const orig = st.mode === "edit" ? findKey(t, st.sel) : null;
    const cand = orig ? { ...orig } : blankRow(t);
    for (const f of fields) if (!f.virtual) cand[f.name] = parsed[f.name];

    const errors = validate(t, cand, orig, fields, parsed);
    if (Object.keys(errors).length) {
      Object.assign(st, { draft: raw, errors, banner: "", confirm: false });
      renderDetail();
      $("#detail .field.invalid [name]")?.focus();
      return;
    }

    if (t === "invoices" && cand.total == null) cand.total = round2((cand.exam_fee || 0) + medsGiven(cand.appt_id));

    let row = orig;
    if (orig) Object.assign(orig, cand);
    else {
      if (!Array.isArray(s.key)) cand[s.key] = nextId(t);
      DB[t].push(cand);
      row = cand;
    }
    recalcBalances();
    Store.save();

    resetForm();
    Object.assign(st, { mode: "edit", sel: keyOf(t, row) });
    toast(`${orig ? "Saved" : "Created"} ${s.singular.toLowerCase()} ${s.ref ? s.ref(row) : "#" + keyOf(t, row)}.`);
    renderAll();
  }

  function remove() {
    const v = view(), t = v.table, s = SCHEMA[t];
    const row = findKey(t, st.sel);
    if (!row || !writable(v)) return;
    const blockers = (s.dependents || [])
      .map(([dt, col, noun]) => [DB[dt].filter(r => r[col] === row[s.key]).length, noun])
      .filter(([n]) => n);
    if (blockers.length) {
      Object.assign(st, { confirm: false, errors: {},
        banner: `Can't delete: still linked to ${blockers.map(([n, noun]) => `${n} ${noun}${n === 1 ? "" : "s"}`).join(" and ")}. Remove or reassign those first.` });
      return renderDetail();
    }
    for (const [dt, col] of s.cascade || []) DB[dt] = DB[dt].filter(r => r[col] !== row[s.key]);
    DB[t].splice(DB[t].indexOf(row), 1);
    recalcBalances();
    Store.save();
    toast(`Deleted ${s.singular.toLowerCase()} ${s.ref ? s.ref(row) : "#" + keyOf(t, row)}.`);
    resetForm();
    renderAll();
  }

  /* ---------- mount ---------- */
  function mount(id) {
    wsId = id;
    WS = VIEWS[id];
    const meta = Shell.workspace(id);
    st = { view: 0, q: "" };
    resetForm();
    document.title = `LSU-VET · ${meta.label}`;

    $("#app").insertAdjacentHTML("beforeend", `
      <main class="main">
        <header class="topbar">
          <div><h1>${esc(meta.label)}</h1><p>${esc(meta.blurb)}</p></div>
          <div class="top-actions"><div id="rolePicker"></div></div>
        </header>
        <div id="wsBody"></div>
      </main>
      <aside class="detail" id="detail"></aside>`);
    renderAll();

    const body = $("#wsBody"), detail = $("#detail");
    body.addEventListener("click", e => {
      const tab = e.target.closest(".tab");
      if (tab) { st.view = +tab.dataset.view; st.q = ""; resetForm(); return renderAll(); }
      const tr = e.target.closest("tr[data-key]");
      if (tr) return openRecord(tr.dataset.key);
      if (e.target.closest('[data-act="new"]')) startNew();
    });
    body.addEventListener("keydown", e => {
      const tr = e.target.closest("tr[data-key]");
      if (tr && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openRecord(tr.dataset.key); }
    });
    body.addEventListener("input", e => {
      if (e.target.id === "viewSearch") { st.q = e.target.value; renderRows(); }
    });
    detail.addEventListener("submit", e => { e.preventDefault(); save(e.target); });
    detail.addEventListener("click", e => {
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "new") startNew();
      else if (act === "cancel") { resetForm(); renderRows(); renderDetail(); }
      else if (act === "delete") { st.confirm = true; st.banner = ""; renderDetail(); }
      else if (act === "delete-no") { st.confirm = false; renderDetail(); }
      else if (act === "delete-yes") remove();
    });
    document.addEventListener("rolechange", () => { resetForm(); renderAll(); });
  }

  return { mount, SCHEMA, VIEWS };
})();
