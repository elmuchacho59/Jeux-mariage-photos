/*
  Défi Photo – Mariage
  Application statique qui assigne 2 défis photo distincts par invité via une roue de la fortune.
  - Données stockées localement dans localStorage
  - Fonctionne hors ligne
*/

const DEFAULT_CHALLENGES = [
  "Un selfie avec les mariés",
  "Une photo d'un fou rire",
  "La plus belle danse",
  "Un bisous volé",
  "Un toast levé",
  "Les chaussures les plus stylées",
  "Un câlin collectif",
  "Un détail de décoration",
  "Le plus beau sourire",
  "Un moment inattendu",
  "Une photo en noir et blanc",
  "Un plan large de la salle",
  "Une photo avec un inconnu",
  "Les alliances en gros plan",
  "Les mains des invités",
  "Un regard complice",
  "Un enfant qui s'amuse",
  "Un plat qui donne faim",
  "Une blague immortalisée",
  "Le bouquet sous un autre angle"
];

const STORAGE_KEY = "defis_mariage_assignations_v1"; // preserve existing data
const ADMIN_PASS_KEY = "defis_mariage_admin_enabled"; // simple toggle for admin access if needed later
const ADMIN_PIN_KEY = "defis_mariage_admin_pin";
const ADMIN_PIN_VALUE = "0105";
const STORAGE_NAME_KEY = "defis_mariage_invite_names_v1"; // map key->display name

const CHALLENGES_KEY = "defis_mariage_challenges_v1";
const GUESTS_KEY = "defis_mariage_guests_v1"; // { key: { display, password? } }
const ACCESS_MODE_KEY = "defis_mariage_access_mode_v1"; // 'all' | 'guests_only'
const EVENT_PASS_KEY = "defis_mariage_event_pass_v1"; // { required: boolean, password: string }

const state = {
  currentInviteName: null,
  currentRotationDeg: 0,
  isSpinning: false,
  challenges: loadChallenges(),
  assignments: loadAssignments(),
  nameMap: loadNameMap(),
  guests: loadGuests(),
  accessMode: loadAccessMode(),
  eventAccess: loadEventPass(),
  toastTimer: null,
};

function loadAssignments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function loadChallenges() {
  try {
    const raw = localStorage.getItem(CHALLENGES_KEY);
    if (!raw) return [...DEFAULT_CHALLENGES];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim()) : [...DEFAULT_CHALLENGES];
  } catch { return [...DEFAULT_CHALLENGES]; }
}

function saveChallenges() {
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(state.challenges));
}

function saveAssignments() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.assignments));
}

