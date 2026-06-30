
document.addEventListener('DOMContentLoaded', () => {
const questions = document.querySelectorAll('.faq-question');
questions.forEach(q => {
q.addEventListener('click', () => {
q.parentElement.classList.toggle('active');
});
});


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


const certificateModal = document.getElementById('certificate-modal');
const certificateModalImage = certificateModal?.querySelector('.certificate-modal__image');
const certificateGallery = document.querySelector('#certificates .gallery');
const certificatePrevButton = certificateModal?.querySelector('.certificate-modal__prev');
const certificateNextButton = certificateModal?.querySelector('.certificate-modal__next');

if (certificateModal && certificateModalImage && certificateGallery) {
  const certificateImages = Array.from(certificateGallery.querySelectorAll('img'));
  let activeIndex = 0;

  const renderCertificate = (index) => {
    const img = certificateImages[index];
    if (!img) return;

    certificateModalImage.classList.add('is-changing');
    setTimeout(() => {
      certificateModalImage.src = img.src;
      certificateModalImage.alt = img.alt || 'Podgląd certyfikatu';
      certificateModalImage.classList.remove('is-changing');
    }, 80);

    activeIndex = index;
  };

  const openCertificateModal = (img) => {
    if (!img) return;
    const index = certificateImages.indexOf(img);
    if (index >= 0) {
      activeIndex = index;
    }

    renderCertificate(activeIndex);
    certificateModal.hidden = false;
    certificateModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeCertificateModal = () => {
    certificateModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    certificateModal.hidden = true;
  };

  const showPreviousCertificate = () => {
    const nextIndex = (activeIndex - 1 + certificateImages.length) % certificateImages.length;
    renderCertificate(nextIndex);
  };

  const showNextCertificate = () => {
    const nextIndex = (activeIndex + 1) % certificateImages.length;
    renderCertificate(nextIndex);
  };

  certificateGallery.addEventListener('click', (event) => {
    const galleryItem = event.target.closest('.gallery-item');
    if (!galleryItem) return;

    const img = galleryItem.querySelector('img');
    if (img) openCertificateModal(img);
  });

  certificateGallery.addEventListener('keydown', (event) => {
    const galleryItem = event.target.closest('.gallery-item');
    if (!galleryItem) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const img = galleryItem.querySelector('img');
      if (img) openCertificateModal(img);
    }
  });

  certificateModal.addEventListener('click', (event) => {
    if (event.target.hasAttribute('data-close')) {
      closeCertificateModal();
    }
  });

  certificatePrevButton?.addEventListener('click', showPreviousCertificate);
  certificateNextButton?.addEventListener('click', showNextCertificate);

  document.addEventListener('keydown', (event) => {
    if (certificateModal.hidden) return;

    if (event.key === 'Escape') {
      closeCertificateModal();
    } else if (event.key === 'ArrowLeft') {
      showPreviousCertificate();
    } else if (event.key === 'ArrowRight') {
      showNextCertificate();
    }
  });
}

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
  
  $(".testimonial__slider").owlCarousel({
    loop: true,
    margin: 24,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    smartSpeed: 550,
    responsive: { 0:{items:1}, 768:{items:2} }
  });

  
  $("#certificates .gallery").owlCarousel({
    loop: true,
    margin: 18,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2600,
    autoplayHoverPause: true,
    smartSpeed: 500,
    responsive: { 0:{items:2}, 600:{items:3}, 1000:{items:5} }
  });
}


document.addEventListener('DOMContentLoaded', () => {
    function makeContinuousCarousel(selector, intervalMs){
        const container = document.querySelector(selector);
        if(!container) return;
        const originals = Array.from(container.children).filter(n => n.nodeType===1);
        if(originals.length <= 1) return;

        
        originals.forEach(node => {
            const clone = node.cloneNode(true);
            clone.setAttribute('aria-hidden','true');
            container.appendChild(clone);
        });

        
        const items = Array.from(container.children).filter(n => n.nodeType===1);
        const positions = items.map(it => it.offsetLeft);

        let index = 0; 
        let paused = false;
        const smoothDuration = 500; 

        container.style.scrollBehavior = 'smooth';

        container.addEventListener('mouseenter', () => { paused = true; });
        container.addEventListener('mouseleave', () => { paused = false; });
        container.addEventListener('focusin', () => { paused = true; });
        container.addEventListener('focusout', () => { paused = false; });

        
        function scrollToItem(i){
            const item = items[i];
            if(!item) return;
            const offset = item.offsetLeft - Math.max(0, (container.clientWidth - item.clientWidth) / 2);
            container.scrollTo({ left: offset, behavior: 'smooth' });
        }

        
        setTimeout(() => scrollToItem(0), 50);

        const timer = setInterval(() => {
            if(paused) return;
            index++;
            scrollToItem(index);

            
            if(index >= originals.length){
                
                setTimeout(() => {
                    container.style.scrollBehavior = 'auto';
                    
                    const resetIndex = index - originals.length;
                    const resetOffset = items[resetIndex].offsetLeft - Math.max(0, (container.clientWidth - items[resetIndex].clientWidth) / 2);
                    container.scrollLeft = resetOffset;
                    
                    setTimeout(() => { container.style.scrollBehavior = 'smooth'; }, 20);
                    index = resetIndex;
                }, smoothDuration + 40);
            }
        }, intervalMs || 1000);

        
        window.addEventListener('resize', () => setTimeout(() => { items.forEach((it,i) => positions[i] = it.offsetLeft); scrollToItem(index); }, 120));

        return { stop: () => clearInterval(timer) };
    }

    makeContinuousCarousel('.testimonial__slider', 1000);
    makeContinuousCarousel('#certificates .gallery', 1000);
});
