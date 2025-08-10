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
const MISSIONS_KEY = "defis_mariage_missions_v1"; // {1:{c1,c2},...,10:{c1,c2}}

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
  missions: loadMissions(),
  // toastTimer: null, // Buggy, removed for a better implementation
};

let guestFlowSection, stepWelcome, stepMissions, stepConfirmation, missionSelectionPanel, missionDisplayPanel, confirmationGalleryBtn, confirmationNewGuestBtn, currentInviteEl, assignedCountEl, assignedItemsEl, challengeListEl, mission1El, mission2El, missionConfirmBtn, missionResetBtn, missionsTbody, missionsSaveBtn, missionConsignesCard, missionConsignesList, accessBannerEl, invitePassInput, invitePassRow, inviteNamesDatalist, eventPassRow, eventPassInput, spinBtn, lockedNoteEl, progressBarEl, toastContainer, confettiCanvas, goAdminBtn, goGalleryBtn, adminSection, adminExitBtn, gallerySection, galleryExitBtn, lightboxEl, lightboxBackdrop, lightboxImg, lightboxCaption, lightboxDownload, lightboxClose, adminRefreshBtn, adminCopyBtn, adminExportBtn, adminExportZipBtn, adminLogoutBtn, adminSearchInput, adminTbody, adminResetAllBtn, adminChallengesTextarea, adminChallengesSaveBtn, adminGuestName, adminGuestPass, adminGuestAddBtn, adminGuestsTbody, accessModeSelect, adminTabPending, adminTabApproved, adminTabPublished, adminPhotosPendingTbody, adminPhotosApprovedTbody, adminPhotosPublishedTbody, eventRequiredSelect, eventPassAdminInput, eventPassSaveBtn, adminResetSettingsBtn, adminDeleteAllPhotosBtn, uploadSection, submitMissionsBtn, submissionMsgEl;
let slotInputs = [], slotPreviews = [], slotZones = [], slotClears = [], slotLiveBtns = [], slotGalleryBtns = [];

const $ = (sel) => document.querySelector(sel);

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

function loadMissions() {
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const converted = {};
      for (let i = 1; i <= 10; i++) {
        if (parsed[i] && typeof parsed[i] === 'object' && parsed[i].c1) {
          converted[i] = parsed[i].c1 + (parsed[i].c2 ? ' / ' + parsed[i].c2 : '');
        } else if (typeof parsed[i] === 'string') {
          converted[i] = parsed[i];
        } else {
          converted[i] = '';
        }
      }
      return converted;
    }
  } catch {}
  const def = {}; for (let i=1;i<=10;i++) def[i] = ''; return def;
}
function saveMissions() { localStorage.setItem(MISSIONS_KEY, JSON.stringify(state.missions)); }


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

function goToStep(stepId) {
    [stepWelcome, stepMissions, stepConfirmation].forEach(step => {
        if(step) step.classList.toggle('active', step.id === stepId);
    });
    if (adminSection) adminSection.classList.add('hidden');
    if (gallerySection) gallerySection.classList.add('hidden');
    if (guestFlowSection) guestFlowSection.classList.remove('hidden');
}