function loadNameMap() {
  try {
    const raw = localStorage.getItem(STORAGE_NAME_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveNameMap() {
  localStorage.setItem(STORAGE_NAME_KEY, JSON.stringify(state.nameMap));
}

function loadGuests() {
  try { const raw = localStorage.getItem(GUESTS_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
function saveGuests() { localStorage.setItem(GUESTS_KEY, JSON.stringify(state.guests)); }

function loadEventPass() {
  try { const raw = localStorage.getItem(EVENT_PASS_KEY); return raw ? JSON.parse(raw) : { required: false, password: '' }; } catch { return { required: false, password: '' }; }
}
function saveEventPass() { localStorage.setItem(EVENT_PASS_KEY, JSON.stringify(state.eventAccess)); }

function loadAccessMode() {
  try { return localStorage.getItem(ACCESS_MODE_KEY) || 'all'; } catch { return 'all'; }
}
function saveAccessMode() { localStorage.setItem(ACCESS_MODE_KEY, state.accessMode); }

function getAssignedForInvite(inviteName) {
  if (!inviteName) return [];
  const key = resolveInviteKey(inviteName);
  return state.assignments[key] || [];
}

function addAssignment(inviteName, challenge) {
  if (!inviteName || !challenge) return;
  const key = resolveInviteKey(inviteName);
  const current = state.assignments[key] || [];
  if (current.includes(challenge)) return;
  const updated = [...current, challenge];
  state.assignments[key] = updated;
  saveAssignments();
}

function clearAllAssignments() {
  state.assignments = {};
  saveAssignments();
  state.nameMap = {};
  saveNameMap();
}

// UI helpers
const $ = (sel) => document.querySelector(sel);
const inviteSection = $("#invite-section");
const wheelSection = $("#wheel-section");
const currentInviteEl = $("#current-invite");
const assignedCountEl = $("#assigned-count");
const assignedItemsEl = $("#assigned-items");
const challengeListEl = $("#challenge-list");
const wheelEl = $("#wheel");
const resultEl = $("#result");
const resultChallengeEl = $("#result-challenge");
const accessBannerEl = document.getElementById('access-banner');
const invitePassInput = document.getElementById('invite-pass');
const invitePassRow = document.getElementById('invite-pass-row');
const inviteNamesDatalist = document.getElementById('invite-names');
const eventPassRow = document.getElementById('event-pass-row');
const eventPassInput = document.getElementById('event-pass');
const spinBtn = $("#spin-btn");
const lockedNoteEl = $("#locked-note");
const progressBarEl = $("#progress-bar");
const toastContainer = $("#toast-container");
const confettiCanvas = $("#confetti-canvas");
const goAdminBtn = $("#go-admin-btn");
const goGalleryBtn = $("#go-gallery-btn");
const adminSection = $("#admin-section");
const adminExitBtn = $("#admin-exit");
const gallerySection = document.getElementById('gallery-section');
const galleryExitBtn = document.getElementById('gallery-exit');
const lightboxEl = document.getElementById('lightbox');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxDownload = document.getElementById('lightbox-download');
const lightboxClose = document.getElementById('lightbox-close');
const adminRefreshBtn = $("#admin-refresh");
const adminCopyBtn = $("#admin-copy");
const adminExportBtn = $("#admin-export");
const adminExportZipBtn = $("#admin-export-zip");
const adminLogoutBtn = $("#admin-logout");
const adminSearchInput = $("#admin-search");
const adminTbody = $("#admin-tbody");
const adminResetAllBtn = $("#admin-reset-all");
const adminChallengesTextarea = $("#admin-challenges");
const adminChallengesSaveBtn = $("#admin-challenges-save");
const adminGuestName = $("#admin-guest-name");
const adminGuestPass = $("#admin-guest-pass");
const adminGuestAddBtn = $("#admin-guest-add");
const adminGuestsTbody = $("#admin-guests-tbody");
const accessModeSelect = $("#access-mode");
const adminTabPending = $("#admin-tab-pending");
const adminTabApproved = $("#admin-tab-approved");
const adminTabPublished = $("#admin-tab-published");
const adminPhotosPendingTbody = $("#admin-photos-pending-tbody");
const adminPhotosApprovedTbody = $("#admin-photos-approved-tbody");
const adminPhotosPublishedTbody = $("#admin-photos-published-tbody");
const eventRequiredSelect = document.getElementById('event-required');
const eventPassAdminInput = document.getElementById('event-pass-admin');
const eventPassSaveBtn = document.getElementById('event-pass-save');

// Upload elements
const uploadSection = $("#upload-section");
const slotInputs = [$("#slot0-input"), $("#slot1-input")];
const slotInputsGallery = [$("#slot0-input-gallery"), $("#slot1-input-gallery")];
const slotBtnCamera = [$("#slot0-btn-camera"), $("#slot1-btn-camera")];
const slotBtnGallery = [$("#slot0-btn-gallery"), $("#slot1-btn-gallery")];
const slotPreviews = [$("#slot0-preview"), $("#slot1-preview")];
const slotZones = [$("#slot0-zone"), $("#slot1-zone")];
const slotClears = [$("#slot0-clear"), $("#slot1-clear")];

function formatWheelBackground(challenges) {
  const n = challenges.length;
  const segments = [];
  for (let i = 0; i < n; i += 1) {
    // Evenly distributed hues for clear segments
    const hue = Math.round((360 * i) / n);
    const color = `hsl(${hue} 80% 58%)`;
    const from = (360 * i) / n;
    const to = (360 * (i + 1)) / n;
    segments.push(`${color} ${from}deg ${to}deg`);
  }
  return `conic-gradient(${segments.join(',')})`;
}

function renderWheel() {
  wheelEl.style.background = formatWheelBackground(state.challenges);
}

function renderChallengeList() {
  // no-op: list visible seulement en admin, alimentée par textarea
}

function renderAssigned(inviteName) {
  const assigned = getAssignedForInvite(inviteName);
  assignedCountEl.textContent = String(assigned.length);
  assignedItemsEl.innerHTML = "";
  assigned.forEach((c) => {
    const li = document.createElement("li");
    li.textContent = c;
    assignedItemsEl.appendChild(li);
  });
  const progress = Math.min(assigned.length / 2, 1) * 100;
  if (progressBarEl) progressBarEl.style.width = `${progress}%`;
  const completed = assigned.length >= 2;
  spinBtn.disabled = completed;
  spinBtn.classList.toggle("disabled", completed);
  lockedNoteEl.classList.toggle("hidden", !completed);
  // Toggle upload section when completed
  uploadSection.classList.toggle("hidden", !completed);
  // Update labels to reflect which challenge is which
  const [c1 = "Défi 1", c2 = "Défi 2"] = assigned;
  const lbl0 = document.getElementById("slot0-label");
  const lbl1 = document.getElementById("slot1-label");
  if (lbl0) lbl0.textContent = c1 || "Défi 1";
  if (lbl1) lbl1.textContent = c2 || "Défi 2";
  // Load any saved photos for this invite
  loadUploadsForInvite(state.currentInviteName);
}

function setCurrentInvite(name) {
  const display = String(name).trim();
  const key = resolveInviteKey(display);
  state.currentInviteName = key;
  state.nameMap[key] = display;
  saveNameMap();
  currentInviteEl.textContent = display;
  renderAssigned(key);
}

function startForInvite(name) {
  if (!name || !name.trim()) {
    alert("Veuillez saisir le nom de l'invité.");
    return;
  }
  // Access control if enabled
  if (state.accessMode === 'guests_only') {
    const key = resolveInviteKey(name);
    const guest = state.guests[key];
    if (!guest) { alert("Accès réservé aux invités. Nom introuvable."); return; }
    if (guest && guest.password) {
      const pin = (invitePassInput && invitePassInput.value) || '';
      if (pin !== guest.password) {
        // Inline error UX
        showToast("Mot de passe incorrect");
        if (invitePassInput) {
          invitePassInput.focus();
          invitePassInput.setCustomValidity("Mot de passe incorrect");
          invitePassInput.reportValidity();
          setTimeout(()=> invitePassInput.setCustomValidity(''), 1500);
        }
        return;
      }
    }
  }
  // Global event password (inline field instead of prompt)
  if (state.eventAccess && state.eventAccess.required) {
    const pin = (eventPassInput && eventPassInput.value) || '';
    if (pin !== state.eventAccess.password) {
      showToast('Mot de passe évènement incorrect');
      if (eventPassInput) {
        eventPassInput.focus();
        eventPassInput.setCustomValidity('Mot de passe évènement incorrect');
        eventPassInput.reportValidity();
        setTimeout(()=> eventPassInput.setCustomValidity(''), 1500);
      }
      return;
    }
  }
  inviteSection.classList.add("hidden");
  wheelSection.classList.remove("hidden");
  setCurrentInvite(name.trim());
  showToast(`Bienvenue ${name.trim()} ! Tournez la roue ✨`);
}

function resetToInviteInput() {
  state.currentInviteName = null;
  $("#invite-name").value = "";
  resultEl.classList.add("hidden");
  inviteSection.classList.remove("hidden");
  wheelSection.classList.add("hidden");
}

function pickAvailableIndexFor(inviteName) {
  const assigned = new Set(getAssignedForInvite(inviteName));
  const available = state.challenges
    .map((c, idx) => ({ c, idx }))
    .filter((x) => !assigned.has(x.c));
  if (available.length === 0) return null;
  const random = available[Math.floor(Math.random() * available.length)];
  return random.idx;
}

function angleForIndexCenter(idx, total) {
  const seg = 360 / total;
  // center of the segment i
  return idx * seg + seg / 2;
}

function spinToIndex(idx) {
  const total = state.challenges.length;
  const targetCenter = angleForIndexCenter(idx, total);
  // Pointer is at 0deg (top). To bring targetCenter under the pointer, rotate wheel so that
  // targetCenter moves to 0 => rotate by (360 - targetCenter)
  const baseRotation = 360 - targetCenter;
  const extraSpins = 360 * (3 + Math.floor(Math.random() * 4)); // 3..6 full spins
  // small randomness inside the segment
  const jitter = (Math.random() - 0.5) * (360 / total) * 0.6;
  const finalRotation = baseRotation + extraSpins + jitter;
  state.currentRotationDeg = (state.currentRotationDeg + finalRotation) % 360000; // keep bounded
  wheelEl.style.transform = `rotate(${state.currentRotationDeg}deg)`;
}

function onSpin() {
  if (state.isSpinning) return;
  const invite = state.currentInviteName;
  if (!invite) return;
  const already = getAssignedForInvite(invite);
  if (already.length >= 2) {
    alert("Cet invité a déjà 2 défis. Passez à l'invité suivant.");
    return;
  }
  const idx = pickAvailableIndexFor(invite);
  if (idx == null) {
    alert("Plus de défis disponibles pour cet invité.");
    return;
  }
  state.isSpinning = true;
  resultEl.classList.add("hidden");
  spinToIndex(idx);

  const onEnd = () => {
    wheelEl.removeEventListener("transitionend", onEnd);
    state.isSpinning = false;

    const challenge = state.challenges[idx];
    addAssignment(invite, challenge);
    renderAssigned(invite);

    resultChallengeEl.textContent = challenge;
    resultEl.classList.remove("hidden");

    const nowAssigned = getAssignedForInvite(invite).length;
    if (nowAssigned < 2) {
      // Prompt next spin subtly
      resultEl.querySelector(".result__title").textContent = "Défi sélectionné (encore 1 à obtenir)";
      showToast("Plus qu'un défi à obtenir !");
    } else {
      resultEl.querySelector(".result__title").textContent = "Défi sélectionné (2/2 obtenus)";
      showToast("Défis complets pour cet invité 🎉");
      launchConfetti();
      // show upload section now that both challenges are ready
      renderAssigned(invite);
    }
  };
  wheelEl.addEventListener("transitionend", onEnd);
}

// Normalize invite name for consistent keying (prevents refresh bypass)
function resolveInviteKey(name) {
  return String(name).trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 àâäçéèêëîïôöùûü-]/gi, '');
}

// Toasts
function showToast(message) {
  if (!toastContainer) return;
  const div = document.createElement("div");
  div.className = "toast";
  div.textContent = message;
  toastContainer.appendChild(div);
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    div.remove();
  }, 2800);
}

// Confetti (simple)
function launchConfetti() {
  const ctx = confettiCanvas.getContext("2d");
  const { innerWidth: w, innerHeight: h } = window;
  confettiCanvas.width = w; confettiCanvas.height = h;
  const particles = Array.from({ length: 150 }, () => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h,
    r: 3 + Math.random() * 4,
    c: `hsl(${Math.floor(Math.random()*360)} 90% 60%)`,
    vy: 2 + Math.random() * 3,
    vx: -1 + Math.random() * 2,
  }));
  let frame = 0;
  const maxFrames = 120;
  function draw() {
    ctx.clearRect(0,0,w,h);
    for (const p of particles) {
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y > h + 20) { p.y = -20; p.x = Math.random()*w; }
    }
    frame += 1;
    if (frame < maxFrames) requestAnimationFrame(draw);
    else { ctx.clearRect(0,0,w,h); }
  }
  draw();
}

