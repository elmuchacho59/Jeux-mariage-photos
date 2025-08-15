const { createClient } = supabase;

const supabaseUrl = 'https://uiraepbmqeuqkaxpupct.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcmFlcGJtcWV1cWtheHB1cGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjI4MDAsImV4cCI6MjA3MDgzODgwMH0.RtbVxvVfT0OFq209lPMvHR7k4_h2weAfnig7ahrFFpw';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

let supabaseClient;

const i18n = {
  fr: {
    unassigned: "Non assigné",
    mission: "Mission",
    challenge: "Défi",
    welcome: "Bienvenue",
    chooseMissions: "Choisis tes missions ✨",
    missionsSaved: "Missions enregistrées. Tu peux envoyer tes photos.",
    selectTwoMissions: "Choisissez deux missions distinctes.",
    submitConfirmation: "Merci pour ta participation !",
    uploadBothPhotos: "Veuillez téléverser les deux photos avant d'envoyer.",
    photoSaved: "Photo enregistrée",
    imageProcessingError: "Impossible de traiter l'image.",
    adminPinIncorrect: "Code incorrect",
    adminDisconnected: "Déconnecté de l'espace Admin.",
    dataCleared: "Données réinitialisées",
    frameSaved: "Cadre enregistré !",
    frameDeleted: "Cadre supprimé.",
    selectFile: "Veuillez sélectionner un fichier.",
    challengesUpdated: "Défis mis à jour",
    atLeast3Missions: "Veuillez renseigner au moins 3 missions.",
    guestNameRequired: "Nom requis",
    missionsSavedSuccess: "Missions enregistrées",
    accessModeUpdated: "Mode d'accès mis à jour",
    eventPasswordUpdated: "Mot de passe évènement mis à jour",
    eventPasswordRequired: "Veuillez saisir un mot de passe évènement.",
    settingsReset: "Paramètres réinitialisés",
    allPhotosDeleted: "Toutes les photos ont été supprimées",
    missionsReset: "Missions réinitialisées",
    passwordIncorrect: "Mot de passe incorrect",
    guestAccessOnly: "Accès réservé aux invités. Nom introuvable.",
    enterGuestName: "Veuillez saisir le nom de l'invité.",
    passwordHint: "Indice mot de passe: ta date de naissance au format JJ/MM/AAAA (ex: 01/01/1990).",
    eventPasswordHint: "Demandez le mot de passe de l'évènement aux organisateurs.",
    cameraApiUnavailable: "L'API de la caméra n'est pas disponible sur ce navigateur.",
    cameraError: "Impossible d'ouvrir la caméra. Avez-vous donné l'autorisation?",
    captureImpossible: "Capture impossible",
    copiedToClipboard: "Copié dans le presse-papiers",
    noPublishedPhotos: "Aucune photo publiée.",
    deleteGuestConfirmation: "Supprimer cet invité ?",
    editGuestNamePrompt: "Nom de l'invité",
    editGuestPasswordPrompt: "Mot de passe (laisser vide pour aucun)",
    deleteAllDataConfirmation: "Tout effacer (assignations, noms, photos) sur cet appareil ?",
    resetSettingsConfirmation: "Réinitialiser les paramètres par défaut (défis, accès invités, mot de passe évènement) ?",
    deleteAllPhotosConfirmation: "Supprimer TOUTES les photos ? Cette action est irréversible.",
    deletePhotoConfirmation: "Supprimer cette photo ?",
    enterMissionInstruction: "Saisir la consigne de la mission",
    missions: "Missions",
    mission1: "Mission 1",
    mission2: "Mission 2",
    challenge1: "Défi 1",
    challenge2: "Défi 2",
    pendingStatus: "En attente",
    publishedStatus: "Publiée",
    validateAndPublish: "Valider et Publier",
    delete: "Supprimer",
    edit: "Éditer",
    validatedStatus: "✅ 2/2 validés",
    inProgressStatus: "⏳ en cours",
    likeLabel: "J'aime",
    cancel: "Annuler",
    takePhoto: "Prendre la photo",
    cameraErrorPrompt: "Erreur caméra:",
    galleryEmpty: "L'album est encore vide !",
    galleryEmptySubtitle: "Chères invitées, à vos appareils photo ! La galerie attend vos chefs-d'œuvre. 📸",
    missionHeader: "Mission",
    challengeCompleted: "Bravo ! Défi réalisé en",
  },
  es: {
    unassigned: "Sin asignar",
    mission: "Misión",
    challenge: "Reto",
    welcome: "¡Bienvenido(a)!",
    chooseMissions: "Elige tus misiones ✨",
    missionsSaved: "Misiones guardadas. Ya puedes subir tus fotos.",
    selectTwoMissions: "Elige dos misiones distintas.",
    submitConfirmation: "¡Gracias por participar!",
    uploadBothPhotos: "Por favor, sube las dos fotos antes de enviar.",
    photoSaved: "Foto guardada",
    imageProcessingError: "No se pudo procesar la imagen.",
    adminPinIncorrect: "Código incorrecto",
    adminDisconnected: "Desconectado del área de Admin.",
    dataCleared: "Datos restablecidos",
    frameSaved: "¡Marco guardado!",
    frameDeleted: "Marco eliminado.",
    selectFile: "Por favor, selecciona un archivo.",
    challengesUpdated: "Retos actualizados",
    atLeast3Missions: "Por favor, introduce al menos 3 misiones.",
    guestNameRequired: "Nombre requerido",
    missionsSavedSuccess: "Misiones guardadas",
    accessModeUpdated: "Modo de acceso actualizado",
    eventPasswordUpdated: "Contraseña del evento actualizada",
    eventPasswordRequired: "Por favor, introduce la contraseña del evento.",
    settingsReset: "Configuración restablecida",
    allPhotosDeleted: "Todas las fotos han sido eliminadas",
    missionsReset: "Misiones reiniciadas",
    passwordIncorrect: "Contraseña incorrecta",
    guestAccessOnly: "Acceso solo para invitados. Nombre no encontrado.",
    enterGuestName: "Por favor, introduce el nombre del invitado.",
    passwordHint: "Pista de la contraseña: tu fecha de nacimiento en formato DD/MM/AAAA (ej: 01/01/1990).",
    eventPasswordHint: "Pide la contraseña del evento a los organizadores.",
    cameraApiUnavailable: "La API de la cámara no está disponible en este navegador.",
    cameraError: "No se puede abrir la cámara. ¿Has dado permiso?",
    captureImpossible: "Captura imposible",
    copiedToClipboard: "Copiado al portapapeles",
    noPublishedPhotos: "No hay fotos publicadas.",
    deleteGuestConfirmation: "¿Eliminar a este invitado?",
    editGuestNamePrompt: "Nombre del invitado",
    editGuestPasswordPrompt: "Contraseña (dejar en blanco para ninguna)",
    deleteAllDataConfirmation: "¿Borrar todos los datos (asignaciones, nombres, fotos) de este dispositivo?",
    resetSettingsConfirmation: "¿Restablecer la configuración predeterminada (retos, acceso de invitados, contraseña del evento)?",
    deleteAllPhotosConfirmation: "¿Eliminar TODAS las fotos? Esta acción es irreversible.",
    deletePhotoConfirmation: "¿Eliminar esta foto?",
    enterMissionInstruction: "Introduce la consigna de la misión",
    missions: "Misiones",
    mission1: "Misión 1",
    mission2: "Misión 2",
    challenge1: "Reto 1",
    challenge2: "Reto 2",
    pendingStatus: "Pendiente",
    publishedStatus: "Publicada",
    validateAndPublish: "Validar y Publicar",
    delete: "Eliminar",
    edit: "Editar",
    validatedStatus: "✅ 2/2 validados",
    inProgressStatus: "⏳ en curso",
    likeLabel: "Me gusta",
    cancel: "Cancelar",
    takePhoto: "Tomar la foto",
    cameraErrorPrompt: "Error de cámara:",
    galleryEmpty: "¡El álbum todavía está vacío!",
    galleryEmptySubtitle: "¡Queridos invitados, a sus cámaras! La galería espera sus obras maestras. 📸",
    missionHeader: "Misión",
    challengeCompleted: "¡Bravo! Reto completado en",
  }
};

