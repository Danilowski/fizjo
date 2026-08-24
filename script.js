

// ── Liczniki opinii: aktualizuj oba po każdej synchronizacji z ZnanyLekarz i Google Maps
const ZNANY_LEKARZ_REVIEW_COUNT = 161; // napędza karuzelę opinii (schema.org/Review) i .js-review-count
const GOOGLE_REVIEW_COUNT = 82; // wyświetlany jako liczba w .js-google-review-count
const HEADER_HEIGHT = 80;      // sticky header offset fallback (uzywany tylko gdy #header nie istnieje)
const REVEAL_THRESHOLD = 0.12; // IntersectionObserver visibility threshold
const CAROUSEL_SPEED = 500;    // ms, carousel animation speed

const TESTIMONIALS = [
  { name: 'Barbara', icon: '👩‍⚕️', date: '2026-06-15', text: 'Jestem po pierwszej wizycie u Pani Moniki. Przemiła osoba z profesjonalnym podejściem do pacjenta. Czekam na efekty naszej dalszej współpracy. Polecam z całego serca.' },
  { name: 'Joanna', icon: '👩‍🎤', date: '2026-05-20', text: 'Bardzo profesjonalne podejście do pacjenta, szczegółowe wyjaśnienia każdego ćwiczenia i bardzo szybkie zniwelowanie dolegliwości bólowych u nastolatki z uszkodzeniem kręgosłupa pozwalają mi na stwierdzenie, że Pani Monika jest znakomitą, godną polecenia fizjoterapeutką.' },
  { name: 'P.Ch', icon: '🧑‍💼', date: '2026-06-10', text: 'Wizyta bardzo udana, polecam serdecznie! Po pierwszej wizycie poczułam się o wiele lepiej... Pani Monika jest profesjonalistką w swojej dziedzinie i wie, co robi :)' },
  { name: 'Michał', icon: '🤵‍♂️', text: 'Bardzo dobra fizjoterapeutka, zna się na swoim fachu, godna zaufania. Bardzo miła Pani.' },
  { name: 'Małgorzata', icon: '👩‍🏫', text: 'Atmosfera i profesjonalizm na najwyższym poziomie. Była to moja kolejna wizyta, ale już po pierwszej dzięki masażowi i ćwiczeniom czułam poprawę. Polecam Panią Monikę.' },
  { name: 'Anna', icon: '👩‍🌾', text: 'Do Pani Moniki uczęszczałam na fizjoterapię stomatologiczną. Zabiegi zawsze odbywały się w miłej atmosferze, uzyskałam odpowiedzi na wszystkie pytania. Serdecznie polecam.' },
  { name: 'Jarek', icon: '👰‍♂️', text: 'Profesjonalnie i z uśmiechem. Zdecydowanie polecam.' },
  { name: 'Jacek', icon: '🚵‍♀️', text: 'Jestem zadowolony z terapii szyi, karku. Przyjazna atmosfera. Polecam.' },
  { name: 'Zuzanna', icon: '🚵‍♀️', text: 'Mam problem z bólami karku. Już po pierwszej wizycie u pani Moniki zauważyłam odczuwalną różnicę, bardzo polecam, super podejście do pacjenta!' },
  { name: 'Krysia', icon: '🧜‍♀️', text: 'Profesjonalna usługa, bardzo dobrze się czuję po terapii pleców. Pani Monika przekazuje bardzo dużo przydatnych informacji podczas wizyty. Bardzo polecam.' },
  { name: 'Maciek', icon: '🙋‍♀️', text: 'Od dawna mam problem z ruchomością barków, bólami szyi i głowy. Jestem w szoku, że już po pierwszej wizycie widzę sporą różnicę. Oprócz terapii w gabinecie dostałem też zalecenia do domu. Wszystko dokładnie wytłumaczone. W miłej atmosferze. Nie mogę się doczekać efektów kolejnych spotkań. Bardzo polecam.' },
  { name: 'Robert', icon: '🙋', text: 'Bardzo miła fizjoterapeutka z dużą wiedzą i dobrym podejściem do klienta, podczas wizyty wykonano masaż żuchwy, zalecono ćwiczenia do wykonywania w domu i omówiono złe nawyki. Polecam :)' },
  { name: 'Iwona', icon: '🙋🏼', text: 'Pełen profesjonalizm, diagnoza oraz skuteczny zabieg. Miła atmosfera, duża empatia do pacjenta. Bardzo dziękuję i polecam z całego serca.' },
  { name: 'Kriss', icon: '🙋🏼‍♀️', text: 'Bardzo pomógł mi fachowy instruktaż odnośnie ćwiczeń. Okazało się, że ćwicząc samodzielnie, robiłem dużo błędów. Po korekcie, zacząłem odczuwać wyraźną poprawę.' },
  { name: 'Agnieszka', icon: '👩‍💻', text: 'Gdyby wizyty u innych specjalistów przebiegały tak miło i profesjonalnie jak u Moniki, to zdecydowanie chętniej chodziłabym się badać. Szczegółowy wywiad lekarski jak najbardziej na plus – Monika łączy wiele wątków na raz, wydając trafną diagnozę. Była to moja pierwsza wizyta u fizjoterapeuty i na pewno nie ostatnia w tym konkretnym gabinecie.' },
  { name: 'Magda', icon: '🙋🏻', text: 'Bardzo profesjonalne i przyjazne podejście do pacjenta. Pani Monika zwraca również uwagę na próg bólu pacjenta, co uważam za ogromny plus. Z pewnością jeszcze wrócę, dziękuję bardzo!' }
];