// Admin view
function openAdmin() {
  // Require PIN once per session (persist in sessionStorage)
  try {
    const ok = sessionStorage.getItem(ADMIN_PIN_KEY) === 'ok';
    if (!ok) {
      const pin = prompt('Entrez le code PIN Admin');
      if (pin !== ADMIN_PIN_VALUE) { alert('Code incorrect'); return; }
      sessionStorage.setItem(ADMIN_PIN_KEY, 'ok');
    }
  } catch {}
  inviteSection.classList.add("hidden");
  wheelSection.classList.add("hidden");
  adminSection.classList.remove("hidden");
  renderAdminTable();
  if (adminChallengesTextarea) {
    adminChallengesTextarea.value = state.challenges.join("\n");
  }
  renderRanking();
  renderGuests();
  bindAdminPhotoTabs();
  renderAdminPhotos();
}

function closeAdmin() {
  adminSection.classList.add("hidden");
  // Return to appropriate screen
  if (state.currentInviteName) wheelSection.classList.remove("hidden");
  else inviteSection.classList.remove("hidden");
}

function openGallery() {
  inviteSection.classList.add('hidden');
  wheelSection.classList.add('hidden');
  adminSection.classList.add('hidden');
  gallerySection.classList.remove('hidden');
  renderGallery();
  renderPublicRanking();
  hydrateChallengeFilter();
  renderTopLikes();
}

function closeGallery() {
  gallerySection.classList.add('hidden');
  if (state.currentInviteName) wheelSection.classList.remove('hidden');
  else inviteSection.classList.remove('hidden');
}

function renderAdminTable() {
  // La vue “tableau” a été remplacée par les onglets workflow + classements.
  // On se contente d'actualiser ces vues.
  try {
    renderAdminPhotos();
    renderRanking();
  } catch (_) {
    // ignore
  }
}

// ---------- Ranking ----------
function computeDurationMs(inviteKey) {
  const [u0, u1] = getUploadsForInvite(inviteKey);
  if (!u0 || !u1 || !u0.createdAt || !u1.createdAt || !u0.approvedAt || !u1.approvedAt) return null;
  const start = Math.min(u0.createdAt, u1.createdAt);
  const end = Math.max(u0.approvedAt, u1.approvedAt);
  return Math.max(0, end - start);
}

function formatDuration(ms) {
  if (ms == null) return '—';
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m${secs.toString().padStart(2,'0')}s`;
}

function renderRanking() {
  const tbody = document.getElementById('ranking-tbody');
  if (!tbody) return;
  const rows = Object.keys(state.assignments).map((key) => {
    const display = state.nameMap[key] || key;
    const d = computeDurationMs(key);
    return { key, display, d };
  }).filter(r => r.d != null).sort((a,b) => a.d - b.d);
  tbody.innerHTML = '';
  rows.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx+1}</td><td>${escapeHtml(r.display)}</td><td>${formatDuration(r.d)}</td>`;
    tbody.appendChild(tr);
  });
}

function escapeHtml(str) {
  return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}

function copyAdminData() {
  const rows = [["Invité","Défi 1","Défi 2"]];
  for (const [name, arr] of Object.entries(state.assignments)) {
    const displayName = state.nameMap[name] || name;
    rows.push([displayName, arr[0]||"", arr[1]||""]);
  }
  const text = rows.map(r => r.join('\t')).join('\n');
  navigator.clipboard.writeText(text).then(() => showToast("Copié dans le presse-papiers"));
}

