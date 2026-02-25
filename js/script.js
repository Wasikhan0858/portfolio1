/* ============================================================
   WASI KHAN — Portfolio Script
   Author: Wasi Khan
   Sections:
     1. Terminal Intro Animation
     2. Navbar (sticky + mobile toggle)
     3. Scroll-Triggered Fade-In Animations
     4. Skill Bar Animations
     5. GitHub Live Repos API Fetch
     6. Contact Form Validation
   ============================================================ */

/* === 1. TERMINAL INTRO ANIMATION === */
(function initTerminal() {
  const overlay     = document.getElementById('terminal-overlay');
  const output      = document.getElementById('terminal-output');
  const currentLine = document.getElementById('current-line');

  const lines = [
    '> Initializing portfolio...',
    '> Loading WASI KHAN.exe',
    '> Compiling operating systems modules...',
    '> Connecting to developer profile...',
    '> Access Granted.',
  ];

  document.body.classList.add('terminal-active');

  let lineIndex = 0;
  let charIndex = 0;
  let lineDelay = 0;

  /**
   * Type a single character into the current line element.
   * When the line is done, commit it to output and move to next.
   */
  function typeChar() {
    if (lineIndex >= lines.length) {
      // All lines typed — hide cursor, fade out terminal
      setTimeout(fadeOutTerminal, 900);
      return;
    }

    const fullLine = lines[lineIndex];

    if (charIndex < fullLine.length) {
      currentLine.textContent += fullLine[charIndex];
      charIndex++;

      // Randomise typing speed for realism
      const speed = fullLine[charIndex - 1] === '.' ? 120 : Math.random() * 45 + 25;
      setTimeout(typeChar, speed);
    } else {
      // Commit the finished line to output area
      const span = document.createElement('span');
      span.classList.add('t-line');
      if (lineIndex === lines.length - 1) {
        span.classList.add('done');
        span.style.color = '#00ffa3';
        span.style.fontWeight = '700';
      }
      span.textContent = fullLine;
      output.appendChild(span);

      // Trigger opacity animation
      requestAnimationFrame(() => {
        span.style.animation = 'lineAppear 0.05s ease forwards';
      });

      // Reset for next line
      currentLine.textContent = '';
      charIndex = 0;
      lineIndex++;

      // Small pause between lines
      const pause = lineIndex === lines.length ? 600 : 280;
      setTimeout(typeChar, pause);
    }
  }

  function fadeOutTerminal() {
    overlay.classList.add('fade-out');
    document.body.classList.remove('terminal-active');
    // Remove from DOM after transition
    overlay.addEventListener('transitionend', () => {
      overlay.style.display = 'none';
    }, { once: true });
  }

  // Small initial delay before typing starts
  setTimeout(typeChar, 600);
})();


/* === 2. NAVBAR === */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('a');

  // Scrolled class for compact navbar
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu toggle
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Highlight active link on scroll
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();


/* === 3. SCROLL-TRIGGERED FADE-IN === */
(function initScrollFade() {
  const targets = document.querySelectorAll('.fade-in-section');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => observer.observe(el));
})();


/* === 4. SKILL BAR ANIMATIONS === */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const width = bar.getAttribute('data-width') + '%';
          // Short delay for visual delight
          setTimeout(() => { bar.style.width = width; }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
})();


/* === 5. GITHUB LIVE REPOS API FETCH === */
(function initGithubRepos() {
  /**
   * Replace 'YOUR_GITHUB_USERNAME' with your actual GitHub username.
   * Example: 'wasikhan' or 'wasi-dev'
   */
  const GITHUB_USERNAME = 'YOUR_GITHUB_USERNAME';
  const REPO_LIMIT      = 6;
  const container       = document.getElementById('github-repos');

  if (!container) return;

  /**
   * Render a single repo card.
   * @param {Object} repo - GitHub repo object from API
   * @returns {HTMLElement}
   */
  function createRepoCard(repo) {
    const card = document.createElement('div');
    card.classList.add('repo-card');

    const name = document.createElement('div');
    name.classList.add('repo-name');
    name.textContent = `📁 ${repo.name}`;

    const desc = document.createElement('p');
    desc.classList.add('repo-desc');
    desc.textContent = repo.description || 'No description provided.';

    const link = document.createElement('a');
    link.classList.add('repo-link');
    link.href        = repo.html_url;
    link.target      = '_blank';
    link.rel         = 'noopener noreferrer';
    link.textContent = 'View on GitHub →';

    card.appendChild(name);
    card.appendChild(desc);
    card.appendChild(link);

    return card;
  }

  /**
   * Show a graceful error message inside the repos container.
   * @param {string} msg
   */
  function showError(msg) {
    container.innerHTML = `<div class="repo-error">⚠ ${msg}</div>`;
  }

  // Fetch repos from GitHub public API
  fetch(`https://api.github.com/users/${Wasikhan0858}/repos?sort=updated&per_page=30`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(repos => {
      // Filter to public repos only and limit count
      const publicRepos = repos
        .filter(r => !r.private && !r.fork)
        .slice(0, REPO_LIMIT);

      container.innerHTML = ''; // Clear loading spinner

      if (publicRepos.length === 0) {
        showError('No public repositories found.');
        return;
      }

      publicRepos.forEach((repo, i) => {
        const card = createRepoCard(repo);
        // Staggered animation
        card.style.opacity  = '0';
        card.style.transform = 'translateY(20px)';
        container.appendChild(card);

        setTimeout(() => {
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        }, i * 100 + 50);
      });
    })
    .catch(err => {
      console.error('[GitHub Repos]', err);
      showError(
        'Could not load GitHub repositories. ' +
        'Make sure your GitHub username is set correctly in script.js, ' +
        'or check your internet connection.'
      );
    });
})();


/* === 6. CONTACT FORM VALIDATION === */
(function initContactForm() {
  const form         = document.getElementById('contactForm');
  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const msgError     = document.getElementById('messageError');
  const successMsg   = document.getElementById('formSuccess');

  if (!form) return;

  /**
   * Validates a single field and sets error message.
   * @param {HTMLElement} input
   * @param {HTMLElement} errorEl
   * @param {Function} validator - returns error string or ''
   * @returns {boolean}
   */
  function validateField(input, errorEl, validator) {
    const msg = validator(input.value.trim());
    errorEl.textContent = msg;

    if (msg) {
      input.classList.add('error');
      return false;
    } else {
      input.classList.remove('error');
      return true;
    }
  }

  const validators = {
    name:    v => v.length < 2  ? 'Name must be at least 2 characters.' : '',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.',
    message: v => v.length < 10 ? 'Message must be at least 10 characters.' : '',
  };

  // Inline validation on blur
  nameInput.addEventListener('blur',    () => validateField(nameInput,    nameError,  validators.name));
  emailInput.addEventListener('blur',   () => validateField(emailInput,   emailError, validators.email));
  messageInput.addEventListener('blur', () => validateField(messageInput, msgError,   validators.message));

  // Clear error on focus
  [nameInput, emailInput, messageInput].forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameOk  = validateField(nameInput,    nameError,  validators.name);
    const emailOk = validateField(emailInput,   emailError, validators.email);
    const msgOk   = validateField(messageInput, msgError,   validators.message);

    if (nameOk && emailOk && msgOk) {
      // Simulate form submission (replace with actual API call / EmailJS / etc.)
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending...';

      setTimeout(() => {
        form.reset();
        successMsg.classList.add('visible');
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Message';

        setTimeout(() => successMsg.classList.remove('visible'), 5000);
      }, 1200);
    }
  });
})();