const lang = document.documentElement.lang === 'es' ? 'es' : 'fr';
const t = (key) => i18n[lang][key] || i18n.fr[key];

/*
  Défi Photo – Mariage
  Application statique qui assigne 2 défis photo distincts par invité via une roue de la fortune.
  - Données stockées localement dans localStorage
  - Fonctionne hors ligne
*/

const DEFAULT_CHALLENGES_FR = [
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

const DEFAULT_CHALLENGES_ES = [
    "Un selfie con los novios",
    "Una foto de una carcajada",
    "El baile más bonito",
    "Un beso robado",
    "Un brindis",
    "Los zapatos más estilosos",
    "Un abrazo grupal",
    "Un detalle de la decoración",
    "La sonrisa más bonita",
    "Un momento inesperado",
    "Una foto en blanco y negro",
    "Un plano general del salón",
    "Una foto con un desconocido",
    "Los anillos en primer plano",
    "Las manos de los invitados",
    "Una mirada cómplice",
    "Un niño divirtiéndose",
    "Un plato que da hambre",
    "Una broma inmortalizada",
    "El ramo desde otro ángulo"
];

const DEFAULT_CHALLENGES = lang === 'es' ? DEFAULT_CHALLENGES_ES : DEFAULT_CHALLENGES_FR;

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
const FRAME_KEY = "defis_mariage_frame_v1";

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
  missions: {}, // Will be loaded in init()
  frame: localStorage.getItem(FRAME_KEY) || null,
};