function exportCSV() {
  const rows = [["Invite","Defi1","Defi2","Photo1_statut","Photo2_statut"]];
  for (const [name, arr] of Object.entries(state.assignments)) {
    const displayName = state.nameMap[name] || name;
    const [u0,u1] = getUploadsForInvite(name);
    const st0 = u0 ? `${u0.approved?'approuvée':'en_attente'}/${u0.published?'publiée':'non_publiée'}` : '';
    const st1 = u1 ? `${u1.approved?'approuvée':'en_attente'}/${u1.published?'publiée':'non_publiée'}` : '';
    rows.push([displayName, arr[0]||"", arr[1]||"", st0, st1]);
  }
  const csv = rows.map(r => r.map(cell => '"' + String(cell).replaceAll('"','""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'assignations_defis.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Export ZIP of published gallery
async function exportZipGallery() {
  // Minimal ZIP builder (store method, no compression) to avoid external libs
  // Structure: each published image as files photo_<index>.jpg
  const files = [];
  let idx = 1;
  for (const [inviteKey, arr] of Object.entries(uploads)) {
    const display = state.nameMap[inviteKey] || inviteKey;
    (arr || []).forEach((up, slot) => {
      if (up && up.data && up.published) {
        files.push({
          name: `gallery/${sanitizeFileName(display)}_${slot+1}.jpg`,
          dataUrl: up.data,
        });
        idx += 1;
      }
    });
  }
  if (files.length === 0) { alert('Aucune photo publiée.'); return; }

  const blobs = await Promise.all(files.map(f => dataUrlToUint8Array(f.dataUrl).then(bytes => ({ name: f.name, bytes }))));
  const zipBlob = buildZipBlob(blobs);
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'galerie_publiee.zip';
  a.click();
  URL.revokeObjectURL(url);
}

function sanitizeFileName(name) {
  return String(name).normalize('NFKD').replace(/[^\w\-\s\.]+/g,'').trim().replace(/\s+/g,'_');
}

function dataUrlToUint8Array(dataUrl) {
  return new Promise((resolve, reject) => {
    try {
      const base64 = dataUrl.split(',')[1];
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i=0;i<len;i++) bytes[i] = binary.charCodeAt(i);
      resolve(bytes);
    } catch (e) { reject(e); }
  });
}

function buildZipBlob(files) {
  // Very small ZIP writer: only "store" entries, UTC timestamps omitted
  const encoder = new TextEncoder();
  const fileRecords = [];
  let offset = 0;
  const chunks = [];

  function crc32(bytes) {
    // Simple CRC32
    let c = ~0;
    for (let i=0;i<bytes.length;i++) {
      c ^= bytes[i];
      for (let k=0;k<8;k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
    }
    return ~c >>> 0;
  }

  for (const f of files) {
    const nameBytes = encoder.encode(f.name);
    const csum = crc32(f.bytes);
    const size = f.bytes.length;
    // Local file header
    const lf = new DataView(new ArrayBuffer(30));
    let p = 0;
    lf.setUint32(p, 0x04034b50, true); p+=4; // signature
    lf.setUint16(p, 20, true); p+=2; // version needed
    lf.setUint16(p, 0, true); p+=2; // flags
    lf.setUint16(p, 0, true); p+=2; // compression method 0 (store)
    lf.setUint16(p, 0, true); p+=2; // file mod time
    lf.setUint16(p, 0, true); p+=2; // file mod date
    lf.setUint32(p, csum, true); p+=4; // crc32
    lf.setUint32(p, size, true); p+=4; // compressed size
    lf.setUint32(p, size, true); p+=4; // uncompressed size
    lf.setUint16(p, nameBytes.length, true); p+=2; // file name length
    lf.setUint16(p, 0, true); p+=2; // extra length
    chunks.push(new Uint8Array(lf.buffer));
    chunks.push(nameBytes);
    chunks.push(f.bytes);

    fileRecords.push({ nameBytes, csum, size, offset });
    offset += 30 + nameBytes.length + size;
  }

  const cdStart = offset;
  for (const r of fileRecords) {
    const cd = new DataView(new ArrayBuffer(46));
    let p = 0;
    cd.setUint32(p, 0x02014b50, true); p+=4; // signature
    cd.setUint16(p, 20, true); p+=2; // version made by
    cd.setUint16(p, 20, true); p+=2; // version needed
    cd.setUint16(p, 0, true); p+=2; // flags
    cd.setUint16(p, 0, true); p+=2; // method 0
    cd.setUint16(p, 0, true); p+=2; // time
    cd.setUint16(p, 0, true); p+=2; // date
    cd.setUint32(p, r.csum, true); p+=4;
    cd.setUint32(p, r.size, true); p+=4; // comp size
    cd.setUint32(p, r.size, true); p+=4; // uncomp size
    cd.setUint16(p, r.nameBytes.length, true); p+=2;
    cd.setUint16(p, 0, true); p+=2; // extra len
    cd.setUint16(p, 0, true); p+=2; // comment len
    cd.setUint16(p, 0, true); p+=2; // disk number start
    cd.setUint16(p, 0, true); p+=2; // internal attrs
    cd.setUint32(p, 0, true); p+=4; // external attrs
    cd.setUint32(p, r.offset, true); p+=4; // relative offset
    chunks.push(new Uint8Array(cd.buffer));
    chunks.push(r.nameBytes);
  }
  const cdEnd = offset = cdStart + fileRecords.reduce((sum, r) => sum + 46 + r.nameBytes.length, 0);

  const eocd = new DataView(new ArrayBuffer(22));
  let q = 0;
  eocd.setUint32(q, 0x06054b50, true); q+=4; // signature
  eocd.setUint16(q, 0, true); q+=2; // disk number
  eocd.setUint16(q, 0, true); q+=2; // disk start
  eocd.setUint16(q, fileRecords.length, true); q+=2; // number of records on this disk
  eocd.setUint16(q, fileRecords.length, true); q+=2; // total records
  eocd.setUint32(q, cdEnd - cdStart, true); q+=4; // size of central dir
  eocd.setUint32(q, cdStart, true); q+=4; // offset of central dir
  eocd.setUint16(q, 0, true); q+=2; // comment length
  chunks.push(new Uint8Array(eocd.buffer));

  // Blob concat
  return new Blob(chunks, { type: 'application/zip' });
}

function init() {
  renderWheel();
  renderChallengeList();

  // Wire buttons avec gardes (certains éléments peuvent être absents)
  const startBtn = document.getElementById("start-btn");
  const inviteInput = document.getElementById("invite-name");
  const nextInviteBtn = document.getElementById("next-invite-btn");
  if (startBtn) startBtn.addEventListener("click", () => startForInvite(inviteInput && inviteInput.value));
  if (inviteInput) inviteInput.addEventListener("keydown", (e) => { if (e.key === "Enter") startForInvite(inviteInput.value); });
  if (nextInviteBtn) nextInviteBtn.addEventListener("click", () => resetToInviteInput());
  if (spinBtn) spinBtn.addEventListener("click", onSpin);

  if (goAdminBtn) goAdminBtn.addEventListener("click", openAdmin);
  if (goGalleryBtn) goGalleryBtn.addEventListener('click', openGallery);
  if (adminExitBtn) adminExitBtn.addEventListener("click", closeAdmin);
  if (galleryExitBtn) galleryExitBtn.addEventListener('click', closeGallery);
  if (adminRefreshBtn) adminRefreshBtn.addEventListener("click", renderAdminTable);
  if (adminCopyBtn) adminCopyBtn.addEventListener("click", () => { copyAdminData(); renderAdminPhotos(); });
  if (adminExportBtn) adminExportBtn.addEventListener("click", exportCSV);
  if (adminExportZipBtn) adminExportZipBtn.addEventListener("click", exportZipGallery);
  if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', () => {
    try { sessionStorage.removeItem(ADMIN_PIN_KEY); } catch {}
    alert('Déconnecté de l\'espace Admin.');
    closeAdmin();
  });
  if (adminSearchInput) adminSearchInput.addEventListener("input", renderAdminTable);
  if (adminResetAllBtn) adminResetAllBtn.addEventListener("click", () => {
    if (confirm("Tout effacer (assignations, noms, photos) sur cet appareil ?")) {
      clearAllAssignments();
      clearAllUploads();
      renderAdminTable();
      showToast("Données réinitialisées");
    }
  });

  if (adminChallengesSaveBtn) adminChallengesSaveBtn.addEventListener("click", () => {
    const lines = (adminChallengesTextarea.value || "").split(/\r?\n/)
      .map(s => s.trim()).filter(Boolean);
    if (lines.length < 3) {
      alert("Veuillez renseigner au moins 3 défis.");
      return;
    }
    state.challenges = lines;
    saveChallenges();
    renderWheel();
    showToast("Défis mis à jour");
  });

  if (adminGuestAddBtn) adminGuestAddBtn.addEventListener('click', () => {
    const name = (adminGuestName.value||'').trim();
    const pass = (adminGuestPass.value||'').trim();
    if (!name) { alert("Nom requis"); return; }
    const key = resolveInviteKey(name);
    state.guests[key] = { display: name, password: pass || null };
    saveGuests();
    renderGuests();
    adminGuestName.value = ''; adminGuestPass.value = '';
  });

  if (accessModeSelect) {
    accessModeSelect.value = state.accessMode;
    accessModeSelect.addEventListener('change', () => {
      state.accessMode = accessModeSelect.value; saveAccessMode();
      showToast("Mode d'accès mis à jour");
    });
  }

  // Event access admin bindings
  if (eventRequiredSelect && eventPassAdminInput && eventPassSaveBtn) {
    eventRequiredSelect.value = state.eventAccess.required ? 'yes' : 'no';
    eventPassAdminInput.value = state.eventAccess.password || '';
    eventPassSaveBtn.addEventListener('click', () => {
      const required = (eventRequiredSelect.value === 'yes');
      const pwd = (eventPassAdminInput.value || '').trim();
      if (required && !pwd) { alert('Veuillez saisir un mot de passe évènement.'); return; }
      state.eventAccess.required = required;
      state.eventAccess.password = pwd;
      saveEventPass();
      if (eventPassRow) eventPassRow.classList.toggle('hidden', !required);
      if (!required && eventPassInput) {
        eventPassInput.value = '';
        eventPassInput.classList.remove('is-valid','is-invalid');
      }
      showToast('Mot de passe évènement mis à jour');
    });
  }

  const adminPhotoSort = document.getElementById('admin-photo-sort');
  if (adminPhotoSort) adminPhotoSort.addEventListener('change', renderAdminPhotos);

  // Render gallery on load
  renderGallery();
  renderPublicRanking();
  hydrateChallengeFilter();
  renderTopLikes();

  // Access banner visibility
  if (accessBannerEl) {
    accessBannerEl.classList.toggle('hidden', state.accessMode !== 'guests_only');
  }

  // Populate datalist with guests when restricted
  if (inviteNamesDatalist) {
    inviteNamesDatalist.innerHTML = '';
    if (state.accessMode === 'guests_only') {
      Object.values(state.guests).forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.display;
        inviteNamesDatalist.appendChild(opt);
      });
    }
  }

  // Show password field only when a guest with password is matched
  const inviteInputEl = document.getElementById('invite-name');
  if (inviteInputEl) {
    inviteInputEl.addEventListener('input', () => {
      if (state.accessMode !== 'guests_only') { if(invitePassRow) invitePassRow.classList.add('hidden'); return; }
      const key = resolveInviteKey(inviteInputEl.value||'');
      const guest = state.guests[key];
      const needPass = !!(guest && guest.password);
      if (invitePassRow) invitePassRow.classList.toggle('hidden', !needPass);
    });
  }

  // Password helpers
  const passHelpBtn = document.getElementById('invite-pass-help');
  if (passHelpBtn) passHelpBtn.addEventListener('click', ()=> alert('Indice mot de passe: ta date de naissance au format JJ/MM/AAAA (ex: 01/01/1990).'));
  const passToggleBtn = document.getElementById('invite-pass-toggle');
  if (passToggleBtn && invitePassInput) passToggleBtn.addEventListener('click', ()=> {
    const isText = invitePassInput.type === 'text';
    invitePassInput.type = isText ? 'password' : 'text';
    passToggleBtn.setAttribute('aria-pressed', String(!isText));
  });

  // Event password UI toggles on load
  if (eventPassRow) eventPassRow.classList.toggle('hidden', !(state.eventAccess && state.eventAccess.required));
  const eventHelpBtn = document.getElementById('event-pass-help');
  if (eventHelpBtn) eventHelpBtn.addEventListener('click', ()=> alert("Demandez le mot de passe de l'évènement aux organisateurs."));
  const eventToggleBtn = document.getElementById('event-pass-toggle');
  if (eventToggleBtn && eventPassInput) eventToggleBtn.addEventListener('click', ()=> {
    const isText = eventPassInput.type === 'text';
    eventPassInput.type = isText ? 'password' : 'text';
    eventToggleBtn.setAttribute('aria-pressed', String(!isText));
  });
  // Live validation of event pass
  if (eventPassInput) eventPassInput.addEventListener('input', ()=> {
    if (!(state.eventAccess && state.eventAccess.required)) return;
    const ok = eventPassInput.value === (state.eventAccess.password||'');
    eventPassInput.classList.toggle('is-valid', ok);
    eventPassInput.classList.toggle('is-invalid', !ok && eventPassInput.value.length>0);
  });
  if (invitePassInput) invitePassInput.addEventListener('input', ()=> {
    if (state.accessMode !== 'guests_only') return;
    const nameEl = document.getElementById('invite-name');
    const key = resolveInviteKey((nameEl && nameEl.value)||'');
    const guest = state.guests[key];
    if (!(guest && guest.password)) return;
    const ok = invitePassInput.value === guest.password;
    invitePassInput.classList.toggle('is-valid', ok);
    invitePassInput.classList.toggle('is-invalid', !ok && invitePassInput.value.length>0);
  });

  // Upload handlers
  slotInputs.forEach((input, i) => {
    if (!input) return;
    input.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleImageSelected(i, file);
    });
  });
  slotInputsGallery.forEach((input, i) => {
    if (!input) return;
    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleImageSelected(i, file);
    });
  });
  slotBtnCamera.forEach((btn, i) => {
    if (!btn) return;
    btn.addEventListener('click', () => { const el = slotInputs[i]; if (el) el.click(); });
  });
  slotBtnGallery.forEach((btn, i) => {
    if (!btn) return;
    btn.addEventListener('click', () => { const el = slotInputsGallery[i]; if (el) el.click(); });
  });
  slotZones.forEach((zone, i) => {
    if (!zone) return;
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("dragover"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault(); zone.classList.remove("dragover");
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) handleImageSelected(i, file);
    });
  });
  slotClears.forEach((btn, i) => { if (btn) btn.addEventListener("click", () => clearSlot(i)); });

  // Lightbox events
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', hideLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', hideLightbox);
}

