// Lead Research HQ - Main Script

// Turnaround time constant for outreach page (can be changed as needed)
const DELIVERY_TIME = "48 hours";

document.addEventListener('DOMContentLoaded', () => {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- OUTREACH PAGE PERSONALIZATION LOGIC ---
  const companyLabel = document.getElementById('company-label');
  const replyBtn = document.getElementById('reply-btn');
  const deliveryTimeEl = document.getElementById('delivery-time-val');

  if (deliveryTimeEl) {
    deliveryTimeEl.textContent = DELIVERY_TIME;
  }

  if (companyLabel || replyBtn) {
    const urlParams = new URLSearchParams(window.location.search);
    let companyParam = urlParams.get('company');

    let companyName = '';
    let labelText = 'MADE FOR YOU';

    if (companyParam) {
      companyParam = companyParam.trim();
      if (companyParam.length > 0) {
        // Cut to 40 characters maximum
        companyParam = companyParam.slice(0, 40);
        companyName = companyParam;
        labelText = `MADE FOR ${companyParam.toUpperCase()}`;
      }
    }

    if (companyLabel) {
      // Use textContent only for safety
      companyLabel.textContent = labelText;
    }

    if (replyBtn) {
      const email = 'leadresearchhq@gmail.com';
      const subject = companyName ? `Pilot for ${companyName}` : 'Pilot request';
      replyBtn.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    }
  }

  // --- STEP 3 SETUP: Scale Grid (60 Squares, 10 Columns) ---
  const scaleGrid = document.getElementById('scale-grid');
  if (scaleGrid) {
    for (let i = 0; i < 60; i++) {
      const square = document.createElement('div');
      square.classList.add('scale-square');
      scaleGrid.appendChild(square);
    }
  }

  // --- STEP 4 SETUP: Filter Grid (40 Squares, 8 Columns) ---
  const filterGrid = document.getElementById('filter-grid');
  // 28 kept squares, 12 removed squares
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

  // Animation trigger trackers so animations run once per section
  const stepTriggered = {
    step2: false,
    step3: false,
    step4: false,
    step5: false
  };

  // --- INTERSECTION OBSERVER SETUP ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const id = entry.target.id;

        if (prefersReducedMotion) {
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

  document.querySelectorAll('section.card').forEach(card => {
    observer.observe(card);
  });

  // --- ANIMATION FUNCTIONS ---

  // Step 2: Verification Checklist tick-on one by one
  function animateStep2() {
    const checkItems = document.querySelectorAll('#step-2 .check-item');
    checkItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('active');
      }, index * 350);
    });
  }

  // Step 3: Scale animation (Counter 0 to 500+ and 60 squares fill with amber)
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

      const currentCount = Math.floor(progress * targetCount);
      if (countEl) countEl.textContent = currentCount;

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

  // Step 4: Filter animation (28 turn green, 12 shrink and fade)
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

  // Step 5: Deliver Spreadsheet (5 rows slide in sequential order)
  function animateStep5() {
    const rows = document.querySelectorAll('#step-5 .sheet-row');
    rows.forEach((row, index) => {
      setTimeout(() => {
        row.classList.add('visible');
      }, index * 200);
    });
  }

  // Fallback for prefers-reduced-motion
  function triggerReducedMotionState(stepId) {
    if (stepId === 'step-2') {
      document.querySelectorAll('#step-2 .check-item').forEach(item => item.classList.add('active'));
    } else if (stepId === 'step-3') {
      const countEl = document.getElementById('scale-count');
      if (countEl) countEl.textContent = '500';
      document.querySelectorAll('.scale-square').forEach(sq => sq.classList.add('filled'));
    } else if (stepId === 'step-4') {
      document.querySelectorAll('.filter-square').forEach((sq, idx) => {
        if (keptIndices.has(idx)) {
          sq.classList.add('kept');
        } else {
          sq.classList.add('removed');
        }
      });
      const counterEl = document.getElementById('filter-counter');
      if (counterEl) counterEl.textContent = `${keptIndices.size} of 40 kept`;
    } else if (stepId === 'step-5') {
      document.querySelectorAll('#step-5 .sheet-row').forEach(row => row.classList.add('visible'));
    }
  }

  // --- STEP 6: MINI GAME LOGIC ("Qualify the list") ---

  const validNiches = ['Online Fitness Coach', 'Online PT', 'Nutrition Coach'];
  const invalidNiches = ['SaaS Founder', 'Real Estate Agent', 'Life Coach', 'Crypto Trader', 'E-commerce Brand'];

  const contactPool = [
    { text: 'found', valid: true },
    { text: 'missing', valid: false }
  ];

  const postPool = [
    { text: '2 days ago', valid: true },
    { text: '1 day ago', valid: true },
    { text: '5 hours ago', valid: true },
    { text: '5 months ago', valid: false },
    { text: '1 year ago', valid: false }
  ];

  const firstNames = ['Alex', 'Sarah', 'Jordan', 'Taylor', 'Chris', 'Morgan', 'Sam', 'David', 'Jessica', 'Michael', 'Emma', 'Daniel'];
  const lastInitials = ['M.', 'K.', 'R.', 'S.', 'T.', 'B.', 'W.', 'L.', 'P.'];

  let score = 0;
  let timer = 30;
  let timerInterval = null;
  let currentLead = null;
  let gameActive = false;

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

    // 50% chance valid niche, 50% chance invalid niche
    const isNicheValid = Math.random() < 0.5;
    const nicheList = isNicheValid ? validNiches : invalidNiches;
    const niche = nicheList[Math.floor(Math.random() * nicheList.length)];

    const contactObj = contactPool[Math.floor(Math.random() * contactPool.length)];
    const postObj = postPool[Math.floor(Math.random() * postPool.length)];

    // Qualification rule: niche is fitness coach/online PT/nutrition coach AND contact is found AND post is recent
    const isValid = isNicheValid && contactObj.valid && postObj.valid;

    return {
      name,
      niche,
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

  if (startGameBtn) startGameBtn.addEventListener('click', startGame);
  if (restartGameBtn) restartGameBtn.addEventListener('click', startGame);

  if (btnSkip) {
    btnSkip.addEventListener('click', () => handlePlayerChoice('skip'));
  }

  if (btnKeep) {
    btnKeep.addEventListener('click', () => handlePlayerChoice('keep'));
  }
});