let guestFlowSection, stepWelcome, stepMissions, stepConfirmation, missionSelectionPanel, missionDisplayPanel, confirmationGalleryBtn, confirmationNewGuestBtn, currentInviteEl, assignedCountEl, assignedItemsEl, challengeListEl, mission1El, mission2El, missionConfirmBtn, missionResetBtn, missionsTbody, missionsSaveBtn, missionConsignesCard, missionConsignesList, accessBannerEl, invitePassInput, invitePassRow, inviteNamesDatalist, eventPassRow, eventPassInput, spinBtn, lockedNoteEl, progressBarEl, toastContainer, confettiCanvas, goAdminBtn, goGalleryBtn, adminSection, adminExitBtn, gallerySection, galleryExitBtn, lightboxEl, lightboxBackdrop, lightboxImg, lightboxCaption, lightboxDownload, lightboxClose, adminRefreshBtn, adminCopyBtn, adminExportBtn, adminExportZipBtn, adminLogoutBtn, adminSearchInput, adminTbody, adminResetAllBtn, adminChallengesTextarea, adminChallengesSaveBtn, adminGuestName, adminGuestPass, adminGuestAddBtn, adminGuestsTbody, accessModeSelect, adminTabPending, adminTabPublished, adminPhotosPendingTbody, adminPhotosPublishedTbody, eventRequiredSelect, eventPassAdminInput, eventPassSaveBtn, adminResetSettingsBtn, adminDeleteAllPhotosBtn, uploadSection, submitMissionsBtn, submissionMsgEl, loadingOverlayEl;
let slotInputs = [], slotPreviews = [], slotZones = [], slotClears = [], slotLiveBtns = [], slotGalleryBtns = [];

const $ = (sel) => document.querySelector(sel);

function showLoading() { if (loadingOverlayEl) loadingOverlayEl.classList.remove('hidden'); }
function hideLoading() { if (loadingOverlayEl) loadingOverlayEl.classList.add('hidden'); }

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