function renderAssigned(inviteName) {
  const assigned = getAssignedForInvite(inviteName);
  assignedCountEl.textContent = String(assigned.length);
  
  const completed = assigned.length >= 2;

  missionDisplayPanel.classList.toggle('hidden', !completed);
  missionSelectionPanel.classList.toggle('hidden', completed);

  if (completed) {
    const [c1 = "Mission 1", c2 = "Mission 2"] = assigned;
    const lbl0 = document.getElementById("slot0-label");
    const lbl1 = document.getElementById("slot1-label");
    if (lbl0) lbl0.textContent = c1 || "Défi 1";
    if (lbl1) lbl1.textContent = c2 || "Défi 2";

    if (missionConsignesList) {
        missionConsignesList.innerHTML = "";
        assigned.forEach((c) => {
            const li = document.createElement("li");
            li.textContent = c;
            missionConsignesList.appendChild(li);
        });
    }
  }
  
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
  if (state.accessMode === 'guests_only') {
    const key = resolveInviteKey(name);
    const guest = state.guests[key];
    if (!guest) { alert("Accès réservé aux invités. Nom introuvable."); return; }
    if (guest && guest.password) {
      const pin = (invitePassInput && invitePassInput.value) || '';
      if (pin !== guest.password) {
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
  
  goToStep('step-missions');
  setCurrentInvite(name.trim());
  showToast(`Bienvenue ${name.trim()} ! Choisis tes missions ✨`);
}

function resetToInviteInput() {
  state.currentInviteName = null;
  const inviteInput = document.getElementById("invite-name");
  if(inviteInput) inviteInput.value = "";
  
  goToStep('step-welcome');

  missionSelectionPanel.classList.remove('hidden');
  missionDisplayPanel.classList.add('hidden');
  if (mission1El) { mission1El.selectedIndex = 0; }
  if (mission2El) { mission2El.selectedIndex = 0; }
  
  clearSlot(0);
  clearSlot(1);
}

function onConfirmMissions() {
  const invite = state.currentInviteName; if (!invite) return;
  const num1 = parseInt(mission1El.value, 10);
  const num2 = parseInt(mission2El.value, 10);
  if (Number.isNaN(num1) || Number.isNaN(num2) || num1 === num2) { alert('Choisissez deux missions distinctes.'); return; }
  const m1 = state.missions[num1] || '';
  const m2 = state.missions[num2] || '';
  const sel = [
    `Mission ${num1}: ${m1}`,
    `Mission ${num2}: ${m2}`
  ];
  const already = new Set(getAssignedForInvite(invite));
  sel.forEach(c => { if (!already.has(c)) addAssignment(invite, c); });
  
  renderAssigned(invite);
  showToast('Missions enregistrées. Tu peux envoyer tes photos.');
  launchConfetti();
}

function onSubmitMissions() {
    const inviteKey = state.currentInviteName;
    if (!inviteKey) return;

    const [upload1, upload2] = getUploadsForInvite(inviteKey);
    if (!upload1 || !upload1.data || !upload2 || !upload2.data) {
        alert("Veuillez téléverser les deux photos avant d'envoyer.");
        return;
    }

    showToast("Merci pour ta participation !");
    goToStep('step-confirmation');
}

function renderMissionsTable() {
  if (!missionsTbody) return;
  missionsTbody.innerHTML = '';
  for (let i=1;i<=10;i++) {
    const tr = document.createElement('tr');
    const m = state.missions[i] || '';
    tr.innerHTML = `<td>${i}</td><td><input id="mission-c-${i}" class="input" value="${escapeHtml(m)}" placeholder="Saisir la consigne de la mission ${i}"/></td>`;
    missionsTbody.appendChild(tr);
  }
}

function hydrateMissionSelectors() {
  if (!mission1El || !mission2El) return;
  const options = Array.from({length:10}, (_,k) => k+1).map(n => `<option value="${n}">${n}</option>`).join('');
  mission1El.innerHTML = options;
  mission2El.innerHTML = options;
}





function updateMissionUIForInvite(inviteName, completed, assigned) {
  if (mission1El) mission1El.disabled = !!completed;
  if (mission2El) mission2El.disabled = !!completed;
  if (missionConfirmBtn) missionConfirmBtn.disabled = !!completed;
}

function resolveInviteKey(name) {
  return String(name).trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 àâäçéèêëîïôöùûü-]/gi, '');
}

function showToast(message) {
  if (!toastContainer) return;
  const div = document.createElement("div");
  div.className = "toast";
  div.textContent = message;
  toastContainer.appendChild(div);
  setTimeout(() => {
    div.remove();
  }, 2800);
}

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

function openAdmin() {
  try {
    const ok = sessionStorage.getItem(ADMIN_PIN_KEY) === 'ok';
    if (!ok) {
      const pin = prompt('Entrez le code PIN Admin');
      if (pin !== ADMIN_PIN_VALUE) { alert('Code incorrect'); return; }
      sessionStorage.setItem(ADMIN_PIN_KEY, 'ok');
    }
  } catch {}
  guestFlowSection.classList.add("hidden");
  adminSection.classList.remove("hidden");
  renderAdminTable();
  renderMissionsTable();
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
  goToStep(state.currentInviteName ? 'step-missions' : 'step-welcome');
}

function openGallery() {
  guestFlowSection.classList.add('hidden');
  adminSection.classList.add('hidden');
  gallerySection.classList.remove('hidden');
  renderGallery();
}

function closeGallery() {
  gallerySection.classList.add('hidden');
  goToStep(state.currentInviteName ? 'step-missions' : 'step-welcome');
}

function renderAdminTable() {
  try {
    renderAdminPhotos();
    renderRanking();
  } catch (_) {
  }
}

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
  const rows = [["Invité","Mission 1","Mission 2"]];
  for (const [name, arr] of Object.entries(state.assignments)) {
    const displayName = state.nameMap[name] || name;
    rows.push([displayName, arr[0]||"", arr[1]||""]);
  }
  const text = rows.map(r => r.join('\t')).join('\n');
  navigator.clipboard.writeText(text).then(() => showToast("Copié dans le presse-papiers"));
}

