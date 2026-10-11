/**
 * RAYAKAN.MY.ID — Interactive Script
 * Luxury 3D transforms, device switcher, ambient sounds, and modal management.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDeviceSwitcher();
  initMouseParallax();
  initModals();
  initCurrencySelector();
  initLanguageToggle();
  initWaxSealInteraction();
  initAmbientAudio();
});

/* --------------------------------------------------------------------------
   3D Device Stage Switcher (Cordially ⇆ Toggle)
   -------------------------------------------------------------------------- */
function initDeviceSwitcher() {
  const stage = document.getElementById('deviceStage');
  const swapBtn = document.getElementById('btnDeviceSwap');
  const desktopCard = document.getElementById('desktopCard');
  const phoneCard = document.getElementById('phoneCard');

  if (!stage || !swapBtn) return;

  function toggleFocus(e) {
    if (e) e.stopPropagation();
    if (stage.classList.contains('phone-focus')) {
      stage.classList.remove('phone-focus');
      stage.classList.add('desktop-focus');
    } else {
      stage.classList.remove('desktop-focus');
      stage.classList.add('phone-focus');
    }
  }

  swapBtn.addEventListener('click', toggleFocus);

  // Clicking the unfocused background card brings it to front
  if (desktopCard) {
    desktopCard.addEventListener('click', (e) => {
      if (stage.classList.contains('phone-focus')) {
        stage.classList.remove('phone-focus');
        stage.classList.add('desktop-focus');
      }
    });
  }

  if (phoneCard) {
    phoneCard.addEventListener('click', (e) => {
      if (stage.classList.contains('desktop-focus')) {
        stage.classList.remove('desktop-focus');
        stage.classList.add('phone-focus');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Subtle 3D Mouse Parallax on Desktop
   -------------------------------------------------------------------------- */
function initMouseParallax() {
  const showcase = document.querySelector('.hero-showcase-column');
  const stage = document.getElementById('deviceStage');

  if (!showcase || !stage || window.innerWidth < 1024) return;

  showcase.addEventListener('mousemove', (e) => {
    const rect = showcase.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 8;
    const rotY = (x / rect.width) * 10;

    stage.style.transform = `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  showcase.addEventListener('mouseleave', () => {
    stage.style.transform = `perspective(1400px) rotateX(0deg) rotateY(0deg)`;
    stage.style.transition = 'transform 0.5s ease-out';
  });

  showcase.addEventListener('mouseenter', () => {
    stage.style.transition = 'none';
  });
}

/* --------------------------------------------------------------------------
   Interactive Wax Seal Animation
   -------------------------------------------------------------------------- */
function initWaxSealInteraction() {
  const sealBadge = document.querySelector('.desktop-seal-interactive-badge');
  const desktopCard = document.getElementById('desktopCard');

  if (!desktopCard) return;

  desktopCard.addEventListener('click', () => {
    if (document.getElementById('deviceStage').classList.contains('desktop-focus')) {
      openModal('envelopePreviewModal');
    }
  });
}

/* --------------------------------------------------------------------------
   Modals Management (Single Viewport experience)
   -------------------------------------------------------------------------- */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  const overlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      openModal(targetId);
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  overlays.forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach((m) => closeModal(m));
    }
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modal) {
  modal.classList.remove('active');
}

/* --------------------------------------------------------------------------
   Currency Selector Popover
   -------------------------------------------------------------------------- */
function initCurrencySelector() {
  const btn = document.getElementById('currencySelectorBtn');
  const popover = document.getElementById('currencyPopover');
  if (!btn || !popover) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    popover.classList.toggle('hidden');
  });

  document.querySelectorAll('.currency-opt').forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = opt.getAttribute('data-code');
      const flag = opt.getAttribute('data-flag');
      const label = document.getElementById('selectedCurrencyLabel');
      const flagElem = document.getElementById('selectedCurrencyFlag');

      if (label) label.textContent = code;
      if (flagElem) flagElem.textContent = flag;
      popover.classList.add('hidden');
    });
  });

  document.addEventListener('click', () => {
    popover.classList.add('hidden');
  });
}

/* --------------------------------------------------------------------------
   Language Switcher (ID / EN)
   -------------------------------------------------------------------------- */
function initLanguageToggle() {
  const langBtn = document.getElementById('langToggleBtn');
  const langLabel = document.getElementById('currentLangLabel');
  if (!langBtn || !langLabel) return;

  let currentLang = 'ID';

  langBtn.addEventListener('click', () => {
    if (currentLang === 'ID') {
      currentLang = 'EN';
      langLabel.textContent = 'EN';
      applyLanguage('EN');
    } else {
      currentLang = 'ID';
      langLabel.textContent = 'ID';
      applyLanguage('ID');
    }
  });
}

function applyLanguage(lang) {
  const i18nElements = document.querySelectorAll('[data-i18n-id]');
  i18nElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-id');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
}

const translations = {
  ID: {
    tagline: 'Setiap Momen<br><span class="italic-accent">Layak Dirayakan.</span>',
    subdesc: 'Bukan sekadar website undangan biasa. Rayakan menghadirkan karya digital yang elegan, sinematik, dan berkesan mendalam untuk pernikahan, pesta, ulang tahun, hingga momen istimewa Anda sejak klik pertama.',
    orderNow: 'Pesan Sekarang',
    viewTemplates: 'Lihat Template',
    ratingProof: 'Dipercaya 100+ Momen Bahagia',
    consultLink: 'Konsultasi Gratis di Instagram',
    customEnvelope: 'Amplop Digital Mewah & Wax Seal 3D',
    customDesign: 'Kustomisasi Desain & Musik Penuh',
    guestRsvp: 'RSVP Tamu & Buku Ucapan Interaktif'
  },
  EN: {
    tagline: 'Every Moment<br><span class="italic-accent">Deserves Celebration.</span>',
    subdesc: 'Far beyond ordinary wedding websites. Rayakan creates digital invitations that are bold, cinematic, and deeply memorable for weddings, parties, birthdays, and your most cherished celebrations.',
    orderNow: 'Order Now',
    viewTemplates: 'Explore Templates',
    ratingProof: 'Trusted by 100+ Happy Celebrations',
    consultLink: 'Free Consultation via Instagram',
    customEnvelope: 'Luxury Digital Envelope & 3D Wax Seal',
    customDesign: 'Full Design & Background Music Customization',
    guestRsvp: 'Interactive Guest RSVP & Guestbook'
  }
};

/* --------------------------------------------------------------------------
   Ambient Audio Synth (Harmonic Harp / Piano Chords)
   -------------------------------------------------------------------------- */
function initAmbientAudio() {
  const audioBtn = document.getElementById('ambientAudioBtn');
  const audioIcon = document.getElementById('audioIcon');
  if (!audioBtn) return;

  let isPlaying = false;
  let audioCtx = null;
  let intervalId = null;

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      playAmbientArpeggio(audioCtx);
      intervalId = setInterval(() => playAmbientArpeggio(audioCtx), 6000);
      isPlaying = true;
      audioBtn.style.color = '#f3d8a7';
      audioBtn.style.borderColor = 'rgba(243, 216, 167, 0.6)';
      audioBtn.setAttribute('title', 'Matikan Musik Latar');
    } else {
      if (intervalId) clearInterval(intervalId);
      isPlaying = false;
      audioBtn.style.color = 'rgba(255, 255, 255, 0.85)';
      audioBtn.style.borderColor = 'var(--border-subtle)';
      audioBtn.setAttribute('title', 'Putar Musik Latar');
    }
  });

  function playAmbientArpeggio(ctx) {
    // Ethereal pentatonic chord: C#4, E4, G#4, B4, D#5
    const freqs = [277.18, 329.63, 415.30, 493.88, 622.25];
    freqs.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 3.6);
      }, idx * 450);
    });
  }
}