async function loadMissions() {
  const { data, error } = await supabaseClient
    .from('missions')
    .select('mission_number, fr, es')
    .order('mission_number');

  if (error) {
    console.error('Error loading missions:', error);
    // Fallback to local storage or default if Supabase fails
    try {
      const raw = localStorage.getItem(MISSIONS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // Ignore parsing error
    }
  }

  if (data) {
    const missions = {};
    for (const mission of data) {
      missions[mission.mission_number] = { fr: mission.fr, es: mission.es };
    }
    return missions;
  }

  const def = {};
  for (let i = 1; i <= 10; i++) {
    def[i] = { fr: '', es: '' };
  }
  return def;
}

async function saveMissions() {
  const missionsToSave = [];
  for (let i = 1; i <= 10; i++) {
    const fr = document.getElementById(`mission-c-${i}-fr`)?.value || '';
    const es = document.getElementById(`mission-c-${i}-es`)?.value || '';
    missionsToSave.push({ mission_number: i, fr, es });
  }

  const { error } = await supabaseClient
    .from('missions')
    .upsert(missionsToSave, { onConflict: 'mission_number' });

  if (error) {
    console.error('Error saving missions:', error);
    showToast('Erreur lors de la sauvegarde des missions', 'danger');
  } else {
    showToast(t('missionsSavedSuccess'));
  }
}


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
    const [c1 = t("mission1"), c2 = t("mission2")] = assigned;
    const lbl0 = document.getElementById("slot0-label");
    const lbl1 = document.getElementById("slot1-label");
    if (lbl0) lbl0.textContent = c1 || t("challenge1");
    if (lbl1) lbl1.textContent = c2 || t("challenge2");

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

async function startForInvite(name) {
  if (!name || !name.trim()) {
    showToast(t("enterGuestName"), "danger");
    return;
  }
  if (state.accessMode === 'guests_only') {
    const key = resolveInviteKey(name);
    const guest = state.guests[key];
    if (!guest) { 
      showToast(t("guestAccessOnly"), "danger");
      return; 
    }
    if (guest && guest.password) {
      const pin = (invitePassInput && invitePassInput.value) || '';
      if (pin !== guest.password) {
        showToast(t("passwordIncorrect"), "danger");
        if (invitePassInput) {
          invitePassInput.focus();
          invitePassInput.classList.add('is-invalid');
          setTimeout(()=> invitePassInput.classList.remove('is-invalid'), 1500);
        }
        return;
      }
    }
  }
  if (state.eventAccess && state.eventAccess.required) {
    const pin = (eventPassInput && eventPassInput.value) || '';
    if (pin !== state.eventAccess.password) {
      showToast(t("passwordIncorrect"), "danger");
      if (eventPassInput) {
        eventPassInput.focus();
        eventPassInput.classList.add('is-invalid');
        setTimeout(()=> eventPassInput.classList.remove('is-invalid'), 1500);
      }
      return;
    }
  }
  
  goToStep('step-missions');
  setCurrentInvite(name.trim());
  await loadUploadsForInvite(resolveInviteKey(name.trim())); // Load uploads for the new guest
  showToast(`${t('welcome')} ${name.trim()} ! ${t('chooseMissions')}`);
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
  if (Number.isNaN(num1) || Number.isNaN(num2) || num1 === num2) { 
    showToast(t('selectTwoMissions'), 'danger'); 
    return; 
  }
  const m1 = state.missions[num1] ? state.missions[num1][lang] : '';
  const m2 = state.missions[num2] ? state.missions[num2][lang] : '';
  const sel = [
    `${t('mission')} ${num1}: ${m1}`,
    `${t('mission')} ${num2}: ${m2}`
  ];
  const already = new Set(getAssignedForInvite(invite));
  sel.forEach(c => { if (!already.has(c)) addAssignment(invite, c); });
  
  renderAssigned(invite);
  showToast(t('missionsSaved'));
  launchConfetti();
}

async function onSubmitMissions() {
    const inviteKey = state.currentInviteName;
    if (!inviteKey) return;

    const [upload1, upload2] = getUploadsForInvite(inviteKey);
    if (!upload1 || !upload1.data || !upload2 || !upload2.data) {
        showToast(t("uploadBothPhotos"), "danger");
        return;
    }

    // Photos are already uploaded, just confirm
    showToast(t("submitConfirmation"));
    goToStep('step-confirmation');
}

function renderMissionsTable() {
  if (!missionsTbody) return;
  missionsTbody.innerHTML = '';
  for (let i=1;i<=10;i++) {
    const tr = document.createElement('tr');
    const m = state.missions[i] || { fr: '', es: '' };
    tr.innerHTML = `<td>${i}</td>
      <td><input id="mission-c-${i}-fr" class="input" value="${escapeHtml(m.fr)}" placeholder="${t('enterMissionInstruction')} ${i} (FR)"/></td>
      <td><input id="mission-c-${i}-es" class="input" value="${escapeHtml(m.es)}" placeholder="${t('enterMissionInstruction')} ${i} (ES)"/></td>`;
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

function showToast(message, type = 'success') {
  if (!toastContainer) return;
  const div = document.createElement("div");
  div.className = `toast ${type}`;
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
      const pin = prompt(t('enterAdminPin'));
      if (pin !== ADMIN_PIN_VALUE) { 
        showToast(t('adminPinIncorrect'), 'danger'); 
        return; 
      }
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
  renderAdminStats();
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
  navigator.clipboard.writeText(text).then(() => showToast(t("copiedToClipboard")));
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
  if (files.length === 0) { showToast(t('noPublishedPhotos'), 'danger'); return; }

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

function updateLangButtons() {
    const langFrBtn = document.getElementById('lang-fr');
    const langEsBtn = document.getElementById('lang-es');
    if (!langFrBtn || !langEsBtn) return;
  
    const currentLang = document.documentElement.lang || 'fr';
    langFrBtn.classList.toggle('active', currentLang === 'fr');
    langEsBtn.classList.toggle('active', currentLang === 'es');
  }

async function init() {
  try {
    if (typeof supabase === 'undefined' || !supabase) {
      throw new Error("Le client Supabase n'est pas disponible. L'application ne peut pas démarrer.");
    }

    const { createClient } = supabase;
    const supabaseUrl = 'https://uiraepbmqeuqkaxpupct.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcmFlcGJtcWV1cWtheHB1cGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjI4MDAsImV4cCI6MjA3MDgzODgwMH0.RtbVxvVfT0OFq209lPMvHR7k4_h2weAfnig7ahrFFpw';
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    state.missions = await loadMissions(); // Load missions first
  
    const langFrBtn = document.getElementById('lang-fr');
    const langEsBtn = document.getElementById('lang-es');

    if (langFrBtn) {
      langFrBtn.addEventListener('click', () => {
        const path = window.location.pathname.replace(/index(\.es)?\.html$/, '');
        window.location.href = path + 'index.html';
      });
    }

    if (langEsBtn) {
      langEsBtn.addEventListener('click', () => {
        const path = window.location.pathname.replace(/index(\.es)?\.html$/, '');
        window.location.href = path + 'index.es.html';
      });
    }
    updateLangButtons();
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
    adminTabPublished = $("#admin-tab-published");
    adminPhotosPendingTbody = $("#admin-photos-pending-tbody");
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
    loadingOverlayEl = document.getElementById('loading-overlay');

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
      showToast(t('missionsReset'));
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
      showToast(t('adminDisconnected'));
      closeAdmin();
    });
    if (adminSearchInput) adminSearchInput.addEventListener("input", renderAdminTable);
    if (adminResetAllBtn) adminResetAllBtn.addEventListener("click", () => {
      if (confirm(t("deleteAllDataConfirmation"))) {
        clearAllAssignments();
        clearAllUploads();
        renderAdminTable();
        showToast(t("dataCleared"));
      }
    });

    let frameUploadInput, frameSaveBtn, frameDeleteBtn, framePreviewImg;
    
    frameUploadInput = document.getElementById('frame-upload-input');
    frameSaveBtn = document.getElementById('frame-save-btn');
    frameDeleteBtn = document.getElementById('frame-delete-btn');
    framePreviewImg = document.getElementById('frame-preview-img');

    if (frameUploadInput && frameSaveBtn && frameDeleteBtn && framePreviewImg) {
      frameSaveBtn.addEventListener('click', () => {
        const file = frameUploadInput.files[0];
        if (!file) {
          showToast(t("selectFile"), "danger");
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          state.frame = e.target.result;
          localStorage.setItem(FRAME_KEY, state.frame);
          framePreviewImg.src = state.frame;
          showToast(t("frameSaved"));
        };
        reader.readAsDataURL(file);
      });

      frameDeleteBtn.addEventListener('click', () => {
        state.frame = null;
        localStorage.removeItem(FRAME_KEY);
        framePreviewImg.src = '';
        showToast(t("frameDeleted"));
      });

      if (state.frame) {
        framePreviewImg.src = state.frame;
      }
    }

    if (missionsSaveBtn) missionsSaveBtn.addEventListener('click', saveMissions);

    if (accessModeSelect) {
      accessModeSelect.value = state.accessMode;
      accessModeSelect.addEventListener('change', () => {
        state.accessMode = accessModeSelect.value; saveAccessMode();
        showToast(t("accessModeUpdated"));
      });
    }

    if (eventRequiredSelect && eventPassAdminInput && eventPassSaveBtn) {
      eventRequiredSelect.value = state.eventAccess.required ? 'yes' : 'no';
      eventPassAdminInput.value = state.eventAccess.password || '';
      eventPassSaveBtn.addEventListener('click', () => {
        const required = (eventRequiredSelect.value === 'yes');
        const pwd = (eventPassAdminInput.value || '').trim();
        if (required && !pwd) { 
          showToast(t('eventPasswordRequired'), 'danger'); 
          return; 
        }
        state.eventAccess.required = required;
        state.eventAccess.password = pwd;
        saveEventPass();
        if (eventPassRow) eventPassRow.classList.toggle('hidden', !required);
        if (!required && eventPassInput) {
          eventPassInput.value = '';
          eventPassInput.classList.remove('is-valid','is-invalid');
        }
        showToast(t('eventPasswordUpdated'));
      });
    }

    const adminPhotoSort = document.getElementById('admin-photo-sort');
    if (adminPhotoSort) adminPhotoSort.addEventListener('change', renderAdminPhotos);

    if (adminResetSettingsBtn) adminResetSettingsBtn.addEventListener('click', () => {
      if (!confirm(t('resetSettingsConfirmation'))) return;
      state.challenges = [...DEFAULT_CHALLENGES]; saveChallenges();
      state.accessMode = 'all'; saveAccessMode();
      state.eventAccess = { required: false, password: '' }; saveEventPass();
      if (adminChallengesTextarea) adminChallengesTextarea.value = state.challenges.join('\n');
      if (accessModeSelect) accessModeSelect.value = 'all';
      if (eventRequiredSelect) eventRequiredSelect.value = 'no';
      if (eventPassAdminInput) eventPassAdminInput.value = '';
      if (eventPassRow) eventPassRow.classList.add('hidden');
      showToast(t('settingsReset'));
    });

    if (adminDeleteAllPhotosBtn) adminDeleteAllPhotosBtn.addEventListener('click', () => {
      if (!confirm(t('deleteAllPhotosConfirmation'))) return;
      uploads = {}; saveUploads();
      renderAdminPhotos();
      showToast(t('allPhotosDeleted'));
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
    if (passHelpBtn) passHelpBtn.addEventListener('click', ()=> showToast(t('passwordHint')));
    const passToggleBtn = document.getElementById('invite-pass-toggle');
    if (passToggleBtn && invitePassInput) passToggleBtn.addEventListener('click', ()=> {
      const isText = invitePassInput.type === 'text';
      invitePassInput.type = isText ? 'password' : 'text';
      passToggleBtn.setAttribute('aria-pressed', String(!isText));
    });

    if (eventPassRow) eventPassRow.classList.toggle('hidden', !(state.eventAccess && state.eventAccess.required));
    const eventHelpBtn = document.getElementById('event-pass-help');
    if (eventHelpBtn) eventHelpBtn.addEventListener('click', ()=> showToast(t('eventPasswordHint')));
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
      const frameToggle = document.getElementById(`frame-toggle-input-${i}`);
      if (frameToggle) {
        frameToggle.addEventListener('change', () => updatePreview(i));
      }
    });

    slotLiveBtns.forEach((btn, i) => {
        if (!btn) return;
        btn.addEventListener('click', () => slotInputs[i].click());
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
    
  } catch (error) {
    console.error("Failed to initialize the application:", error);
    const appElement = document.querySelector('.app');
    if (appElement) {
        appElement.innerHTML = `<div class="card" style="text-align:center; padding: 2rem;"><h2>Oops! Une erreur est survenue.</h2><p>L'application n'a pas pu démarrer. Veuillez réessayer plus tard.</p><p><small>Détail de l'erreur : ${error.message}</small></p></div>`;
    }
  }
}


function renderGuests() {
  if (!adminGuestsTbody) return;
  adminGuestsTbody.innerHTML = '';
  const entries = Object.entries(state.guests).sort(([a],[b]) => a.localeCompare(b));
  entries.forEach(([key, g]) => {
    const status = computeDurationMs(key) != null ? t('validatedStatus') : t('inProgressStatus');
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${escapeHtml(g.display||key)}</td>
      <td>${g.password ? '••••' : '—'}</td>
      <td>${status}</td>
      <td>
        <button class="btn" data-g="${key}" data-act="edit">${t('edit')}</button>
        <button class="btn danger" data-g="${key}" data-act="del">${t('delete')}</button>
      </td>`;
    adminGuestsTbody.appendChild(tr);
  });
  adminGuestsTbody.querySelectorAll('button[data-act="del"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-g');
      if (confirm(t('deleteGuestConfirmation'))) { delete state.guests[k]; saveGuests(); renderGuests(); }
    });
  });
  adminGuestsTbody.querySelectorAll('button[data-act="edit"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-g');
      const g = state.guests[k];
      const newName = prompt(t('editGuestNamePrompt'), g.display||'');
      if (!newName) return;
      const newPass = prompt(t('editGuestPasswordPrompt'), g.password||'');
      const newKey = resolveInviteKey(newName);
      delete state.guests[k];
      state.guests[newKey] = { display: newName, password: newPass||null };
      saveGuests(); renderGuests();
    });
  });
}

function bindAdminPhotoTabs() {
  if (!adminTabPending || !adminTabPublished) return;
  const views = {
    pending: document.getElementById('admin-photos-pending'),
    published: document.getElementById('admin-photos-published')
  };
  function activate(which) {
    adminTabPending.classList.toggle('active', which==='pending');
    adminTabPublished.classList.toggle('active', which==='published');
    if (views.pending) views.pending.classList.toggle('hidden', which!=='pending');
    if (views.published) views.published.classList.toggle('hidden', which!=='published');
  }
  adminTabPending.addEventListener('click', ()=> activate('pending'));
  adminTabPublished.addEventListener('click', ()=> activate('published'));
}

async function renderAdminPhotos() {
  if (!adminPhotosPendingTbody || !adminPhotosPublishedTbody) return;
  adminPhotosPendingTbody.innerHTML = '';
  adminPhotosPublishedTbody.innerHTML = '';
  const fmt = (ts) => ts ? new Date(ts).toLocaleString() : '—';
  const sortMode = (document.getElementById('admin-photo-sort')?.value) || 'date_desc';

  const { data, error } = await supabaseClient
    .from('photos')
    .select('*')
    .order('created_at', { ascending: sortMode === 'date_asc' });

  if (error) {
    console.error('Error fetching photos:', error);
    return;
  }

  const records = data.map(photo => {
    const display = state.nameMap[photo.guest_key] || photo.guest_key;
    const id = makeImageId(photo.guest_key, photo.photo_url);
    const likes = (likesDb[id] && likesDb[id].count) || 0;
    return { ...photo, display, likes };
  });

  console.log(`[renderAdminPhotos] Records to render:`, records);
  if (sortMode === 'likes_desc') {
    records.sort((a,b) => (b.likes||0) - (a.likes||0));
  }

  for (const rec of records) {
    const { id, photo_url, display, mission_label, created_at, status, likes, guest_key } = rec;
    const tr = document.createElement('tr');
    const img = `<img src="${photo_url}" alt="mini" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;"/>`;
    if (status === 'pending') {
      tr.innerHTML = `<td>${img}</td><td>${escapeHtml(display)} <span class="status-badge status-pending">${t('pendingStatus')}</span></td><td>${escapeHtml(mission_label||'')}</td><td>${fmt(created_at)}</td><td><button class="btn" data-act="publish" data-id="${id}">${t('validateAndPublish')}</button> <button class="btn danger" data-act="delete" data-id="${id}" data-url="${photo_url}">${t('delete')}</button></td>`;
      adminPhotosPendingTbody.appendChild(tr);
    } else if (status === 'published') {
      tr.innerHTML = `<td>${img}</td><td>${escapeHtml(display)} <span class="status-badge status-published">${t('publishedStatus')}</span></td><td>${escapeHtml(mission_label||'')}</td><td>${fmt(created_at)}</td><td>${likes} ❤️</td><td><button class="btn danger" data-act="delete" data-id="${id}" data-url="${photo_url}">${t('delete')}</button></td>`;
      adminPhotosPublishedTbody.appendChild(tr);
    }
  }
  adminPhotosPendingTbody.querySelectorAll('button[data-act="publish"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      await supabaseClient.from('photos').update({ status: 'published' }).eq('id', id);
      renderAdminPhotos();
    });
  });
  [adminPhotosPendingTbody, adminPhotosPublishedTbody].forEach(tbody => {
    tbody.querySelectorAll('button[data-act="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const url = btn.getAttribute('data-url');
        if (!confirm(t('deletePhotoConfirmation'))) return;

        const fileName = url.split('/').pop();
        await supabaseClient.storage.from('photos').remove([fileName]);
        await supabaseClient.from('photos').delete().eq('id', id);

        renderAdminPhotos();
        showToast(t('photoDeleted'));
      });
    });
  });
}