function renderGuests() {
  if (!adminGuestsTbody) return;
  adminGuestsTbody.innerHTML = '';
  const entries = Object.entries(state.guests).sort(([a],[b]) => a.localeCompare(b));
  entries.forEach(([key, g]) => {
    const status = computeDurationMs(key) != null ? '✅ 2/2 validés' : '⏳ en cours';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${escapeHtml(g.display||key)}</td>
      <td>${g.password ? '••••' : '—'}</td>
      <td>${status}</td>
      <td>
        <button class="btn" data-g="${key}" data-act="edit">Éditer</button>
        <button class="btn danger" data-g="${key}" data-act="del">Supprimer</button>
      </td>`;
    adminGuestsTbody.appendChild(tr);
  });
  adminGuestsTbody.querySelectorAll('button[data-act="del"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-g');
      if (confirm('Supprimer cet invité ?')) { delete state.guests[k]; saveGuests(); renderGuests(); }
    });
  });
  adminGuestsTbody.querySelectorAll('button[data-act="edit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-g');
      const g = state.guests[k];
      const newName = prompt('Nom de l\'invité', g.display||'');
      if (!newName) return;
      const newPass = prompt('Mot de passe (laisser vide pour aucun)', g.password||'');
      const newKey = resolveInviteKey(newName);
      delete state.guests[k];
      state.guests[newKey] = { display: newName, password: newPass||null };
      saveGuests(); renderGuests();
    });
  });
}

function bindAdminPhotoTabs() {
  if (!adminTabPending || !adminTabApproved || !adminTabPublished) return;
  const views = {
    pending: document.getElementById('admin-photos-pending'),
    approved: document.getElementById('admin-photos-approved'),
    published: document.getElementById('admin-photos-published')
  };
  function activate(which) {
    adminTabPending.classList.toggle('active', which==='pending');
    adminTabApproved.classList.toggle('active', which==='approved');
    adminTabPublished.classList.toggle('active', which==='published');
    views.pending.classList.toggle('hidden', which!=='pending');
    views.approved.classList.toggle('hidden', which!=='approved');
    views.published.classList.toggle('hidden', which!=='published');
  }
  adminTabPending.addEventListener('click', ()=> activate('pending'));
  adminTabApproved.addEventListener('click', ()=> activate('approved'));
  adminTabPublished.addEventListener('click', ()=> activate('published'));
}

function renderAdminPhotos() {
  if (!adminPhotosPendingTbody || !adminPhotosApprovedTbody || !adminPhotosPublishedTbody) return;
  adminPhotosPendingTbody.innerHTML = '';
  adminPhotosApprovedTbody.innerHTML = '';
  adminPhotosPublishedTbody.innerHTML = '';
  const fmt = (ts) => ts ? new Date(ts).toLocaleString() : '—';
  const sortMode = (document.getElementById('admin-photo-sort')?.value) || 'date_desc';
  const records = [];
  for (const [inviteKey, arr] of Object.entries(uploads)) {
    const display = state.nameMap[inviteKey] || inviteKey;
    (arr||[]).forEach((up, slot) => {
      if (!up || !up.data) return;
      const id = makeImageId(inviteKey, up.data); const c = (likesDb[id]&&likesDb[id].count)||0;
      records.push({ inviteKey, slot, up, display, likes: c });
    });
  }
  records.sort((a,b) => {
    if (sortMode === 'date_asc') return (a.up.createdAt||0) - (b.up.createdAt||0);
    if (sortMode === 'likes_desc') return (b.likes||0) - (a.likes||0);
    return (b.up.createdAt||0) - (a.up.createdAt||0);
  });
  for (const rec of records) {
    const { inviteKey, slot, up, display, likes } = rec;
    const tr = document.createElement('tr');
    const img = `<img src="${up.data}" alt="mini" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;"/>`;
    if (!up.approved && !up.published) {
      tr.innerHTML = `<td>${img}</td><td>${escapeHtml(display)}</td><td>${escapeHtml(up.challengeLabel||'')}</td><td>${fmt(up.createdAt)}</td><td><button class="btn" data-act="approve" data-g="${inviteKey}" data-slot="${slot}">Valider</button></td>`;
      adminPhotosPendingTbody.appendChild(tr);
    } else if (up.approved && !up.published) {
      tr.innerHTML = `<td>${img}</td><td>${escapeHtml(display)}</td><td>${escapeHtml(up.challengeLabel||'')}</td><td>${fmt(up.approvedAt)}</td><td><button class="btn" data-act="publish" data-g="${inviteKey}" data-slot="${slot}">Publier</button></td>`;
      adminPhotosApprovedTbody.appendChild(tr);
    } else if (up.published) {
      tr.innerHTML = `<td>${img}</td><td>${escapeHtml(display)}</td><td>${escapeHtml(up.challengeLabel||'')}</td><td>${fmt(up.publishedAt)}</td><td>${likes} ❤️</td>`;
      adminPhotosPublishedTbody.appendChild(tr);
    }
  }
  // Bind actions
  adminPhotosPendingTbody.querySelectorAll('button[data-act="approve"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = btn.getAttribute('data-g'); const s = Number(btn.getAttribute('data-slot'));
      handleAdminActionOnUpload('approve', g, s);
      renderAdminPhotos();
    });
  });
  adminPhotosApprovedTbody.querySelectorAll('button[data-act="publish"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = btn.getAttribute('data-g'); const s = Number(btn.getAttribute('data-slot'));
      handleAdminActionOnUpload('publish', g, s);
      renderAdminPhotos();
    });
  });
}

