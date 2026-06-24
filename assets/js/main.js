/* JICON Construction — interactions + lead capture */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Year ---- */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---- Lightweight conversion tracking (ready for GA4 / Google Ads) ---- */
  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    try {
      window.dataLayer.push(Object.assign({ event: event }, data || {}));
      if (typeof window.gtag === 'function') window.gtag('event', event, data || {});
    } catch (e) {}
  }

  /* ---- Mobile nav ---- */
  var burger = $('#hamburger'), nav = $('#nav');
  function closeNav() {
    if (!nav) return;
    nav.classList.remove('open'); burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
  }

  /* ---- Sticky header + floating CTA ---- */
  var header = $('#header'), floatCta = $('#floatCta');
  function onScroll() {
    var sy = window.scrollY;
    if (header) header.classList.toggle('scrolled', sy > 24);
    if (floatCta) floatCta.classList.toggle('show', sy > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Gallery filter ---- */
  var filters = $('#filters'), cards = $$('.gcard');
  if (filters) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter'); if (!btn) return;
      $$('.filter', filters).forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.getAttribute('data-filter');
      cards.forEach(function (c) {
        c.classList.toggle('hide', !(f === 'all' || c.getAttribute('data-cat') === f));
      });
    });
  }

  /* ---- Lightbox ---- */
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbClose = $('#lbClose');
  cards.forEach(function (c) {
    c.addEventListener('click', function () {
      var img = c.querySelector('img'); if (!img) return;
      lbImg.src = img.src; lbImg.alt = img.alt;
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    });
  });
  function closeLb() { if (lb) { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; } }
  if (lb) {
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = $$('.section__head, .svc, .step, .gcard, .about__media, .about__body, .areas li, .reviews__stars, .strip__item, .leadcard, .leadmag__form');
  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = Math.min((i % 6) * 60, 360) + 'ms';
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add('in'); }); }

  /* =========================================================
     QUOTE WIZARD
     ========================================================= */
  var wiz = $('#wiz');
  var wizBar = $('#wizBar'), wizStepText = $('#wizStepText');
  var wizBack = $('#wizBack'), wizFoot = $('#wizFoot');
  var wizSummary = $('#wizSummary'), wizForm = $('#wizForm');
  var steps = $$('.wiz__step', wiz);
  var ORDER = ['1', '2', '3', '4', '5', 'done'];
  var TOTAL = 5;
  var answers = {}, openedFrom = '';
  var curIdx = 0;

  function bodyLock(on) { document.body.style.overflow = on ? 'hidden' : ''; }

  function showStep(key) {
    steps.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-step') === key); });
    var n = ORDER.indexOf(key);
    curIdx = n;
    var stepNum = key === 'done' ? TOTAL : n + 1;
    wizBar.style.width = (key === 'done' ? 100 : (stepNum / TOTAL) * 100) + '%';
    if (key === 'done') {
      wizStepText.textContent = 'Complete';
      wizFoot.style.display = 'none';
    } else {
      wizStepText.textContent = 'Step ' + stepNum + ' of ' + TOTAL;
      wizFoot.style.display = 'flex';
      wizBack.style.visibility = stepNum > 1 ? 'visible' : 'hidden';
    }
    if (key === '5') renderSummary();
    var firstInput = key === '5' ? $('input[name="name"]', wizForm) : null;
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 350);
  }

  function renderSummary() {
    var bits = [];
    if (answers.project) bits.push('<b>' + answers.project + '</b>');
    if (answers.property) bits.push(answers.property);
    if (answers.timeline) bits.push(answers.timeline);
    if (answers.budget) bits.push(answers.budget);
    if (bits.length) {
      wizSummary.innerHTML = 'Your project: ' + bits.join(' · ');
      wizSummary.classList.add('show');
    } else { wizSummary.classList.remove('show'); }
  }

  function openWiz(source) {
    openedFrom = source || 'unknown';
    answers = {};
    $$('.wiz__opt', wiz).forEach(function (o) { o.classList.remove('sel'); });
    if (wizForm) wizForm.reset();
    showStep('1');
    wiz.classList.add('open'); wiz.setAttribute('aria-hidden', 'false');
    bodyLock(true);
    track('quote_open', { source: openedFrom });
  }
  function closeWiz() {
    wiz.classList.remove('open'); wiz.setAttribute('aria-hidden', 'true'); bodyLock(false);
  }

  // Option buttons (auto-advance)
  $$('.wiz__grid', wiz).forEach(function (grid) {
    var field = grid.getAttribute('data-field');
    grid.addEventListener('click', function (e) {
      var opt = e.target.closest('.wiz__opt'); if (!opt) return;
      $$('.wiz__opt', grid).forEach(function (o) { o.classList.remove('sel'); });
      opt.classList.add('sel');
      answers[field] = opt.getAttribute('data-value');
      track('quote_step', { step: curIdx + 1, field: field, value: answers[field] });
      var nextKey = ORDER[curIdx + 1];
      setTimeout(function () { showStep(nextKey); }, 240);
    });
  });

  if (wizBack) wizBack.addEventListener('click', function () {
    if (curIdx > 0) showStep(ORDER[curIdx - 1]);
  });
  $('#wizClose').addEventListener('click', closeWiz);
  wiz.addEventListener('click', function (e) { if (e.target === wiz) closeWiz(); });

  // Submit (step 5)
  if (wizForm) {
    wizForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('input[name="name"]', wizForm);
      var phone = $('input[name="phone"]', wizForm);
      var ok = true;
      [name, phone].forEach(function (f) {
        var bad = !f.value.trim();
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) { name.value.trim() ? phone.focus() : name.focus(); return; }

      answers.name = name.value.trim();
      answers.phone = phone.value.trim();
      answers.email = ($('input[name="email"]', wizForm).value || '').trim();
      answers.message = ($('textarea[name="message"]', wizForm).value || '').trim();
      answers.source = openedFrom;

      var submitBtn = $('#wizSubmit');
      submitBtn.disabled = true; submitBtn.textContent = 'Sending…';

      function done() {
        track('quote_submit', { source: openedFrom, project: answers.project, timeline: answers.timeline, budget: answers.budget });
        submitBtn.disabled = false; submitBtn.textContent = 'Get My Free Estimate →';
        showStep('done');
      }

      var action = wizForm.getAttribute('action') || '';
      var configured = action.indexOf('formspree.io') > -1 && action.indexOf('your-form-id') === -1;

      if (configured) {
        var fd = new FormData();
        fd.append('name', answers.name); fd.append('phone', answers.phone); fd.append('email', answers.email);
        fd.append('project', answers.project || ''); fd.append('property', answers.property || '');
        fd.append('timeline', answers.timeline || ''); fd.append('budget', answers.budget || '');
        fd.append('message', answers.message); fd.append('_subject', 'New Quote Request — ' + (answers.project || 'JICON'));
        fetch(action, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
          .then(done).catch(done);
      } else {
        // Fallback: open email client pre-filled with all answers
        var body =
          'NEW QUOTE REQUEST\n\n' +
          'Project: ' + (answers.project || '') + '\n' +
          'Property: ' + (answers.property || '') + '\n' +
          'Timeline: ' + (answers.timeline || '') + '\n' +
          'Budget: ' + (answers.budget || '') + '\n\n' +
          'Name: ' + answers.name + '\n' +
          'Phone: ' + answers.phone + '\n' +
          'Email: ' + answers.email + '\n\n' +
          'Details: ' + answers.message + '\n';
        var mailto = 'mailto:getJICON@gmail.com?subject=' +
          encodeURIComponent('Free Quote Request — ' + (answers.project || 'JICON Construction')) +
          '&body=' + encodeURIComponent(body);
        // open mail client in a new tab so the success screen still shows
        var w = window.open(mailto, '_blank');
        if (!w) window.location.href = mailto;
        done();
      }
    });
  }

  /* ---- Universal quote triggers ---- */
  $$('[data-quote]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      closeExit(); closeNav();
      openWiz(el.getAttribute('data-quote'));
    });
  });

  /* =========================================================
     EXIT-INTENT POPUP
     ========================================================= */
  var exitPop = $('#exitPop');
  function showExit() {
    if (!exitPop) return;
    if (sessionStorage.getItem('jiconExit') === '1') return;
    if (wiz.classList.contains('open')) return;
    exitPop.classList.add('open'); exitPop.setAttribute('aria-hidden', 'false');
    sessionStorage.setItem('jiconExit', '1');
    track('exit_intent_shown', {});
  }
  function closeExit() {
    if (exitPop) { exitPop.classList.remove('open'); exitPop.setAttribute('aria-hidden', 'true'); }
  }
  if (exitPop) {
    $('#exitClose').addEventListener('click', closeExit);
    exitPop.addEventListener('click', function (e) { if (e.target === exitPop) closeExit(); });
    // Desktop: pointer leaves toward the top of the viewport
    if (window.matchMedia('(min-width:681px)').matches) {
      document.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget && e.clientY <= 0) showExit();
      });
    } else {
      // Mobile: show once after meaningful scroll + dwell
      var fired = false;
      window.addEventListener('scroll', function () {
        if (fired) return;
        if (window.scrollY > document.body.scrollHeight * 0.45) { fired = true; setTimeout(showExit, 600); }
      }, { passive: true });
    }
  }

  /* =========================================================
     LEAD MAGNET (free guide)
     ========================================================= */
  var guideForm = $('#guideForm'), guideNote = $('#guideNote');
  if (guideForm) {
    guideForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('input[name="name"]', guideForm).value || '').trim();
      var email = ($('input[name="email"]', guideForm).value || '').trim();
      if (!name || !email) return;
      track('lead_magnet_submit', { email: email });

      // Deliver the guide (opens the printable guide page)
      window.open('guide.html', '_blank');
      guideForm.reset();
      guideNote.textContent = 'Done! Your guide is opening in a new tab. Check there to read or save it.';
      guideNote.className = 'leadmag__note ok';
    });
  }

  /* ---- Global ESC / key handling ---- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeLb(); closeExit(); if (wiz.classList.contains('open')) closeWiz(); }
  });
})();
