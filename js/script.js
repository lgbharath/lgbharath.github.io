/* ===================================
   LG BHARATH – PORTFOLIO SCRIPTS
   All code runs inside DOMContentLoaded so every element
   exists and all variables are in one predictable scope.
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────
     PARTICLE CANVAS
  ───────────────────────────────────── */
  (function initParticles() {
    var canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function createParticle() {
      return {
        x: rand(0, W), y: rand(0, H),
        r: rand(0.5, 1.8),
        vx: rand(-0.25, 0.25), vy: rand(-0.4, -0.1),
        alpha: rand(0.15, 0.55),
        color: Math.random() > 0.6 ? '34,211,238' : '59,130,246'
      };
    }

    function init() {
      var count = Math.min(120, Math.floor((W * H) / 12000));
      particles = Array.from({ length: count }, createParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5)    { p.y = H + 5; p.x = rand(0, W); }
        if (p.x < -5)    { p.x = W + 5; }
        if (p.x > W + 5) { p.x = -5; }
      });
      requestAnimationFrame(draw);
    }

    resize(); init(); draw();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resize(); init(); }, 200);
    });
  }());


  /* ─────────────────────────────────────
     BACK-TO-TOP  (defined before navbar uses it)
  ───────────────────────────────────── */
  var backBtn = document.getElementById('backToTop');

  function updateBackToTop() {
    if (!backBtn) return;
    if (window.scrollY > 400) backBtn.classList.add('visible');
    else backBtn.classList.remove('visible');
  }

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ─────────────────────────────────────
     NAVBAR
  ───────────────────────────────────── */
  (function initNavbar() {
    var navbar    = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var navLinks  = document.getElementById('navLinks');
    if (!navbar || !hamburger || !navLinks) return;

    var links    = navLinks.querySelectorAll('.nav-link');
    var sections = ['home', 'about', 'skills', 'projects', 'education', 'contact'];

    function updateActiveLink() {
      var current = 'home';
      var scrollY = window.scrollY + 100;
      sections.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      });
      links.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }

    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
      updateActiveLink();
      updateBackToTop();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    // Mobile hamburger toggle
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Smooth scroll for all internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id     = anchor.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      });
    });
  }());


  /* ─────────────────────────────────────
     TYPING ANIMATION
  ───────────────────────────────────── */
  (function initTyping() {
    var el = document.getElementById('typedText');
    if (!el) return;

    var phrases = [
      'Full Stack Developer',
      'Java Developer',
      'Web Developer',
      'Problem Solver',
      'B.Tech CSE Student'
    ];

    var pIdx = 0, cIdx = 0, deleting = false;
    var SPEED_TYPE = 80, SPEED_DEL = 45, PAUSE_END = 1600, PAUSE_START = 350;

    function tick() {
      var phrase = phrases[pIdx];
      if (!deleting) {
        cIdx++;
        el.textContent = phrase.slice(0, cIdx);
        if (cIdx === phrase.length) {
          deleting = true;
          setTimeout(tick, PAUSE_END);
          return;
        }
      } else {
        cIdx--;
        el.textContent = phrase.slice(0, cIdx);
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          setTimeout(tick, PAUSE_START);
          return;
        }
      }
      setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
    }
    tick();
  }());


  /* ─────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────── */
  (function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Hero elements are in the viewport from the start – show them immediately
    // so there is never a blank hero on first paint.
    var heroEls = document.querySelectorAll('.hero .reveal');
    heroEls.forEach(function (el, i) {
      el.style.transitionDelay = i * 0.08 + 's';
      // Use rAF so the initial opacity:0 paint completes first,
      // giving us the fade-in rather than a flash.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { el.classList.add('visible'); });
      });
    });

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Observe only non-hero reveals with a stagger delay
    var sectionEls = document.querySelectorAll('.section .reveal');
    sectionEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 5) * 0.09 + 's';
      io.observe(el);
    });
  }());


  /* ─────────────────────────────────────
     SKILL BAR & CGPA ANIMATIONS
  ───────────────────────────────────── */
  (function initSkillBars() {
    var targets = document.querySelectorAll('.skill-fill, .cgpa-fill');
    if (!targets.length || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('animated'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('animated');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    targets.forEach(function (t) { io.observe(t); });
  }());


  /* ─────────────────────────────────────
     STAT COUNT-UP
  ───────────────────────────────────── */
  (function initCountUp() {
    var stats = document.querySelectorAll('.stat-val');
    if (!stats.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el      = entry.target;
        var raw     = el.textContent.trim();
        var num     = parseFloat(raw);
        var suffix  = raw.replace(/[\d.]/g, '');
        if (isNaN(num)) return;

        var duration  = 1200;
        var startTime = null;
        var decimals  = num % 1 !== 0 ? 1 : 0;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = (num * eased).toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    stats.forEach(function (el) { io.observe(el); });
  }());


  /* ─────────────────────────────────────
     CONTACT FORM
  ───────────────────────────────────── */
  (function initContactForm() {
    var form      = document.getElementById('contactForm');
    var success   = document.getElementById('formSuccess');
    var submitBtn = document.getElementById('submitBtn');
    if (!form) return;

    function setError(inputId, errId, msg) {
      var el  = document.getElementById(inputId);
      var err = document.getElementById(errId);
      if (!el || !err) return false;
      var val = el.value.trim();
      if (!val) {
        err.textContent = msg; el.classList.add('error'); return false;
      }
      if (inputId === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        err.textContent = 'Please enter a valid email.'; el.classList.add('error'); return false;
      }
      err.textContent = ''; el.classList.remove('error'); return true;
    }

    ['name', 'email', 'subject', 'message'].forEach(function (id) {
      var el  = document.getElementById(id);
      var err = document.getElementById(id + 'Error');
      if (el && err) {
        el.addEventListener('input', function () {
          el.classList.remove('error');
          err.textContent = '';
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (success) success.classList.remove('show');

      var ok = [
        setError('name',    'nameError',    'Name is required.'),
        setError('email',   'emailError',   'Email is required.'),
        setError('subject', 'subjectError', 'Subject is required.'),
        setError('message', 'messageError', 'Message cannot be empty.')
      ].every(Boolean);

      if (!ok) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        var span = submitBtn.querySelector('span');
        if (span) span.textContent = 'Sending…';
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          var span = submitBtn.querySelector('span');
          if (span) span.textContent = 'Send Message';
        }
        if (success) success.classList.add('show');
        form.reset();
        setTimeout(function () {
          if (success) success.classList.remove('show');
        }, 6000);
      }, 1400);
    });
  }());


  /* ─────────────────────────────────────
     DOWNLOAD RESUME
  ───────────────────────────────────── */
  (function initDownloadResume() {
    var btn = document.getElementById('downloadResume');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var text = [
        'LG BHARATH',
        'Full Stack Developer | B.Tech CSE Student',
        '================================================',
        'Email    : lgbharath999@gmail.com',
        'LinkedIn : https://www.linkedin.com/in/lg-bharath-413877389',
        'GitHub   : https://github.com/lgbharath3006',
        '',
        'EDUCATION',
        '---------',
        'B.Tech Computer Science Engineering',
        'NITTE Meenakshi Institute of Technology, Bengaluru',
        'Year: Second Year (3rd Semester) | CGPA: 8.0 / 10.0',
        '',
        'SKILLS',
        '------',
        'HTML5 | CSS3 | JavaScript | Java | Python | SQL | Git | GitHub | Responsive Web Design',
        '',
        'PROJECTS',
        '--------',
        '1. Professional Portfolio Website   – HTML5, CSS3, JavaScript',
        '2. Student Management System        – Java, SQL, JDBC',
        '3. Weather Application              – JavaScript, REST API, CSS3',
        '4. Calculator Application           – HTML5, CSS3, JavaScript',
        '',
        'ABOUT',
        '-----',
        'Passionate CSE student who enjoys building modern web applications',
        'and solving real-world problems through code.',
      ].join('\n');

      var blob = new Blob([text], { type: 'text/plain' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      a.href     = url;
      a.download = 'LG_Bharath_Resume.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }());


  /* ─────────────────────────────────────
     CURSOR GLOW  (desktop only)
  ───────────────────────────────────── */
  (function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var glow = document.createElement('div');
    glow.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:9999',
      'width:320px', 'height:320px', 'border-radius:50%',
      'background:radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)',
      'transform:translate(-50%,-50%)', 'transition:opacity 0.4s', 'opacity:0'
    ].join(';');
    document.body.appendChild(glow);

    var mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY; glow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });

    function animateGlow() {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }());


  /* ─────────────────────────────────────
     PROJECT CARD 3-D TILT  (desktop only)
  ───────────────────────────────────── */
  (function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width  - 0.5;
        var y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform =
          'perspective(800px) rotateY(' + (x * 6) + 'deg) ' +
          'rotateX(' + (-y * 4) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }());

}); // end DOMContentLoaded
