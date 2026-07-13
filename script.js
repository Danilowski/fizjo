

// FAQ toggle
document.addEventListener('DOMContentLoaded', () => {
const questions = document.querySelectorAll('.faq-question');
questions.forEach(q => {
q.addEventListener('click', () => {
q.parentElement.classList.toggle('active');
});
});

// Smooth scroll z kompensacją sticky header
document.querySelectorAll('a[href^="#"]').forEach(a => {
a.addEventListener('click', e => {
const id = a.getAttribute('href').slice(1);
const el = document.getElementById(id);
if (el) {
e.preventDefault();
const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
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
}, { threshold: 0.12 });
revealTargets.forEach(el => io.observe(el));
});

if (window.$ && window.$.fn && typeof window.$.fn.owlCarousel === 'function') {
  // Certyfikaty – manualne przewijanie przyciskami
  $("#certificates .gallery").owlCarousel({
    loop: true,
    margin: 18,
    nav: false,
    dots: false,
    autoplay: false,
    smartSpeed: 500,
    responsive: { 0:{items:2}, 600:{items:3}, 1000:{items:5} }
  });
}

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
}

// Auto-scroll carousels (per-card smooth auto-advance, seamless loop)
document.addEventListener('DOMContentLoaded', () => {
    function makeContinuousCarousel(selector, intervalMs){
        const container = document.querySelector(selector);
        if(!container) return;
        const originals = Array.from(container.children).filter(n => n.nodeType===1);
        if(originals.length <= 1) return;

        // Clone originals to allow seamless looping
        originals.forEach(node => {
            const clone = node.cloneNode(true);
            clone.setAttribute('aria-hidden','true');
            container.appendChild(clone);
        });

        // Recompute items and positions
        const items = Array.from(container.children).filter(n => n.nodeType===1);
        const positions = items.map(it => it.offsetLeft);

        let index = 0; // index into items array
        let paused = false;
        const smoothDuration = 500; // ms (approx) for smooth scroll

        container.style.scrollBehavior = 'smooth';

        container.addEventListener('mouseenter', () => { paused = true; });
        container.addEventListener('mouseleave', () => { paused = false; });
        container.addEventListener('focusin', () => { paused = true; });
        container.addEventListener('focusout', () => { paused = false; });

        // helper to scroll to item index with centering
        function scrollToItem(i){
            const item = items[i];
            if(!item) return;
            const offset = item.offsetLeft - Math.max(0, (container.clientWidth - item.clientWidth) / 2);
            container.scrollTo({ left: offset, behavior: 'smooth' });
        }

        // initial center
        setTimeout(() => scrollToItem(0), 50);

        const timer = setInterval(() => {
            if(paused) return;
            index++;
            scrollToItem(index);

            // when we've scrolled into the cloned half, jump back to original index
            if(index >= originals.length){
                // after smooth animation completes, reset to original index without animation
                setTimeout(() => {
                    container.style.scrollBehavior = 'auto';
                    // compute equivalent original index and scroll to it
                    const resetIndex = index - originals.length;
                    const resetOffset = items[resetIndex].offsetLeft - Math.max(0, (container.clientWidth - items[resetIndex].clientWidth) / 2);
                    container.scrollLeft = resetOffset;
                    // restore smooth behavior
                    setTimeout(() => { container.style.scrollBehavior = 'smooth'; }, 20);
                    index = resetIndex;
                }, smoothDuration + 40);
            }
        }, intervalMs || 1000);

        // keep positions updated on resize
        window.addEventListener('resize', () => setTimeout(() => { items.forEach((it,i) => positions[i] = it.offsetLeft); scrollToItem(index); }, 120));

        return { stop: () => clearInterval(timer) };
    }

});
