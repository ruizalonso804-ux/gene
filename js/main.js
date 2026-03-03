/* ═══════════════════════════════════════════════════
   NUESTRA HISTORIA — main.js
   GSAP + ScrollTrigger + Lenis smooth scroll
   ═══════════════════════════════════════════════════ */

/* ── Reduced motion check ─────────────────────────── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Lenis smooth scroll ──────────────────────────── */
let lenis;
if (!prefersReduced) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  // Sync Lenis with GSAP ticker
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // Let ScrollTrigger know about Lenis
  lenis.on('scroll', ScrollTrigger.update);
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
   CHAPTERS — PINNED SCROLL
   ═══════════════════════════════════════════════════ */
const chapterItems    = document.querySelectorAll('.chapter-item');
const chapterImgItems = document.querySelectorAll('.chapter-img-item');
const numChapters = chapterItems.length;

function setChapter(idx) {
  chapterItems.forEach((el, i) => {
    const active = i === idx;
    gsap.to(el, { opacity: active ? 1 : 0, y: active ? 0 : (i < idx ? -20 : 20), duration: 0.6, ease: 'power2.out' });
    if (active) {
      el.classList.add('active');
      el.style.position = 'relative';
    } else {
      el.classList.remove('active');
      el.style.position = 'absolute';
    }
  });

  chapterImgItems.forEach((el, i) => {
    gsap.to(el, {
      clipPath: i === idx ? 'inset(0 0% 0 0)' : (i < idx ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)'),
      duration: 0.9,
      ease: 'power3.inOut',
    });
  });
}

// Initialize first
chapterImgItems[0].style.clipPath = 'inset(0 0% 0 0)';

// Parallax on chapter images
if (!prefersReduced) {
  chapterImgItems.forEach(item => {
    gsap.to(item.querySelector('.chapter-img-inner'), {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.chapters',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      }
    });
  });
}

// ScrollTrigger: detect which chapter panel is visible
const chaptersSpacer = document.querySelector('.chapters__spacer');
const chapterHeight = chaptersSpacer.offsetHeight;
const panelHeight = chapterHeight / numChapters;

ScrollTrigger.create({
  trigger: '.chapters',
  start: 'top top',
  end: `+=${chapterHeight}`,
  scrub: false,
  pin: '.chapters__sticky',
  onUpdate: (self) => {
    const newIdx = Math.min(numChapters - 1, Math.floor(self.progress * numChapters));
    const currentActive = document.querySelector('.chapter-item.active');
    const currentIdx = currentActive ? parseInt(currentActive.dataset.chapter) : 0;
    if (newIdx !== currentIdx) {
      setChapter(newIdx);
    }
  }
});

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
