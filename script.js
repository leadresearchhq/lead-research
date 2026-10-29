// Lead Research HQ - Scroll Animations & Qualification Mini-Game

document.addEventListener('DOMContentLoaded', () => {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- OUTREACH PAGE PERSONALIZATION LOGIC ---
  const companyLabel = document.getElementById('company-label');
  const replyBtn = document.getElementById('reply-btn');

  if (companyLabel || replyBtn) {
    const urlParams = new URLSearchParams(window.location.search);
    let companyParam = urlParams.get('company');

    let companyName = 'you';
    let labelText = 'MADE FOR YOU';

    if (companyParam) {
      companyParam = companyParam.trim();
      if (companyParam.length > 0) {
        // Cut to 40 characters
        companyParam = companyParam.slice(0, 40);
        companyName = companyParam;
        labelText = `MADE FOR ${companyParam.toUpperCase()}`;
      }
    }

    if (companyLabel) {
      companyLabel.textContent = labelText;
    }

    if (replyBtn) {
      const email = 'leadresearchhq@gmail.com';
      const subject = `Pilot for ${companyName}`;
      replyBtn.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    }
  }

  // Initialize Card Animation State Trackers
  const stepTriggered = {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false
  };

  // --- STEP 3 SETUP: Scale Grid (60 Squares) ---
  const scaleGrid = document.getElementById('scale-grid');
  if (scaleGrid) {
    for (let i = 0; i < 60; i++) {
      const square = document.createElement('div');
      square.classList.add('scale-square');
      scaleGrid.appendChild(square);
    }
  }

  // --- STEP 4 SETUP: Filter Grid (40 Squares) ---
  const filterGrid = document.getElementById('filter-grid');
  // Define which of the 40 squares are kept (approx 28 kept, 12 removed)
  const keptIndices = new Set([
    0, 1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 15, 16, 17, 18,
    20, 21, 22, 24, 25, 27, 28, 29, 31, 33, 34, 37
  ]);

  if (filterGrid) {
    for (let i = 0; i < 40; i++) {
      const square = document.createElement('div');
      square.classList.add('filter-square');
      square.dataset.index = i;
      filterGrid.appendChild(square);
    }
  }

  // --- INTERSECTION OBSERVER SETUP ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.35
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const id = entry.target.id;

        if (prefersReducedMotion) {
          // Immediately complete animations if reduced motion is requested
          triggerReducedMotionState(id);
          return;
        }

        if (id === 'step-2' && !stepTriggered.step2) {
          stepTriggered.step2 = true;
          animateStep2();
        } else if (id === 'step-3' && !stepTriggered.step3) {
          stepTriggered.step3 = true;
          animateStep3();
        } else if (id === 'step-4' && !stepTriggered.step4) {
          stepTriggered.step4 = true;
          animateStep4();
        } else if (id === 'step-5' && !stepTriggered.step5) {
          stepTriggered.step5 = true;
          animateStep5();
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card-step').forEach(card => {
    observer.observe(card);
  });

  // --- ANIMATION LOGIC FOR STEPS ---

  // Step 2: Verify Checklist animation (ticks on one by one)
  function animateStep2() {
    const checkItems = document.querySelectorAll('.check-item');
    checkItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('active');
      }, index * 350);
    });
  }

  // Step 3: Scale animation (Counter 0 to 500+ and 60 squares fill)
  function animateStep3() {
    const countEl = document.getElementById('scale-count');
    const squares = document.querySelectorAll('.scale-square');
    const totalDuration = 1800; // ms
    const totalSquares = squares.length;
    const targetCount = 500;

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / totalDuration, 1);

      // Update count
      const currentCount = Math.floor(progress * targetCount);
      if (countEl) countEl.textContent = currentCount;

      // Fill squares proportionally
      const filledCount = Math.floor(progress * totalSquares);
      squares.forEach((sq, idx) => {
        if (idx < filledCount) {
          sq.classList.add('filled');
        }
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (countEl) countEl.textContent = '500';
      }
    }

    requestAnimationFrame(step);
  }

  // Step 4: Filter animation (some turn green, others shrink & fade)
  function animateStep4() {
    const squares = document.querySelectorAll('.filter-square');
    const counterEl = document.getElementById('filter-counter');
    let keptCount = 0;

    squares.forEach((sq, idx) => {
      setTimeout(() => {
        if (keptIndices.has(idx)) {
          sq.classList.add('kept');
          keptCount++;
          if (counterEl) counterEl.textContent = `${keptCount} of 40 kept`;
        } else {
          sq.classList.add('removed');
        }
      }, idx * 40);
    });
  }

  // Step 5: Deliver Spreadsheet (5 rows slide in sequentially)
  function animateStep5() {
    const rows = document.querySelectorAll('.sheet-row');
    rows.forEach((row, index) => {
      setTimeout(() => {
        row.classList.add('visible');
      }, index * 200);
    });
  }

  // Fallback / Reduced motion helper
  function triggerReducedMotionState(stepId) {
    if (stepId === 'step-2') {
      document.querySelectorAll('.check-item').forEach(item => item.classList.add('active'));
    } else if (stepId === 'step-3') {
      const countEl = document.getElementById('scale-count');
      if (countEl) countEl.textContent = '500';
      document.querySelectorAll('.scale-square').forEach(sq => sq.classList.add('filled'));
    } else if (stepId === 'step-4') {
      const squares = document.querySelectorAll('.filter-square');
      squares.forEach((sq, idx) => {
        if (keptIndices.has(idx)) {
          sq.classList.add('kept');
        } else {
          sq.classList.add('removed');
        }
      });
      const counterEl = document.getElementById('filter-counter');
      if (counterEl) counterEl.textContent = `${keptIndices.size} of 40 kept`;
    } else if (stepId === 'step-5') {
      document.querySelectorAll('.sheet-row').forEach(row => row.classList.add('visible'));
    }
  }

  // --- STEP 6: MINI GAME LOGIC ---

  // Lead Data Pool
  const nichesPool = [
    { title: 'Online Fitness Coach', valid: true },
    { title: 'Online PT', valid: true },
    { title: 'Nutrition Coach', valid: true },
    { title: 'SaaS Founder', valid: false },
    { title: 'Real Estate Agent', valid: false },
    { title: 'Life Coach', valid: false },
    { title: 'Crypto Trader', valid: false },
    { title: 'E-commerce Brand', valid: false }
  ];

  const contactPool = [
    { text: 'found (email & phone)', valid: true },
    { text: 'found (IG DM)', valid: true },
    { text: 'missing', valid: false },
    { text: 'not available', valid: false }
  ];

  const postPool = [
    { text: '2 days ago', valid: true },
    { text: '1 day ago', valid: true },
    { text: '5 hours ago', valid: true },
    { text: '3 weeks ago', valid: true },
    { text: '5 months ago', valid: false },
    { text: '1 year ago', valid: false },
    { text: 'Never', valid: false }
  ];

  const firstNames = ['Alex', 'Sarah', 'Jordan', 'Taylor', 'Chris', 'Morgan', 'Sam', 'David', 'Jessica', 'Michael', 'Emma', 'Daniel'];
  const lastInitials = ['M.', 'K.', 'R.', 'S.', 'T.', 'B.', 'W.', 'L.', 'P.'];

  // Game state
  let score = 0;
  let timer = 30;
  let timerInterval = null;
  let currentLead = null;
  let gameActive = false;

  // Game UI elements
  const gameStartScreen = document.getElementById('game-start-screen');
  const gamePlayScreen = document.getElementById('game-play-screen');
  const gameOverScreen = document.getElementById('game-over-screen');
  const startGameBtn = document.getElementById('start-game-btn');
  const restartGameBtn = document.getElementById('restart-game-btn');
  const scoreEl = document.getElementById('game-score');
  const timerEl = document.getElementById('game-timer');
  const finalScoreEl = document.getElementById('final-score');
  const feedbackEl = document.getElementById('game-feedback-text');

  const leadCardEl = document.getElementById('lead-card');
  const leadNameEl = document.getElementById('lead-name');
  const leadNicheEl = document.getElementById('lead-niche');
  const leadContactEl = document.getElementById('lead-contact');
  const leadPostEl = document.getElementById('lead-post');

  const btnSkip = document.getElementById('btn-skip');
  const btnKeep = document.getElementById('btn-keep');

  function generateRandomLead() {
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}`;
    const nicheObj = nichesPool[Math.floor(Math.random() * nichesPool.length)];
    const contactObj = contactPool[Math.floor(Math.random() * contactPool.length)];
    const postObj = postPool[Math.floor(Math.random() * postPool.length)];

    // Rule: Fitness Coach / Online PT / Nutrition Coach AND contact found AND recent post
    const isValid = nicheObj.valid && contactObj.valid && postObj.valid;

    return {
      name,
      niche: nicheObj.title,
      contact: contactObj.text,
      post: postObj.text,
      isValid
    };
  }

  function displayNextLead() {
    currentLead = generateRandomLead();
    if (leadNameEl) leadNameEl.textContent = currentLead.name;
    if (leadNicheEl) leadNicheEl.textContent = currentLead.niche;
    if (leadContactEl) leadContactEl.textContent = currentLead.contact;
    if (leadPostEl) leadPostEl.textContent = currentLead.post;
  }

  function handlePlayerChoice(action) {
    if (!gameActive || !currentLead) return;

    // action is 'keep' or 'skip'
    const isKeep = (action === 'keep');
    const isCorrect = (isKeep === currentLead.isValid);

    if (isCorrect) {
      score += 10;
      flashCardBorder('green');
    } else {
      score -= 5;
      flashCardBorder('red');
    }

    if (scoreEl) scoreEl.textContent = score;
    displayNextLead();
  }

  function flashCardBorder(type) {
    if (!leadCardEl) return;
    leadCardEl.classList.remove('flash-green', 'flash-red');
    // Force reflow
    void leadCardEl.offsetWidth;

    if (type === 'green') {
      leadCardEl.classList.add('flash-green');
    } else {
      leadCardEl.classList.add('flash-red');
    }

    setTimeout(() => {
      leadCardEl.classList.remove('flash-green', 'flash-red');
    }, 250);
  }

  function startGame() {
    score = 0;
    timer = 30;
    gameActive = true;

    if (scoreEl) scoreEl.textContent = '0';
    if (timerEl) timerEl.textContent = '30';

    if (gameStartScreen) gameStartScreen.classList.add('hidden');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    if (gamePlayScreen) gamePlayScreen.classList.remove('hidden');

    displayNextLead();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timer--;
      if (timerEl) timerEl.textContent = timer;

      if (timer <= 0) {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    gameActive = false;
    if (timerInterval) clearInterval(timerInterval);

    if (gamePlayScreen) gamePlayScreen.classList.add('hidden');
    if (gameOverScreen) gameOverScreen.classList.remove('hidden');

    if (finalScoreEl) finalScoreEl.textContent = score;

    if (feedbackEl) {
      if (score >= 60) {
        feedbackEl.textContent = 'Outstanding! You have a sharp eye for qualified leads.';
      } else if (score >= 30) {
        feedbackEl.textContent = 'Good job! A bit more practice and you will be a lead research pro.';
      } else {
        feedbackEl.textContent = 'Lead research is tricky! Let Lead Research HQ handle the heavy lifting for you.';
      }
    }
  }

  // Event Listeners for Game Buttons
  if (startGameBtn) startGameBtn.addEventListener('click', startGame);
  if (restartGameBtn) restartGameBtn.addEventListener('click', startGame);

  if (btnSkip) {
    btnSkip.addEventListener('click', () => handlePlayerChoice('skip'));
  }

  if (btnKeep) {
    btnKeep.addEventListener('click', () => handlePlayerChoice('keep'));
  }
});
