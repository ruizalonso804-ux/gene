/* ═══════════════════════════════════════════════════
   NUESTRA HISTORIA — main.js
   GSAP + ScrollTrigger + Lenis smooth scroll
   ═══════════════════════════════════════════════════ */

/* ── Reduced motion check ─────────────────────────── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Lenis smooth scroll ──────────────────────────── */
let lenis;
try {
  if (!prefersReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);
  }
} catch(e) {
  lenis = null;
}

/* ── Register ScrollTrigger ───────────────────────── */
gsap.registerPlugin(ScrollTrigger);

if (lenis) {
  ScrollTrigger.scrollerProxy && void 0;
}

/* ═══════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════════ */
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = Math.min(100, (scrollTop / docHeight) * 100);
  progressBar.style.width = pct + '%';
});

/* ═══════════════════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════════════════ */
const preloader = document.getElementById('preloader');
const loaderBar = document.getElementById('loaderBar');
const skipBtn   = document.getElementById('skipBtn');
const loaderCurtain = document.getElementById('loaderCurtain');
const preloaderText = document.querySelector('.preloader__text');

let preloaderDone = false;

function revealSite() {
  if (preloaderDone) return;
  preloaderDone = true;
  lenis && lenis.stop();

  // Curtain drops
  gsap.timeline({
    onComplete: () => {
      preloader.classList.add('hidden');
      lenis && lenis.start();
      initHeroAnimations();
    }
  })
    .to(loaderCurtain, { scaleY: 1, duration: 0.5, ease: 'power3.inOut' })
    .to(preloader, { opacity: 0, duration: 0.2, ease: 'none' });
}

// Animate text reveal
gsap.to(preloaderText, {
  clipPath: 'inset(0 0% 0 0)',
  duration: 1.2,
  ease: 'power3.out',
  delay: 0.3,
});

// Progress bar fill
let progress = 0;
const interval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    loaderBar.style.width = '100%';
    clearInterval(interval);
    setTimeout(revealSite, 400);
  } else {
    loaderBar.style.width = progress + '%';
  }
}, 200);

skipBtn.addEventListener('click', () => {
  clearInterval(interval);
  revealSite();
});

/* ═══════════════════════════════════════════════════
   HERO ANIMATIONS
   ═══════════════════════════════════════════════════ */
function splitTextToChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  text.split('').forEach(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
  });
  return el.querySelectorAll('.char');
}

function initHeroAnimations() {
  const heroTitle = document.querySelector('.hero__title');
  const heroSub   = document.querySelector('.hero__sub');

  // Split title to chars
  const chars = splitTextToChars(heroTitle);

  gsap.timeline({ delay: 0.2 })
    .to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: 'power3.out',
    })
    .to(heroSub, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.3');
}

/* ═══════════════════════════════════════════════════
   HERO PARALLAX
   ═══════════════════════════════════════════════════ */
if (!prefersReduced) {
  gsap.to('.hero__img-wrap', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });
}

/* ═══════════════════════════════════════════════════
   INTRO STATEMENT
   ═══════════════════════════════════════════════════ */
gsap.to('.intro-statement__text', {
  opacity: 1,
  y: 0,
  duration: 1.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.intro-statement',
    start: 'top 70%',
  }
});

/* ═══════════════════════════════════════════════════
   GALLERY — STAGGER REVEAL
   ═══════════════════════════════════════════════════ */
document.querySelectorAll('.gallery-item').forEach((item, i) => {
  gsap.to(item, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 85%',
    },
    delay: (i % 2) * 0.1, // Stagger effect for items in the same row
  });
});

// Parallax for gallery images
if (!prefersReduced) {
  document.querySelectorAll('.gallery-item__img img').forEach((img) => {
    gsap.to(img, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   COLLAGE — REVEAL + PARALLAX
   ═══════════════════════════════════════════════════ */
document.querySelectorAll('.collage__item').forEach((item, i) => {
  gsap.to(item, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 85%',
    },
    delay: (i % 3) * 0.1,
  });
});

// Differential parallax on collage items
if (!prefersReduced) {
  document.querySelectorAll('.collage__item').forEach((item) => {
    const speed = parseFloat(item.dataset.speed) || 1;
    const yDelta = (speed - 1) * 60;
    gsap.to(item, {
      y: yDelta,
      ease: 'none',
      scrollTrigger: {
        trigger: '.collage__grid',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   MOMENTS BENTO — STAGGER REVEAL
   ═══════════════════════════════════════════════════ */
gsap.to('.bento-card', {
  clipPath: 'inset(0 0 0% 0)',
  duration: 0.9,
  ease: 'power3.out',
  stagger: 0.12,
  scrollTrigger: {
    trigger: '.moments__grid',
    start: 'top 80%',
  }
});

/* ═══════════════════════════════════════════════════
   QUOTE — WORD BY WORD + LINES
   ═══════════════════════════════════════════════════ */
const quoteWords = document.querySelectorAll('.qw');

// Lines draw
gsap.to('.quote-line--top', {
  width: '100%',
  duration: 1.2,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.quote-section', start: 'top 70%' }
});

gsap.to(quoteWords, {
  opacity: 1,
  y: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.quote-section', start: 'top 60%' }
});

gsap.to('.quote-line--bottom', {
  width: '100%',
  duration: 1.2,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.quote-section', start: 'top 40%' }
});

/* ═══════════════════════════════════════════════════
   FINAL — CONTENT REVEAL + FADE
   ═══════════════════════════════════════════════════ */
if (!prefersReduced) {
  gsap.to('.final__img-wrap', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.final',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    }
  });
}

gsap.to('.final__content', {
  opacity: 1,
  duration: 1.2,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.final',
    start: 'top 60%',
  }
});

// Fade out at end
gsap.to('.final__fade', {
  opacity: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: '.final',
    start: '80% bottom',
    end: 'bottom bottom',
    scrub: 1,
  }
});

/* ═══════════════════════════════════════════════════
   CLOSING REVEAL
   ═══════════════════════════════════════════════════ */
gsap.to('.closing', {
  opacity: 1,
  duration: 1.2,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.closing',
    start: 'top 80%',
  }
});

/* ═══════════════════════════════════════════════════
   BACK TO TOP — SMOOTH SCROLL
   ═══════════════════════════════════════════════════ */
document.getElementById('backToTop').addEventListener('click', (e) => {
  e.preventDefault();
  if (lenis) {
    lenis.scrollTo(0, { duration: 2.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

/* ═══════════════════════════════════════════════════
   IMAGE FALLBACK
   ═══════════════════════════════════════════════════ */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.background = 'linear-gradient(135deg, #E7E1D7 0%, #A7A099 100%)';
    this.style.minHeight = '200px';
    this.removeAttribute('src');
  });
});