// ---------- Upload storage ----------
const UPLOADS_KEY = "defis_mariage_uploads_v2"; // { inviteKey: [{data, approved, published, challengeLabel}, ...] }

function loadUploads() {
  try {
    const raw = localStorage.getItem(UPLOADS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch { return {}; }
}
let uploads = loadUploads();
function saveUploads() { localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads)); }

function getUploadsForInvite(inviteKey) {
  const entry = uploads[inviteKey];
  if (!entry) return [null, null];
  return [entry[0] || null, entry[1] || null];
}
function setUploadForInvite(inviteKey, slot, dataUrl) {
  const current = uploads[inviteKey] || [null, null];
  const challengeLabel = (getAssignedForInvite(inviteKey)[slot]) || (slot === 0 ? 'Défi 1' : 'Défi 2');
  current[slot] = { data: dataUrl, approved: false, published: false, challengeLabel, createdAt: Date.now(), approvedAt: null, publishedAt: null };
  uploads[inviteKey] = current;
  saveUploads();
}
function clearAllUploads() { uploads = {}; saveUploads(); }
function getUploadsInfo(inviteKey) {
  const [a,b] = getUploadsForInvite(inviteKey);
  const count = (a&&a.data?1:0) + (b&&b.data?1:0);
  return `${count}/2 photo(s)`;
}

