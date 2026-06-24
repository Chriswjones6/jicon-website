/* JICON Construction — interactions */
(function () {
  'use strict';

  /* ---- Year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Mobile nav ---- */
  var burger = document.getElementById('hamburger');
  var nav = document.getElementById('nav');
  function closeNav() {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
  }

  /* ---- Sticky header shadow ---- */
  var header = document.getElementById('header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Gallery filter ---- */
  var filters = document.getElementById('filters');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.gcard'));
  if (filters) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;
      filters.querySelectorAll('.filter').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.getAttribute('data-filter');
      cards.forEach(function (c) {
        var show = f === 'all' || c.getAttribute('data-cat') === f;
        c.classList.toggle('hide', !show);
      });
    });
  }

  /* ---- Lightbox ---- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  cards.forEach(function (c) {
    c.addEventListener('click', function () {
      var img = c.querySelector('img');
      if (!img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    });
  });
  function closeLb() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
  }
  if (lb) {
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = [].concat(
    Array.prototype.slice.call(document.querySelectorAll(
      '.section__head, .svc, .step, .gcard, .about__media, .about__body, .areas li, .reviews__stars, .strip__item'
    ))
  );
  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = Math.min((i % 6) * 60, 360) + 'ms';
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Quote form: Formspree if configured, else mailto fallback ---- */
  var form = document.getElementById('quoteForm');
  var note = document.getElementById('quoteNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';
      var configured = action.indexOf('formspree.io') > -1 && action.indexOf('your-form-id') === -1;

      // Build a readable summary from the fields
      var data = new FormData(form);
      var name = (data.get('name') || '').toString();
      var phone = (data.get('phone') || '').toString();
      var email = (data.get('email') || '').toString();
      var service = (data.get('service') || '').toString();
      var message = (data.get('message') || '').toString();

      if (!configured) {
        // No Formspree wired up yet — fall back to the user's email client.
        e.preventDefault();
        var subject = 'Free Quote Request — ' + (service || 'JICON Construction');
        var body =
          'Name: ' + name + '\n' +
          'Phone: ' + phone + '\n' +
          'Email: ' + email + '\n' +
          'Service: ' + service + '\n\n' +
          'Project details:\n' + message + '\n';
        window.location.href = 'mailto:getJICON@gmail.com?subject=' +
          encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        if (note) { note.textContent = 'Opening your email app to send… or call 843-655-4121.'; note.className = 'quote__note ok'; }
        return;
      }

      // Formspree configured — submit via fetch for a clean inline confirmation.
      e.preventDefault();
      if (note) { note.textContent = 'Sending…'; note.className = 'quote__note'; }
      fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            note.textContent = 'Thanks! We got your request and will reply within one business day.';
            note.className = 'quote__note ok';
          } else {
            throw new Error('bad response');
          }
        })
        .catch(function () {
          note.textContent = 'Something went wrong. Please call us at 843-655-4121.';
          note.className = 'quote__note err';
        });
    });
  }
})();
