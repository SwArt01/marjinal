/* === HEADER SCROLL === */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

/* === HAMBURGER MENU === */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click
nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* === ACTIVE NAV LINK ON SCROLL === */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => observer.observe(section));

/* === COUNTER ANIMATION === */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => animateCounter(el));
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* === SCROLL REVEAL ANIMATIONS === */
const revealEls = document.querySelectorAll(
  '.service-card, .gallery-item, .contact-card, .about-grid, .stat-item'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  el.dataset.delay = (i % 4) * 100;
  revealObserver.observe(el);
});

/* === CONTACT FORM === */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !phone) {
      showToast('Lütfen ad ve telefon alanlarını doldurun.', 'error');
      return;
    }

    const waText = encodeURIComponent(
      `Merhaba Marjin Club!\n\nBaşvuru Formu:\n\nAd: ${name}\nTelefon: ${phone}\nPozisyon: ${subject || 'Belirtilmedi'}\nHakkımda: ${message || '—'}`
    );
    window.open(`https://wa.me/905327121580?text=${waText}`, '_blank');
    showToast('Başvurunuz WhatsApp\'a iletiliyor...', 'success');
    contactForm.reset();
  });
}

/* === TOAST NOTIFICATION === */
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 32px;
    background: ${type === 'success' ? 'var(--gold)' : '#e74c3c'};
    color: ${type === 'success' ? '#000' : '#fff'};
    font-family: var(--font-main);
    font-size: 0.85rem;
    font-weight: 600;
    padding: 14px 24px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
    letter-spacing: 1px;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = '1');
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* Slideshow aktif olduğu için parallax scroll devre dışı */

/* === CAROUSEL / JOB LISTINGS === */
const track = document.getElementById('servicesTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

if (track && prevBtn && nextBtn && dotsContainer) {
  const cards = track.querySelectorAll('.job-card');

  const CARD_WIDTH = () => {
    const card = cards[0];
    if (!card) return 340;
    const style = getComputedStyle(track);
    const gap = parseInt(style.gap) || 20;
    return card.offsetWidth + gap;
  };

  // Dots oluştur
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `İlan ${i + 1}`);
    dot.addEventListener('click', () => {
      track.scrollTo({ left: i * CARD_WIDTH(), behavior: 'smooth' });
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  function updateState() {
    const scrollLeft = track.scrollLeft;
    const cw = CARD_WIDTH();
    const activeIdx = Math.round(scrollLeft / cw);
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    prevBtn.disabled = scrollLeft <= 2;
    nextBtn.disabled = scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -CARD_WIDTH(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: CARD_WIDTH(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateState, { passive: true });
  window.addEventListener('resize', updateState);
  updateState();
}