function exportCSV() {
  const rows = [["Invite","Mission1","Mission2","Photo1_statut","Photo2_statut"]];
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

async function exportZipGallery() {
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
  const encoder = new TextEncoder();
  const fileRecords = [];
  let offset = 0;
  const chunks = [];

  function crc32(bytes) {
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
    const lf = new DataView(new ArrayBuffer(30));
    let p = 0;
    lf.setUint32(p, 0x04034b50, true); p+=4;
    lf.setUint16(p, 20, true); p+=2;
    lf.setUint16(p, 0, true); p+=2;
    lf.setUint16(p, 0, true); p+=2;
    lf.setUint16(p, 0, true); p+=2;
    lf.setUint16(p, 0, true); p+=2;
    lf.setUint32(p, csum, true); p+=4;
    lf.setUint32(p, size, true); p+=4;
    lf.setUint32(p, size, true); p+=4;
    lf.setUint16(p, nameBytes.length, true); p+=2;
    lf.setUint16(p, 0, true); p+=2;
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
    cd.setUint32(p, 0x02014b50, true); p+=4;
    cd.setUint16(p, 20, true); p+=2;
    cd.setUint16(p, 20, true); p+=2;
    cd.setUint16(p, 0, true); p+=2;
    cd.setUint16(p, 0, true); p+=2;
    cd.setUint16(p, 0, true); p+=2;
    cd.setUint16(p, 0, true); p+=2;
    cd.setUint32(p, r.csum, true); p+=4;
    cd.setUint32(p, r.size, true); p+=4;
    cd.setUint32(p, r.size, true); p+=4;
    cd.setUint16(p, r.nameBytes.length, true); p+=2;
    cd.setUint16(p, 0, true); p+=2;
    cd.setUint16(p, 0, true); p+=2;
    cd.setUint16(p, 0, true); p+=2;
    cd.setUint16(p, 0, true); p+=2;
    cd.setUint32(p, 0, true); p+=4;
    cd.setUint32(p, r.offset, true); p+=4;
    chunks.push(new Uint8Array(cd.buffer));
    chunks.push(r.nameBytes);
  }
  const cdEnd = offset = cdStart + fileRecords.reduce((sum, r) => sum + 46 + r.nameBytes.length, 0);

  const eocd = new DataView(new ArrayBuffer(22));
  let q = 0;
  eocd.setUint32(q, 0x06054b50, true); q+=4;
  eocd.setUint16(q, 0, true); q+=2;
  eocd.setUint16(q, 0, true); q+=2;
  eocd.setUint16(q, fileRecords.length, true); q+=2;
  eocd.setUint16(q, fileRecords.length, true); q+=2;
  eocd.setUint32(q, cdEnd - cdStart, true); q+=4;
  eocd.setUint32(q, cdStart, true); q+=4;
  eocd.setUint16(q, 0, true); q+=2;
  chunks.push(new Uint8Array(eocd.buffer));

  return new Blob(chunks, { type: 'application/zip' });
}

function init() {
  guestFlowSection = $("#guest-flow-section");
  stepWelcome = $("#step-welcome");
  stepMissions = $("#step-missions");
  stepConfirmation = $("#step-confirmation");
  missionSelectionPanel = $("#mission-selection-panel");
  missionDisplayPanel = $("#mission-display-panel");
  confirmationGalleryBtn = $("#confirmation-gallery-btn");
  confirmationNewGuestBtn = $("#confirmation-new-guest-btn");
  currentInviteEl = $("#current-invite");
  assignedCountEl = $("#assigned-count");
  assignedItemsEl = $("#assigned-items");
  challengeListEl = $("#challenge-list");
  mission1El = document.getElementById('mission1');
  mission2El = document.getElementById('mission2');
  missionConfirmBtn = document.getElementById('mission-confirm-btn');
  missionResetBtn = document.getElementById('mission-reset-btn');
  missionsTbody = document.getElementById('missions-tbody');
  missionsSaveBtn = document.getElementById('missions-save');
  missionConsignesCard = document.getElementById('mission-consignes');
  missionConsignesList = document.getElementById('mission-consignes-list');
  accessBannerEl = document.getElementById('access-banner');
  invitePassInput = document.getElementById('invite-pass');
  invitePassRow = document.getElementById('invite-pass-row');
  inviteNamesDatalist = document.getElementById('invite-names');
  eventPassRow = document.getElementById('event-pass-row');
  eventPassInput = document.getElementById('event-pass');
  spinBtn = $("#spin-btn");
  lockedNoteEl = $("#locked-note");
  progressBarEl = $("#progress-bar");
  toastContainer = $("#toast-container");
  confettiCanvas = $("#confetti-canvas");
  goAdminBtn = $("#go-admin-btn");
  goGalleryBtn = $("#go-gallery-btn");
  adminSection = $("#admin-section");
  adminExitBtn = $("#admin-exit");
  gallerySection = document.getElementById('gallery-section');
  galleryExitBtn = document.getElementById('gallery-exit');
  lightboxEl = document.getElementById('lightbox');
  lightboxBackdrop = document.getElementById('lightbox-backdrop');
  lightboxImg = document.getElementById('lightbox-img');
  lightboxCaption = document.getElementById('lightbox-caption');
  lightboxDownload = document.getElementById('lightbox-download');
  lightboxClose = document.getElementById('lightbox-close');
  adminRefreshBtn = $("#admin-refresh");
  adminCopyBtn = $("#admin-copy");
  adminExportBtn = $("#admin-export");
  adminExportZipBtn = $("#admin-export-zip");
  adminLogoutBtn = $("#admin-logout");
  adminSearchInput = $("#admin-search");
  adminTbody = $("#admin-tbody");
  adminResetAllBtn = $("#admin-reset-all");
  
  adminGuestName = $("#admin-guest-name");
  adminGuestPass = $("#admin-guest-pass");
  adminGuestAddBtn = $("#admin-guest-add");
  adminGuestsTbody = $("#admin-guests-tbody");
  accessModeSelect = $("#access-mode");
  adminTabPending = $("#admin-tab-pending");
  adminTabApproved = $("#admin-tab-approved");
  adminTabPublished = $("#admin-tab-published");
  adminPhotosPendingTbody = $("#admin-photos-pending-tbody");
  adminPhotosApprovedTbody = $("#admin-photos-approved-tbody");
  adminPhotosPublishedTbody = $("#admin-photos-published-tbody");
  eventRequiredSelect = document.getElementById('event-required');
  eventPassAdminInput = document.getElementById('event-pass-admin');
  eventPassSaveBtn = document.getElementById('event-pass-save');
  adminResetSettingsBtn = document.getElementById('admin-reset-settings');
  adminDeleteAllPhotosBtn = document.getElementById('admin-delete-all-photos');
  uploadSection = $("#upload-section");
  slotInputs = [$("#slot0-input"), $("#slot1-input")];
  slotPreviews = [$("#slot0-preview"), $("#slot1-preview")];
  slotZones = [$("#slot0-zone"), $("#slot1-zone")];
  slotClears = [$("#slot0-clear"), $("#slot1-clear")];
  slotLiveBtns = [document.getElementById('slot0-live-btn'), document.getElementById('slot1-live-btn')];
  slotGalleryBtns = [document.getElementById('slot0-gallery-btn'), document.getElementById('slot1-gallery-btn')];
  submitMissionsBtn = document.getElementById('submit-missions-btn');
  submissionMsgEl = document.getElementById('submission-msg');

  const startBtn = document.getElementById("start-btn");
  const inviteInput = document.getElementById("invite-name");
  const nextInviteBtn = document.getElementById("next-invite-btn");
  if (startBtn) startBtn.addEventListener("click", () => startForInvite(inviteInput && inviteInput.value));
  if (inviteInput) inviteInput.addEventListener("keydown", (e) => { if (e.key === "Enter") startForInvite(inviteInput.value); });
  if (nextInviteBtn) nextInviteBtn.addEventListener("click", () => resetToInviteInput());
  if (missionConfirmBtn) missionConfirmBtn.addEventListener('click', onConfirmMissions);
  if (missionResetBtn) missionResetBtn.addEventListener('click', () => {
    if (mission1El) { mission1El.selectedIndex = 0; }
    if (mission2El) { mission2El.selectedIndex = 0; }
    if (missionConsignesCard) { missionConsignesCard.classList.add('hidden'); if (missionConsignesList) missionConsignesList.innerHTML = ''; }
    showToast('Missions réinitialisées');
  });

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
      alert("Veuillez renseigner au moins 3 missions.");
      return;
    }
    state.challenges = lines;
    saveChallenges();
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

  if (missionsSaveBtn) missionsSaveBtn.addEventListener('click', () => {
    for (let i=1;i<=10;i++) {
      const consigne = document.getElementById(`mission-c-${i}`)?.value || '';
      state.missions[i] = consigne;
    }
    saveMissions();
    hydrateMissionSelectors();
    showToast('Missions enregistrées');
  });

  

  if (accessModeSelect) {
    accessModeSelect.value = state.accessMode;
    accessModeSelect.addEventListener('change', () => {
      state.accessMode = accessModeSelect.value; saveAccessMode();
      showToast("Mode d'accès mis à jour");
    });
  }

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

  if (adminResetSettingsBtn) adminResetSettingsBtn.addEventListener('click', () => {
    if (!confirm('Réinitialiser les paramètres par défaut (défis, accès invités, mot de passe évènement) ?')) return;
    state.challenges = [...DEFAULT_CHALLENGES]; saveChallenges();
    state.accessMode = 'all'; saveAccessMode();
    state.eventAccess = { required: false, password: '' }; saveEventPass();
    if (adminChallengesTextarea) adminChallengesTextarea.value = state.challenges.join('\n');
    if (accessModeSelect) accessModeSelect.value = 'all';
    if (eventRequiredSelect) eventRequiredSelect.value = 'no';
    if (eventPassAdminInput) eventPassAdminInput.value = '';
    if (eventPassRow) eventPassRow.classList.add('hidden');
    showToast('Paramètres réinitialisés');
  });

  if (adminDeleteAllPhotosBtn) adminDeleteAllPhotosBtn.addEventListener('click', () => {
    if (!confirm('Supprimer TOUTES les photos ? Cette action est irréversible.')) return;
    uploads = {}; saveUploads();
    renderAdminPhotos();
    showToast('Toutes les photos ont été supprimées');
  });

  renderGallery();
  
  hydrateMissionSelectors();

  if (accessBannerEl) {
    accessBannerEl.classList.toggle('hidden', state.accessMode !== 'guests_only');
  }

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

  const passHelpBtn = document.getElementById('invite-pass-help');
  if (passHelpBtn) passHelpBtn.addEventListener('click', ()=> alert('Indice mot de passe: ta date de naissance au format JJ/MM/AAAA (ex: 01/01/1990).'));
  const passToggleBtn = document.getElementById('invite-pass-toggle');
  if (passToggleBtn && invitePassInput) passToggleBtn.addEventListener('click', ()=> {
    const isText = invitePassInput.type === 'text';
    invitePassInput.type = isText ? 'password' : 'text';
    passToggleBtn.setAttribute('aria-pressed', String(!isText));
  });

  if (eventPassRow) eventPassRow.classList.toggle('hidden', !(state.eventAccess && state.eventAccess.required));
  const eventHelpBtn = document.getElementById('event-pass-help');
  if (eventHelpBtn) eventHelpBtn.addEventListener('click', ()=> alert("Demandez le mot de passe de l'évènement aux organisateurs."));
  const eventToggleBtn = document.getElementById('event-pass-toggle');
  if (eventToggleBtn && eventPassInput) eventToggleBtn.addEventListener('click', ()=> {
    const isText = eventPassInput.type === 'text';
    eventPassInput.type = isText ? 'password' : 'text';
    eventToggleBtn.setAttribute('aria-pressed', String(!isText));
  });

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

  slotInputs.forEach((input, i) => {
    if (!input) return;
    input.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleImageSelected(i, file);
    });
  });

  slotLiveBtns.forEach((btn, i) => {
      if (!btn) return;
      btn.addEventListener('click', () => openLiveCapture(i));
  });

  slotGalleryBtns.forEach((btn, i) => {
      if (!btn) return;
      btn.addEventListener('click', () => slotInputs[i].click());
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

  if (submitMissionsBtn) submitMissionsBtn.addEventListener('click', onSubmitMissions);

  if (confirmationGalleryBtn) confirmationGalleryBtn.addEventListener('click', openGallery);
  if (confirmationNewGuestBtn) confirmationNewGuestBtn.addEventListener('click', resetToInviteInput);

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
    tr.innerHTML = `<td>${escapeHtml(g.display||key)}</td>\n      <td>${g.password ? '••••' : '—'}</td>\n      <td>${status}</td>\n      <td>\n        <button class="btn" data-g="${key}" data-act="edit">Éditer</button>\n        <button class="btn danger" data-g="${key}" data-act="del">Supprimer</button>\n      </td>`;
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
      tr.innerHTML = `<td>${img}</td><td>${escapeHtml(display)} <span class="status-badge status-pending">En attente</span></td><td>${escapeHtml(up.challengeLabel||'')}</td><td>${fmt(up.createdAt)}</td><td><button class="btn" data-act="approve" data-g="${inviteKey}" data-slot="${slot}">Valider</button> <button class="btn danger" data-act="delete" data-g="${inviteKey}" data-slot="${slot}">Supprimer</button></td>`;
      adminPhotosPendingTbody.appendChild(tr);
    } else if (up.approved && !up.published) {
      tr.innerHTML = `<td>${img}</td><td>${escapeHtml(display)} <span class="status-badge status-approved">Validée</span></td><td>${escapeHtml(up.challengeLabel||'')}</td><td>${fmt(up.approvedAt)}</td><td><button class="btn" data-act="publish" data-g="${inviteKey}" data-slot="${slot}">Publier</button> <button class="btn danger" data-act="delete" data-g="${inviteKey}" data-slot="${slot}">Supprimer</button></td>`;
      adminPhotosApprovedTbody.appendChild(tr);
    } else if (up.published) {
      tr.innerHTML = `<td>${img}</td><td>${escapeHtml(display)} <span class="status-badge status-published">Publiée</span></td><td>${escapeHtml(up.challengeLabel||'')}</td><td>${fmt(up.publishedAt)}</td><td>${likes} ❤️</td><td><button class="btn danger" data-act="delete" data-g="${inviteKey}" data-slot="${slot}">Supprimer</button></td>`;
      adminPhotosPublishedTbody.appendChild(tr);
    }
  }
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
  [adminPhotosPendingTbody, adminPhotosApprovedTbody, adminPhotosPublishedTbody].forEach(tbody => {
    tbody.querySelectorAll('button[data-act="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const g = btn.getAttribute('data-g'); const s = Number(btn.getAttribute('data-slot'));
        if (!confirm('Supprimer cette photo ?')) return;
        const arr = uploads[g] || [null,null];
        arr[s] = null; uploads[g] = arr; saveUploads();
        renderAdminPhotos();
        showToast('Photo supprimée');
      });
    });
  });
}