const UPLOADS_KEY = "defis_mariage_uploads_v2";

function loadUploads() {
  try {
    const raw = localStorage.getItem(UPLOADS_KEY);
    if (!raw) {
      console.log(`[loadUploads] No uploads found in localStorage. Returning empty object.`);
      return {};
    }
    const parsed = JSON.parse(raw);
    console.log(`[loadUploads] Loaded uploads from localStorage:`, parsed);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    console.error(`[loadUploads] Error loading uploads from localStorage:`, e);
    return {};
  }
}
let uploads = loadUploads();
function saveUploads() {
  localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads));
  console.log(`[saveUploads] Uploads saved to localStorage:`, uploads);
}

function getUploadsForInvite(inviteKey) {
  const entry = uploads[inviteKey];
  if (!entry) return [null, null];
  return [entry[0] || null, entry[1] || null];
}
function setUploadForInvite(inviteKey, slot, publicUrl) {
  console.log(`[setUploadForInvite] Setting upload for inviteKey: ${inviteKey}, slot: ${slot}`);
  const current = uploads[inviteKey] || [null, null];
  const challengeLabel = (getAssignedForInvite(inviteKey)[slot]) || (slot === 0 ? t('mission1') : t('mission2'));
  current[slot] = { data: publicUrl, approved: false, published: false, challengeLabel, createdAt: Date.now(), approvedAt: null, publishedAt: null, isUrl: true };
  uploads[inviteKey] = current;
  saveUploads(); // Still save to local storage for immediate UI updates
  console.log(`[setUploadForInvite] Current uploads object after setting:`, uploads);
}
function clearAllUploads() { uploads = {}; saveUploads(); }