function loadUploadsForInvite(inviteKey) {
  const [a,b] = getUploadsForInvite(inviteKey);
  const arr = [a,b];
  arr.forEach((dataUrl, i) => {
    const img = slotPreviews[i];
    const zone = slotZones[i];
    const data = dataUrl && dataUrl.data;
    if (data) {
      img.src = data; img.classList.remove('hidden');
      zone.querySelector('.drop__hint').classList.add('hidden');
    } else {
      img.src = ''; img.classList.add('hidden');
      zone.querySelector('.drop__hint').classList.remove('hidden');
    }
  });
}

function clearSlot(i) {
  const key = state.currentInviteName;
  if (!key) return;
  const entry = uploads[key] || [null, null];
  entry[i] = null;
  uploads[key] = entry;
  saveUploads();
  loadUploadsForInvite(key);
}

async function handleImageSelected(slot, file) {
  try {
    const dataUrl = await compressImageToDataUrl(file, 1600, 0.8);
    const key = state.currentInviteName;
    if (!key) return;
    setUploadForInvite(key, slot, dataUrl);
    loadUploadsForInvite(key);
    showToast(`Photo ${slot+1} enregistrée`);
  } catch (e) {
    alert("Impossible de traiter l'image.");
  }
}

function handleAdminActionOnUpload(action, inviteKey, slot) {
  const entry = uploads[inviteKey] || [null, null];
  const item = entry[slot];
  if (!item) return;
  if (action === 'approve') item.approved = true;
  if (action === 'reject') { item.approved = false; item.published = false; }
  if (action === 'publish') {
    if (!item.approved) { alert('Veuillez valider la photo avant de la publier.'); return; }
    item.published = true;
  }
  if (action === 'approve') item.approvedAt = Date.now();
  if (action === 'publish') item.publishedAt = Date.now();
  uploads[inviteKey] = entry;
  saveUploads();
  renderAdminTable();
  renderGallery();
}

function renderGallery() {
  const columnsWrap = document.getElementById('gallery-columns');
  if (!columnsWrap) return;
  columnsWrap.innerHTML = '';
  // Group published images by challenge label
  const byChallenge = new Map();
  for (const [inviteKey, arr] of Object.entries(uploads)) {
    const display = state.nameMap[inviteKey] || inviteKey;
    (arr || []).forEach((up) => {
      if (up && up.data && up.published) {
        const label = up.challengeLabel || 'Défi';
        if (!byChallenge.has(label)) byChallenge.set(label, []);
        byChallenge.get(label).push({ img: up.data, label, invite: display, inviteKey });
      }
    });
  }
  const labels = Array.from(byChallenge.keys()).sort();
  labels.forEach((label, idx) => {
    const col = document.createElement('div');
    col.className = 'gallery-column';
    col.innerHTML = `<h4>Défi ${idx+1} – ${escapeHtml(label)}</h4>`;
    const grid = document.createElement('div');
    grid.className = 'gallery-grid';
    byChallenge.get(label).forEach(({ img, invite, inviteKey }) => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      const likes = getLikesFor(inviteKey, img);
      // Friendly time phrase if computable
      const [u0,u1] = getUploadsForInvite(inviteKey);
      const uploadsTimes = [u0&&u0.createdAt, u1&&u1.createdAt].filter(Boolean);
      const approvedTimes = [u0&&u0.approvedAt, u1&&u1.approvedAt].filter(Boolean);
      let timeInfo = '';
      if (uploadsTimes.length === 2 && approvedTimes.length === 2) {
        const start = Math.min(...uploadsTimes);
        const end = Math.max(...approvedTimes);
        const ms = Math.max(0, end - start);
        const mins = Math.floor(ms/60000); const secs = Math.floor((ms%60000)/1000);
        timeInfo = `Bravo ! Défi réalisé en ${mins}m${secs.toString().padStart(2,'0')}s 🎯`;
      }
      div.innerHTML = `<img src="${img}" alt="${escapeHtml(label)}"/>
        <div class="badge">${escapeHtml(invite)}</div>
        <button class="like" type="button" aria-label="J'aime"><span>❤️</span><span class="like-count">${likes}</span></button>
        <div style="position:absolute;bottom:6px;left:6px;right:6px;background:rgba(0,0,0,0.55);color:white;font-size:12px;padding:4px 6px;border-radius:8px;">${escapeHtml(label)}${timeInfo? ' – '+timeInfo: ''}</div>`;
      div.addEventListener('click', (e) => {
        if (e.target.closest('.like')) return; // like handled separately
        showLightbox(img, `${invite} – ${label}`);
      });
      div.querySelector('.like').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLike(inviteKey, img, div.querySelector('.like'));
      });
      grid.appendChild(div);
    });
    col.appendChild(grid);
    columnsWrap.appendChild(col);
  });
}

