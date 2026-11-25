/* ------------------------------------------------------------------
   LSU-VET · shared shell (every page)
   Icons, user roles, sidebar navigation, role picker, toast.
------------------------------------------------------------------- */

/* ---------- icons (inline SVG, stroke-based) ---------- */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  stethoscope: '<path d="M6 3v6a5 5 0 0 0 10 0V3"/><path d="M11 14v2a5 5 0 0 0 10 0v-2"/><circle cx="21" cy="12" r="2"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
  paw: '<circle cx="5" cy="10" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="19" cy="10" r="2"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5c0 2-1.5 3-4 3s-4-1-4-3z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  pill: '<rect x="2" y="8" width="20" height="8" rx="4" transform="rotate(-45 12 12)"/><path d="m8.5 8.5 7 7"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 11h6M9 15h4"/>',
  syringe: '<path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5M9 11l4 4M5 19l-3 3M14 4l6 6"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',
  logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M9 7V4h6v3"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
};
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

/* ---------- user roles ---------- */
const ROLES = {
  // Same values as staff.role in vet.db
  "Owner": "OW",
  "Front Desk": "FD",
  "Veterinarian": "DV",
  "Vet Technician": "VT",
};

/* ---------- the 5 data-entry UIs and who may use them ---------- */
const WORKSPACES = [
  { id: "frontdesk", label: "Front Desk", icon: "users", href: "front-desk.html",
    roles: ["Front Desk", "Owner"],
    blurb: "Register clients and their pets, and keep contact details current." },
  { id: "schedule", label: "Schedule", icon: "calendar", href: "schedule.html",
    roles: ["Front Desk", "Veterinarian", "Owner"],
    blurb: "Book, reschedule, and cancel appointments." },
  { id: "clinical", label: "Clinical", icon: "stethoscope", href: "clinical.html",
    roles: ["Veterinarian", "Vet Technician", "Owner"],
    blurb: "Record exam results, medications given, and prescriptions." },
  { id: "billing", label: "Billing", icon: "receipt", href: "billing.html",
    roles: ["Front Desk", "Owner"],
    blurb: "Create invoices for completed visits and record payments." },
  { id: "admin", label: "Admin", icon: "settings", href: "admin.html",
    roles: ["Owner"],
    blurb: "Manage staff records and the medication catalog." },
];

const Shell = {
  role() {
    try { const r = localStorage.getItem("lsuvet.role"); if (r in ROLES) return r; } catch (_) { /* ignore */ }
    return "Owner";
  },
  setRole(r) {
    try { localStorage.setItem("lsuvet.role", r); } catch (_) { /* ignore */ }
    Shell.renderSidebar();
    Shell.renderRolePicker();
    document.dispatchEvent(new CustomEvent("rolechange", { detail: r }));
    toast(`Now signed in as ${r}.`);
  },
  workspace: id => WORKSPACES.find(w => w.id === id),
  can: (id, role = Shell.role()) => Shell.workspace(id).roles.includes(role),

  renderSidebar() {
    const el = document.getElementById("sidebar");
    if (!el) return;
    const page = document.body.dataset.page;
    const role = Shell.role();
    const item = (id, label, ic, href, ok) => `
      <a class="nav-item ${page === id ? "active" : ""} ${ok ? "" : "locked"}" href="${href}"
         ${page === id ? 'aria-current="page"' : ""} ${ok ? "" : `data-locked="${label}" title="Not available for ${role}"`}>
        ${icon(ic)}<span>${label}</span>${ok ? "" : icon("lock", "nav-lock")}</a>`;
    el.innerHTML = `
      <a class="brand" href="home.html">
        <span class="brand-mark">🐾</span>
        <span class="brand-name">LSU<span>-VET</span></span>
      </a>
      <nav class="nav">
        ${item("home", "Home", "home", "home.html", true)}
        <div class="nav-label">Workspaces</div>
        ${WORKSPACES.map(w => item(w.id, w.label, w.icon, w.href, w.roles.includes(role))).join("")}
      </nav>
      <nav class="nav nav-bottom">
        <button class="nav-item" type="button" data-shell="reset" title="Demo mode: changes are saved in this browser only">${icon("reset")}<span>Reset demo data</span></button>
        <a class="nav-item" href="#" data-shell="soon">${icon("logout")}<span>Sign out</span></a>
      </nav>`;
  },

  renderRolePicker() {
    const el = document.getElementById("rolePicker");
    if (!el) return;
    const role = Shell.role();
    el.innerHTML = `
      <label class="role-pick" title="Switch user (demo)">
        <span><small>Signed in as</small>
          <select id="roleSelect" aria-label="Signed-in role">
            ${Object.keys(ROLES).map(r => `<option ${r === role ? "selected" : ""}>${r}</option>`).join("")}
          </select>
        </span>
        <span class="me">${ROLES[role]}</span>
      </label>`;
  },
};

function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2600);
}

dbReady.then(() => {
  document.querySelectorAll("[data-icon]").forEach(el => el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)));
  Shell.renderSidebar();
  Shell.renderRolePicker();

  document.addEventListener("click", e => {
    const locked = e.target.closest("[data-locked]");
    if (locked) {
      e.preventDefault();
      return toast(`${Shell.role()} doesn't have access to ${locked.dataset.locked}.`);
    }
    const sh = e.target.closest("[data-shell]");
    if (!sh) return;
    e.preventDefault();
    if (sh.dataset.shell === "soon") toast("Sign-in isn't wired up yet. Use the role picker at the top right.");
    if (sh.dataset.shell === "reset" && confirm("Reset all records back to the original demo data? Your changes will be lost.")) {
      Store.reset();
      location.reload();
    }
  });

  document.addEventListener("change", e => {
    if (e.target.id === "roleSelect") Shell.setRole(e.target.value);
  });
});