async function loadUploadsForInvite(inviteKey) {
  const { data, error } = await supabaseClient
    .from('photos')
    .select('photo_url, mission_label')
    .eq('guest_key', inviteKey)
    .order('created_at');

  if (error) {
    console.error('Error loading uploads:', error);
  } else {
    uploads[inviteKey] = [null, null];
    if (data && data.length > 0) {
      data.forEach((photo, index) => {
        if (index < 2) {
          uploads[inviteKey][index] = { data: photo.photo_url, approved: false, published: false, challengeLabel: photo.mission_label, isUrl: true };
        }
      });
    }
  }

  for (let i = 0; i < 2; i++) {
    updatePreview(i);
  }
  const [a,b] = getUploadsForInvite(inviteKey);
  if (submitMissionsBtn) {
      submitMissionsBtn.disabled = !(a && a.data && b && b.data);
  }
}

async function updatePreview(slot) {
  const [a, b] = getUploadsForInvite(state.currentInviteName);
  const arr = [a, b];
  const upload = arr[slot];
  const dataUrl = upload && upload.data; // This can be a data URL or a public URL
  
  const imgPreview = slotPreviews[slot];
  const zone = slotZones[slot];
  const frameToggleWrapper = document.getElementById(`frame-toggle-wrapper-${slot}`);
  const frameToggle = document.getElementById(`frame-toggle-input-${slot}`);

  if (frameToggleWrapper) {
    frameToggleWrapper.classList.toggle('hidden', !state.frame || !dataUrl);
  }

  if (dataUrl) {
    const shouldUseFrame = frameToggle && frameToggle.checked && state.frame;
    if (upload.isUrl) {
      imgPreview.src = dataUrl; // It's already a URL
    } else {
      imgPreview.src = shouldUseFrame ? await applyFrame(dataUrl) : dataUrl;
    }
    imgPreview.classList.remove('hidden');
    zone.querySelector('.drop__hint').classList.add('hidden');
  } else {
    imgPreview.src = '';
    imgPreview.classList.add('hidden');
    zone.querySelector('.drop__hint').classList.remove('hidden');
  }
}