// ---------- Likes ----------
const LIKES_KEY = 'defis_mariage_likes_v1';
function loadLikes() {
  try { const raw = localStorage.getItem(LIKES_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
let likesDb = loadLikes(); // structure: { imageId: { count: number, voters: { deviceId: true } } }
const DEVICE_KEY = 'defis_mariage_device_id';
function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) { id = Math.random().toString(36).slice(2); localStorage.setItem(DEVICE_KEY, id); }
  return id;
}
function makeImageId(inviteKey, imgData) { return `${inviteKey}:${imgData.slice(0,50)}`; }
function getLikesFor(inviteKey, imgData) {
  const id = makeImageId(inviteKey, imgData);
  const rec = likesDb[id];
  return rec && typeof rec.count === 'number' ? rec.count : 0;
}
function toggleLike(inviteKey, imgData, btnEl) {
  const id = makeImageId(inviteKey, imgData);
  const device = getDeviceId();
  if (!likesDb[id]) likesDb[id] = { count: 0, voters: {} };
  const rec = likesDb[id];
  if (rec.voters[device]) { // unlike
    rec.voters[device] = false;
    rec.count = Math.max(0, rec.count - 1);
    btnEl.classList.remove('liked');
  } else { // like
    rec.voters[device] = true;
    rec.count += 1;
    btnEl.classList.add('liked');
  }
  localStorage.setItem(LIKES_KEY, JSON.stringify(likesDb));
  const c = btnEl.querySelector('.like-count');
  if (c) c.textContent = String(rec.count);
}

function showLightbox(src, caption) {
  if (!lightboxEl) return;
  lightboxImg.src = src;
  lightboxCaption.textContent = caption || '';
  lightboxDownload.href = src;
  lightboxEl.classList.remove('hidden');
}

function hideLightbox() {
  if (!lightboxEl) return;
  lightboxEl.classList.add('hidden');
  lightboxImg.src = '';
}

function renderTopLikes() {
  const labelEl = document.getElementById('top-like-label');
  const countEl = document.getElementById('top-like-count');
  if (!labelEl || !countEl) return;
  let best = { count: 0, label: '—' };
  for (const [inviteKey, arr] of Object.entries(uploads)) {
    (arr||[]).forEach((up) => {
      if (up && up.data && up.published) {
        const id = makeImageId(inviteKey, up.data);
        const rec = likesDb[id];
        const c = rec && rec.count ? rec.count : 0;
        if (c > best.count) best = { count: c, label: `${state.nameMap[inviteKey]||inviteKey} – ${up.challengeLabel||''}` };
      }
    });
  }
  labelEl.textContent = best.label;
  countEl.textContent = String(best.count);
}

function renderPublicRanking() {
  const tbody = document.getElementById('public-ranking-tbody');
  const podium = document.getElementById('public-podium');
  if (!tbody || !podium) return;
  const rows = Object.keys(state.assignments).map((key) => {
    const display = state.nameMap[key] || key;
    const d = computeDurationMs(key);
    return { key, display, d };
  }).filter(r => r.d != null).sort((a,b) => a.d - b.d);
  tbody.innerHTML = '';
  rows.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx+1}</td><td>${escapeHtml(r.display)}</td><td>${formatDuration(r.d)}</td>`;
    tbody.appendChild(tr);
  });
  // Podium top 3
  podium.innerHTML = '';
  const top = rows.slice(0,3);
  top.forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'step';
    div.innerHTML = `<h4>${i===0?'🥇':i===1?'🥈':'🥉'} ${escapeHtml(r.display)}</h4><div>${formatDuration(r.d)}</div>`;
    podium.appendChild(div);
  });
}

function hydrateChallengeFilter() {
  const select = document.getElementById('challenge-filter');
  if (!select) return;
  select.innerHTML = '';
  // Build unique list of challenge labels present in uploads published or approved
  const labels = new Set();
  for (const [key, arr] of Object.entries(uploads)) {
    (arr||[]).forEach(up => { if (up && up.challengeLabel) labels.add(up.challengeLabel); });
  }
  const opts = Array.from(labels).sort();
  opts.forEach(l => {
    const o = document.createElement('option');
    o.value = l; o.textContent = l; select.appendChild(o);
  });
  // Wire tabs and select
  const tabGen = document.getElementById('tab-general');
  const tabCh = document.getElementById('tab-by-challenge');
  const tabLikes = document.getElementById('tab-by-likes');
  const viewGen = document.getElementById('rank-general');
  const viewCh = document.getElementById('rank-by-challenge');
  const viewLikes = document.getElementById('rank-by-likes');
  if (tabGen) tabGen.addEventListener('click', () => {
    tabGen.classList.add('active'); tabCh.classList.remove('active'); tabLikes.classList.remove('active');
    viewGen.classList.remove('hidden'); viewCh.classList.add('hidden'); viewLikes.classList.add('hidden');
  });
  if (tabCh) tabCh.addEventListener('click', () => {
    tabCh.classList.add('active'); tabGen.classList.remove('active'); tabLikes.classList.remove('active');
    viewCh.classList.remove('hidden'); viewGen.classList.add('hidden'); viewLikes.classList.add('hidden');
    renderRankingByChallenge(select.value);
  });
  if (tabLikes) tabLikes.addEventListener('click', () => {
    tabLikes.classList.add('active'); tabGen.classList.remove('active'); tabCh.classList.remove('active');
    viewLikes.classList.remove('hidden'); viewGen.classList.add('hidden'); viewCh.classList.add('hidden');
    renderRankingByLikes();
  });
  select.addEventListener('change', () => renderRankingByChallenge(select.value));
}

function computeDurationForChallenge(inviteKey, label) {
  const [u0,u1] = getUploadsForInvite(inviteKey);
  const arr = [u0,u1];
  // Only consider photos whose challengeLabel matches and are approved
  const filtered = arr.filter(up => up && up.challengeLabel === label && up.createdAt && up.approvedAt);
  if (filtered.length === 0) return null;
  // If both slots match, take min created and max approved among those two
  const start = Math.min(...filtered.map(f => f.createdAt));
  const end = Math.max(...filtered.map(f => f.approvedAt));
  return Math.max(0, end - start);
}

function renderRankingByChallenge(label) {
  const tbody = document.getElementById('challenge-ranking-tbody');
  const podium = document.getElementById('challenge-podium');
  if (!tbody || !podium) return;
  const rows = Object.keys(state.assignments).map((key) => {
    const display = state.nameMap[key] || key;
    const d = computeDurationForChallenge(key, label);
    return { key, display, d };
  }).filter(r => r.d != null).sort((a,b) => a.d - b.d);
  tbody.innerHTML = '';
  rows.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx+1}</td><td>${escapeHtml(r.display)}</td><td>${formatDuration(r.d)}</td>`;
    tbody.appendChild(tr);
  });
  podium.innerHTML = '';
  rows.slice(0,3).forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'step';
    div.innerHTML = `<h4>${i===0?'🥇':i===1?'🥈':'🥉'} ${escapeHtml(r.display)}</h4><div>${formatDuration(r.d)}</div>`;
    podium.appendChild(div);
  });
}

function renderRankingByLikes() {
  const tbody = document.getElementById('likes-ranking-tbody');
  const podium = document.getElementById('likes-podium');
  if (!tbody || !podium) return;
  // Build list of published photos with like counts
  const items = [];
  for (const [inviteKey, arr] of Object.entries(uploads)) {
    const display = state.nameMap[inviteKey] || inviteKey;
    (arr||[]).forEach((up) => {
      if (up && up.data && up.published) {
        const id = makeImageId(inviteKey, up.data);
        const c = (likesDb[id] && likesDb[id].count) ? likesDb[id].count : 0;
        items.push({ display, challenge: up.challengeLabel||'', likes: c });
      }
    });
  }
  items.sort((a,b) => b.likes - a.likes);
  tbody.innerHTML = '';
  items.forEach((it, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx+1}</td><td>${escapeHtml(it.display)}</td><td>${escapeHtml(it.challenge)}</td><td>${it.likes}</td>`;
    tbody.appendChild(tr);
  });
  podium.innerHTML = '';
  items.slice(0,3).forEach((it, i) => {
    const div = document.createElement('div');
    div.className = 'step';
    div.innerHTML = `<h4>${i===0?'🥇':i===1?'🥈':'🥉'} ${escapeHtml(it.display)}</h4><div>${escapeHtml(it.challenge)} – ${it.likes} ❤️</div>`;
    podium.appendChild(div);
  });
}

function compressImageToDataUrl(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => { img.src = reader.result; };
    reader.onerror = reject;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let { width, height } = img;
      const ratio = Math.min(1, maxSize / Math.max(width, height));
      width = Math.round(width * ratio); height = Math.round(height * ratio);
      canvas.width = width; canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('No blob'));
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
      }, 'image/jpeg', quality);
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

window.addEventListener("DOMContentLoaded", init);