const UPLOADS_KEY = "defis_mariage_uploads_v2";

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
  const challengeLabel = (getAssignedForInvite(inviteKey)[slot]) || (slot === 0 ? 'Mission 1' : 'Mission 2');
  current[slot] = { data: dataUrl, approved: false, published: false, challengeLabel, createdAt: Date.now(), approvedAt: null, publishedAt: null };
  uploads[inviteKey] = current;
  saveUploads();
}
function clearAllUploads() { uploads = {}; saveUploads(); }

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
  if (submitMissionsBtn) {
      submitMissionsBtn.disabled = !(a && a.data && b && b.data);
  }
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
  const byChallenge = new Map();
  for (const [inviteKey, arr] of Object.entries(uploads)) {
    const display = state.nameMap[inviteKey] || inviteKey;
    (arr || []).forEach((up) => {
      if (up && up.data && up.published) {
        const label = up.challengeLabel || 'Mission';
        if (!byChallenge.has(label)) byChallenge.set(label, []);
        byChallenge.get(label).push({ img: up.data, label, invite: display, inviteKey });
      }
    });
  }
  const labels = Array.from(byChallenge.keys()).sort();
  labels.forEach((label, idx) => {
    const col = document.createElement('div');
    col.className = 'gallery-column';
    col.innerHTML = `<h4>Mission ${idx+1} – ${escapeHtml(label)}</h4>`;
    const grid = document.createElement('div');
    grid.className = 'gallery-grid';
    byChallenge.get(label).forEach(({ img, invite, inviteKey }) => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      const likes = getLikesFor(inviteKey, img);
      let timeInfo = '';
      const [u0,u1] = getUploadsForInvite(inviteKey);
      const uploadsTimes = [u0&&u0.createdAt, u1&&u1.createdAt].filter(Boolean);
      const approvedTimes = [u0&&u0.approvedAt, u1&&u1.approvedAt].filter(Boolean);
      if (uploadsTimes.length === 2 && approvedTimes.length === 2) {
        const start = Math.min(...uploadsTimes);
        const end = Math.max(...approvedTimes);
        const ms = Math.max(0, end - start);
        const mins = Math.floor(ms/60000); const secs = Math.floor((ms%60000)/1000);
        timeInfo = `Bravo ! Défi réalisé en ${mins}m${secs.toString().padStart(2,'0')}s 🎯`;
      }
      div.innerHTML = `<img src="${img}" alt="${escapeHtml(label)}"/>\n        <div class="badge">${escapeHtml(invite)}</div>\n        <button class="like" type="button" aria-label="J'aime"><span>❤️</span><span class="like-count">${likes}</span></button>\n        <div style="position:absolute;bottom:6px;left:6px;right:6px;background:rgba(0,0,0,0.55);color:white;font-size:12px;padding:4px 6px;border-radius:8px;">${escapeHtml(label)}${timeInfo? ' – '+timeInfo: ''}</div>`;
      div.addEventListener('click', (e) => {
        if (e.target.closest('.like')) return;
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

const LIKES_KEY = 'defis_mariage_likes_v1';
function loadLikes() {
  try { const raw = localStorage.getItem(LIKES_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
let likesDb = loadLikes();
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
  const labels = new Set();
  for (const [key, arr] of Object.entries(uploads)) {
    (arr||[]).forEach(up => { if (up && up.challengeLabel) labels.add(up.challengeLabel); });
  }
  const opts = Array.from(labels).sort();
  opts.forEach(l => {
    const o = document.createElement('option');
    o.value = l; o.textContent = l; select.appendChild(o);
  });
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
  const filtered = arr.filter(up => up && up.challengeLabel === label && up.createdAt && up.approvedAt);
  if (filtered.length === 0) return null;
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

async function openLiveCapture(slot) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("L'API de la caméra n'est pas disponible sur ce navigateur ou dans ce contexte. Veuillez utiliser un navigateur moderne et servir l'application via HTTPS ou localhost.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed'; overlay.style.inset = '0'; overlay.style.zIndex = '70'; overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.innerHTML = `\n      <div style="position:absolute;inset:0;display:grid;place-items:center;">\n        <div style="background:#000;padding:8px;border-radius:12px;display:grid;gap:8px;max-width:92vw;">\n          <video id="live-video" autoplay playsinline style="width:min(92vw,640px);height:auto;border-radius:8px;"></video>\n          <div style="display:flex;gap:8px;justify-content:flex-end;">\n            <button id="live-cancel" class="btn">Annuler</button>\n            <button id="live-shoot" class="btn primary">Prendre la photo</button>\n          </div>\n        </div>\n      </div>`;
    document.body.appendChild(overlay);
    const video = overlay.querySelector('#live-video'); video.srcObject = stream;
    const cleanup = () => { stream.getTracks().forEach(t=>t.stop()); overlay.remove(); };
    overlay.querySelector('#live-cancel').addEventListener('click', cleanup);
    overlay.querySelector('#live-shoot').addEventListener('click', async () => {
      const track = stream.getVideoTracks()[0];
      const imageCapture = 'ImageCapture' in window ? new ImageCapture(track) : null;
      try {
        let blob;
        if (imageCapture && imageCapture.takePhoto) {
          blob = await imageCapture.takePhoto();
        } else {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth; canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d'); ctx.drawImage(video, 0, 0);
          blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.92));
        }
        const file = new File([blob], 'live.jpg', { type: 'image/jpeg' });
        const dataUrl = await compressImageToDataUrl(file, 1600, 0.8);
        const key = state.currentInviteName; if (!key) { cleanup(); return; }
        setUploadForInvite(key, slot, dataUrl);
        loadUploadsForInvite(key);
        showToast(`Photo ${slot+1} capturée`);
      } catch (e) {
        alert("Capture impossible");
      } finally {
        cleanup();
      }
    });
  } catch (err) {
      console.error("Erreur caméra:", err);
      alert("Impossible d'ouvrir la caméra. Avez-vous bien donné l'autorisation ? Assurez-vous d'utiliser l'application via HTTPS ou localhost.");
  }
}

  renderGallery();
  renderMissionsTable();
  hydrateMissionSelectors();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  queueMicrotask(init);
}