const renderTestimonials = () => {
  const slider = document.querySelector('.testimonial__slider');
  if (!slider) return;

  const reviews = TESTIMONIALS.map((review, index) => `
    <div class="testimonial__item" itemscope itemtype="https://schema.org/Review" ${index === 0 ? 'data-first="true"' : ''}>
      <div class="testimonial__author">
        <div class="testimonial__author__icon" aria-hidden="true">${review.icon}</div>
        <div class="testimonial__author__text">
          <div itemprop="author" itemscope itemtype="https://schema.org/Person">
            <h3 itemprop="name" class="testimonial-author-name">${review.name}</h3>
          </div>
          <span itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
            <meta itemprop="ratingValue" content="5">
            zdecydowanie poleca
          </span>
          ${review.date ? `<meta itemprop="datePublished" content="${review.date}">` : ''}
        </div>
      </div>
      <div class="rating" aria-label="Ocena 5 na 5">★★★★★</div>
      <p class="equal-1" itemprop="reviewBody">${review.text}</p>
      <div itemprop="itemReviewed" itemscope itemtype="https://schema.org/LocalBusiness">
        <meta itemprop="name" content="M.Therapy">
        <meta itemprop="url" content="https://mtherapy.pl/">
      </div>
    </div>
  `).join('');

  slider.innerHTML = `
    <div itemprop="itemReviewed" itemscope itemtype="https://schema.org/LocalBusiness">
      <meta itemprop="name" content="M.Therapy">
      <meta itemprop="url" content="https://mtherapy.pl/">
    </div>
    <meta itemprop="ratingValue" content="5">
    <meta itemprop="bestRating" content="5">
    <meta itemprop="worstRating" content="1">
    <meta itemprop="ratingCount" content="${ZNANY_LEKARZ_REVIEW_COUNT}">
    ${reviews}
  `;
};

document.addEventListener('DOMContentLoaded', () => {
renderTestimonials();
document.querySelectorAll('.js-review-count').forEach(el => { el.textContent = ZNANY_LEKARZ_REVIEW_COUNT; });
document.querySelectorAll('.js-google-review-count').forEach(el => { el.textContent = GOOGLE_REVIEW_COUNT; });
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('primary-navigation');
const mobileNavMedia = window.matchMedia('(max-width: 992px)');

const isMobileNavMode = () => mobileNavMedia.matches;

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
if (isMobileNavMode()) {
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
  if (link.matches('.dropdown > a') && isMobileNavMode()) return;
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

// Smooth scroll z kompensacją sticky header
document.querySelectorAll('a[href^="#"]').forEach(a => {
a.addEventListener('click', e => {
  // Nie scrolluj gdy link Oferta jest togglem submenu na mobilach
  if (a.matches('.dropdown > a') && isMobileNavMode()) return;
  const id = a.getAttribute('href').slice(1);
  const el = document.getElementById(id);
if (el) {
e.preventDefault();
// Mierzone na bieżąco, bo wysokość nagłówka zmienia się wraz z breakpointami CSS
const headerOffset = document.querySelector('header')?.getBoundingClientRect().height || HEADER_HEIGHT;
const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
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

const testimonialSlider = document.querySelector('.testimonial__slider');
const testimonialItems = Array.from(document.querySelectorAll('.testimonial__item'));

if (testimonialSlider && testimonialItems.length) {
  let currentIndex = 0;

  const goToItem = (index) => {
    const safeIndex = Math.max(0, Math.min(index, testimonialItems.length - 1));
    currentIndex = safeIndex;
    const targetItem = testimonialItems[safeIndex];
    testimonialSlider.scrollTo({ left: targetItem.offsetLeft, behavior: 'smooth' });
  };

  document.querySelectorAll('.testimonials .testimonial-nav-btn:not(.certificate-nav-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
      const direction = btn.dataset.direction === 'next' ? 1 : -1;
      goToItem(currentIndex + direction);
    });
  });
}

const lazyLoadMaps = () => {
  const maps = document.querySelectorAll('iframe[data-lazy-src]');
  if (!maps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const iframe = entry.target;
      if (iframe.dataset.loaded === 'true') return;
      iframe.src = iframe.dataset.lazySrc;
      iframe.dataset.loaded = 'true';
      observer.unobserve(iframe);
    });
  }, { rootMargin: '200px 0px' });

  maps.forEach((iframe) => observer.observe(iframe));
};

lazyLoadMaps();
});

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
    certificateSlider.scrollTo({ left: targetItem.offsetLeft, behavior: 'smooth' });
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
