

// ── Zaktualizuj tę liczbę po każdej synchronizacji z ZnanyLekarz
const REVIEW_COUNT = 160;
const HEADER_HEIGHT = 80;      // sticky header offset
const REVEAL_THRESHOLD = 0.12; // IntersectionObserver visibility threshold
const CAROUSEL_SPEED = 500;    // ms, carousel animation speed

document.addEventListener('DOMContentLoaded', () => {
document.querySelectorAll('.js-review-count').forEach(el => { el.textContent = REVIEW_COUNT; });
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('primary-navigation');

menuToggle?.addEventListener('click', () => {
const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
menuToggle.setAttribute('aria-expanded', String(!isOpen));
navigation?.classList.toggle('is-open', !isOpen);
if (isOpen) {
  submenuToggle?.setAttribute('aria-expanded', 'false');
  offerSubmenu?.classList.remove('is-open');
  dropdownLink?.classList.remove('submenu-open');
}
});

const submenuToggle = document.querySelector('.submenu-toggle');
const offerSubmenu = document.getElementById('offer-submenu');
const dropdownLink = document.querySelector('.dropdown > a');

submenuToggle?.addEventListener('click', () => {
const isOpen = submenuToggle.getAttribute('aria-expanded') === 'true';
submenuToggle.setAttribute('aria-expanded', String(!isOpen));
offerSubmenu?.classList.toggle('is-open', !isOpen);
});

// On mobile: Oferta link itself toggles submenu (submenuToggle is hidden)
dropdownLink?.addEventListener('click', (e) => {
if (getComputedStyle(submenuToggle).display === 'none') {
  e.preventDefault();
  const isOpen = submenuToggle.getAttribute('aria-expanded') === 'true';
  submenuToggle.setAttribute('aria-expanded', String(!isOpen));
  offerSubmenu?.classList.toggle('is-open', !isOpen);
  dropdownLink.classList.toggle('submenu-open', !isOpen);
}
});

document.addEventListener('keydown', (event) => {
if (event.key !== 'Escape') return;
if (submenuToggle?.getAttribute('aria-expanded') === 'true') {
submenuToggle.setAttribute('aria-expanded', 'false');
offerSubmenu?.classList.remove('is-open');
submenuToggle.focus();
}
if (menuToggle?.getAttribute('aria-expanded') === 'true') {
menuToggle.setAttribute('aria-expanded', 'false');
navigation?.classList.remove('is-open');
menuToggle.focus();
}
});

document.querySelectorAll('.main-list a').forEach((link) => {
link.addEventListener('click', () => {
  // Nie zamykaj menu przy tapnięciu w Oferta (to toggle submenu, nie nawigacja)
  if (link.matches('.dropdown > a') && getComputedStyle(submenuToggle).display === 'none') return;
  menuToggle?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
});
});

document.querySelectorAll('.faq-question').forEach((button) => {
button.addEventListener('click', () => {
const answer = document.getElementById(button.getAttribute('aria-controls'));
const isOpen = button.getAttribute('aria-expanded') === 'true';
button.setAttribute('aria-expanded', String(!isOpen));
if (answer) answer.hidden = isOpen;
if (!isOpen) {
  window.gtag?.('event', 'faq_open', { question: button.textContent.trim().substring(0, 60) });
}
});

document.querySelectorAll('[data-track]').forEach((link) => {
link.addEventListener('click', () => {
const trackType = link.dataset.track;
const params = link.href.includes('?') ? new URLSearchParams(link.href.split('?')[1]) : new URLSearchParams();
const campaign = params.get('utm_campaign') || trackType;
window.dataLayer?.push({ event: trackType + '_click', campaign });
window.gtag?.('event', 'generate_lead', {
  lead_source: trackType,
  lead_campaign: campaign,
  link_url: link.href
});
});
});
});

// Smooth scroll z kompensacją sticky header
document.querySelectorAll('a[href^="#"]').forEach(a => {
a.addEventListener('click', e => {
const id = a.getAttribute('href').slice(1);
const el = document.getElementById(id);
if (el) {
e.preventDefault();
const y = el.getBoundingClientRect().top + window.pageYOffset - HEADER_HEIGHT;
window.scrollTo({ top: y, behavior: 'smooth' });
}
});
});

// Reveal on scroll
const revealTargets = document.querySelectorAll('.offer-card, .booking-card, .booking-side, .contact-card, .map-card, .aboutme-page, .testimonial__item');
const io = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting) {
e.target.classList.add('in');
io.unobserve(e.target);
}
});
}, { threshold: REVEAL_THRESHOLD });
revealTargets.forEach(el => io.observe(el));
});

const testimonialSlider = document.querySelector('.testimonial__slider');
const testimonialItems = Array.from(document.querySelectorAll('.testimonial__item'));

if (testimonialSlider && testimonialItems.length) {
  let currentIndex = 0;

  const goToItem = (index) => {
    const safeIndex = Math.max(0, Math.min(index, testimonialItems.length - 1));
    currentIndex = safeIndex;
    const targetItem = testimonialItems[safeIndex];
    targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  document.querySelectorAll('.testimonials .testimonial-nav-btn:not(.certificate-nav-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
      const direction = btn.dataset.direction === 'next' ? 1 : -1;
      goToItem(currentIndex + direction);
    });
  });
}

const certificateSlider = document.querySelector('#certificates .gallery');
const certificateItems = Array.from(document.querySelectorAll('#certificates .gallery-item'));
const certificateModal = document.getElementById('certificate-modal');
const certificateModalImage = certificateModal?.querySelector('.certificate-modal__image');

if (certificateSlider && certificateItems.length) {
  let certificateIndex = 0;

  const goToCertificateItem = (index) => {
    const safeIndex = Math.max(0, Math.min(index, certificateItems.length - 1));
    certificateIndex = safeIndex;
    const targetItem = certificateItems[safeIndex];
    targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  document.querySelectorAll('#certificates .certificate-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const direction = btn.dataset.direction === 'next' ? 1 : -1;
      goToCertificateItem(certificateIndex + direction);
    });
  });

  certificateItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img || !certificateModal || !certificateModalImage) return;
      certificateModalImage.src = img.src;
      certificateModalImage.alt = img.alt || 'Podgląd certyfikatu';
      certificateModal.hidden = false;
      certificateModal.setAttribute('aria-hidden', 'false');
      certificateIndex = index;
    });
  });

  certificateModal?.querySelectorAll('[data-close="true"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!certificateModal) return;
      certificateModal.hidden = true;
      certificateModal.setAttribute('aria-hidden', 'true');
    });
  });

  certificateModal?.querySelector('.certificate-modal__prev')?.addEventListener('click', () => {
    const newIndex = Math.max(0, certificateIndex - 1);
    const img = certificateItems[newIndex]?.querySelector('img');
    if (img && certificateModalImage) {
      certificateModalImage.src = img.src;
      certificateModalImage.alt = img.alt || 'Pogląd certyfikatu';
      certificateIndex = newIndex;
    }
  });

  certificateModal?.querySelector('.certificate-modal__next')?.addEventListener('click', () => {
    const newIndex = Math.min(certificateItems.length - 1, certificateIndex + 1);
    const img = certificateItems[newIndex]?.querySelector('img');
    if (img && certificateModalImage) {
      certificateModalImage.src = img.src;
      certificateModalImage.alt = img.alt || 'Pogląd certyfikatu';
      certificateIndex = newIndex;
    }
  });
}