async function clearSlot(i) {
  const key = state.currentInviteName;
  if (!key) return;

  const entry = uploads[key] || [null, null];
  const upload = entry[i];

  if (upload && upload.data) {
    if (upload.isUrl) {
      const fileName = upload.data.split('/').pop();
      await supabaseClient.storage.from('photos').remove([fileName]);
      await supabaseClient.from('photos').delete().eq('photo_url', upload.data);
    }
  }

  entry[i] = null;
  uploads[key] = entry;
  saveUploads(); // Still save to local storage for immediate UI updates
  await loadUploadsForInvite(key);
}

async function handleImageSelected(slot, file) {
  showLoading();
  try {
    const inviteKey = state.currentInviteName;
    if (!inviteKey) {
      console.warn(`[handleImageSelected] No current invite name. Cannot set upload.`);
      return;
    }

    const fileName = `${inviteKey}-${slot}-${Date.now()}.jpg`;
    const { data, error } = await supabaseClient.storage
      .from('photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabaseClient.storage.from('photos').getPublicUrl(data.path);

    const challengeLabel = (getAssignedForInvite(inviteKey)[slot]) || (slot === 0 ? t('mission1') : t('mission2'));
    const { error: dbError } = await supabaseClient.from('photos').insert({
      guest_key: inviteKey,
      mission_label: challengeLabel,
      photo_url: publicUrl,
    });

    if (dbError) {
      throw dbError;
    }
    
    setUploadForInvite(inviteKey, slot, publicUrl); // We might need to adjust this function
    await updatePreview(slot);
    showToast(`${t('photoSaved')} ${slot + 1}`);
    await loadUploadsForInvite(inviteKey);
  } catch (e) {
    console.error(`[handleImageSelected] Error processing image:`, e);
    showToast(t("imageProcessingError"), "danger");
  } finally {
    hideLoading();
  }
}

function handleAdminActionOnUpload(action, inviteKey, slot) {
  const entry = uploads[inviteKey] || [null, null];
  const item = entry[slot];
  if (!item) return;
  if (action === 'publish') {
    item.approved = true;
    item.published = true;
    item.approvedAt = item.approvedAt || Date.now();
    item.publishedAt = Date.now();
  }
  uploads[inviteKey] = entry;
  saveUploads();
  renderAdminTable();
  renderGallery();
}

async function renderGallery() {
  const columnsWrap = document.getElementById('gallery-columns');
  let placeholder = document.getElementById('gallery-placeholder');

  if (!columnsWrap) return;

  if (!placeholder) {
    placeholder = document.createElement('div');
    placeholder.id = 'gallery-placeholder';
    placeholder.className = 'card card--light hidden';
    placeholder.style.textAlign = 'center';
    placeholder.style.padding = '32px';
    placeholder.style.marginBottom = '12px';
    placeholder.innerHTML = `
      <h3>${t('galleryEmpty')}</h3>
      <p class="subtitle">${t('galleryEmptySubtitle')}</p>
    `;
    columnsWrap.parentNode.insertBefore(placeholder, columnsWrap);
  }

  columnsWrap.innerHTML = '';

  const { data, error } = await supabaseClient
    .from('photos')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gallery photos:', error);
    return;
  }

  const byChallenge = new Map();
  for (const photo of data) {
    const display = state.nameMap[photo.guest_key] || photo.guest_key;
    const label = photo.mission_label || t('mission');
    if (!byChallenge.has(label)) byChallenge.set(label, []);
    byChallenge.get(label).push({ img: photo.photo_url, label, invite: display, inviteKey: photo.guest_key });
  }
  
  if (byChallenge.size === 0) {
    placeholder.classList.remove('hidden');
    columnsWrap.classList.add('hidden');
    return;
  }
  
  placeholder.classList.add('hidden');
  columnsWrap.classList.remove('hidden');

  const labels = Array.from(byChallenge.keys()).sort();
  labels.forEach((label, idx) => {
    const col = document.createElement('div');
    col.className = 'gallery-column';
    col.innerHTML = `<h4>${t('missionHeader')} ${idx+1} – ${escapeHtml(label)}</h4>`;
    const grid = document.createElement('div');
    grid.className = 'gallery-grid';
    byChallenge.get(label).forEach(({ img, invite, inviteKey }) => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      const likes = getLikesFor(inviteKey, img);
      let timeInfo = '';
      // Time calculation logic might need adjustment if we don't have all photo data locally
      div.innerHTML = `<img src="${img}" alt="${escapeHtml(label)}"/>
        <div class="badge">${escapeHtml(invite)}</div>
        <button class="like" type="button" aria-label="${t('likeLabel')}"><span>❤️</span><span class="like-count">${likes}</span></button>
        <div style="position:absolute;bottom:6px;left:6px;right:6px;background:rgba(0,0,0,0.55);color:white;font-size:12px;padding:4px 6px;border-radius:8px;">${escapeHtml(label)}${timeInfo? ' – '+timeInfo: ''}</div>`;
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

function compressImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxSize = 1600; // Max width/height

        // 1. Resize the image while maintaining aspect ratio
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function applyFrame(originalImage) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const frameImg = new Image();
            frameImg.onload = () => {
                ctx.drawImage(frameImg, 0, 0, img.width, img.height);
                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
            frameImg.onerror = reject;
            frameImg.src = state.frame;
        };
        img.onerror = reject;
        img.src = originalImage;
    });
}



function renderAdminStats() {
  const statsParticipantsEl = document.getElementById('stats-participants');
  const statsPendingEl = document.getElementById('stats-pending');
  const statsPublishedEl = document.getElementById('stats-published');

  if (!statsParticipantsEl || !statsPendingEl || !statsPublishedEl) return;

  const participants = new Set(Object.keys(uploads));
  let pendingCount = 0;
  let publishedCount = 0;

  for (const arr of Object.values(uploads)) {
    (arr || []).forEach(up => {
      if (up && up.data) {
        if (up.published) {
          publishedCount++;
        } else if (!up.approved) {
          pendingCount++;
        }
      }
    });
  }

  statsParticipantsEl.textContent = participants.size;
  statsPendingEl.textContent = pendingCount;
  statsPublishedEl.textContent = publishedCount;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
