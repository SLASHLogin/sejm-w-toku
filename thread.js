(function () {
  'use strict';
  function norm(s) {
    var D = {'\u0105':'a','\u0107':'c','\u0119':'e','\u0142':'l','\u0144':'n','\u00f3':'o','\u015b':'s','\u017a':'z','\u017c':'z'};
    return String(s || '').toLowerCase().replace(/[\u0105\u0107\u0119\u0142\u0144\u00f3\u015b\u017a\u017c]/g, function (c) { return D[c] || c; });
  }

  // Bill thread: type chips + politician select
  var filters = document.getElementById('thread-filters');
  if (filters) {
    var events = Array.prototype.slice.call(document.querySelectorAll('#thread > .ev'));
    var active = { stage: true, statement: true, vote: true };
    var mp = '';
    function applyThread() {
      var shown = 0;
      events.forEach(function (el) {
        var ok = active[el.getAttribute('data-type')] &&
          (!mp || el.getAttribute('data-mp') === mp);
        el.classList.toggle('hidden', !ok);
        if (ok) shown++;
      });
      var count = document.getElementById('thread-count');
      if (count) count.textContent = shown + ' z ' + events.length + ' zdarzeń';
      var empty = document.getElementById('thread-empty');
      if (empty) empty.style.display = shown ? 'none' : 'block';
    }
    Array.prototype.forEach.call(filters.querySelectorAll('button[data-type]'), function (btn) {
      btn.addEventListener('click', function () {
        var t = btn.getAttribute('data-type');
        active[t] = !active[t];
        btn.setAttribute('aria-pressed', active[t] ? 'true' : 'false');
        applyThread();
      });
    });
    var select = document.getElementById('thread-mp');
    if (select) select.addEventListener('change', function () { mp = select.value; applyThread(); });
  }

  // Generic live filter over rows/cards carrying data-search
  function wireSearch(inputId, noresultsId, countId, itemSelector) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var items = Array.prototype.slice.call(document.querySelectorAll(itemSelector));
    var empty = document.getElementById(noresultsId);
    var count = document.getElementById(countId);
    function apply() {
      var q = norm(input.value.trim());
      var shown = 0;
      items.forEach(function (el) {
        var hay = el.getAttribute('data-search') || el.getAttribute('data-name') || el.getAttribute('data-club') || '';
        var ok = !q || norm(hay).indexOf(q) !== -1;
        el.classList.toggle('hidden', !ok);
        if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? 'none' : 'block';
      if (count) count.textContent = q ? 'Pokazano ' + shown + ' z ' + items.length : '';
    }
    input.addEventListener('input', apply);
  }
  wireSearch('q', 'noresults', 'count', '#rows tbody tr[data-search], #cards .card, .grid .card, .term-block table tbody tr');
  var clear = document.getElementById('clearq');
  if (clear) clear.addEventListener('click', function () {
    var input = document.getElementById('q');
    if (input) { input.value = ''; input.dispatchEvent(new Event('input')); }
  });

  // MPs index: term switcher + club filter + name search
  var chips = document.querySelectorAll('.term-chip');
  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      Array.prototype.forEach.call(chips, function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      var term = chip.getAttribute('data-term');
      Array.prototype.forEach.call(document.querySelectorAll('.term-block'), function (block) {
        block.style.display = block.getAttribute('data-term') === term ? '' : 'none';
      });
    });
  });
  var mpSearch = document.querySelector('.mp-search');
  if (mpSearch) mpSearch.addEventListener('input', function () {
    var block = mpSearch.closest('.term-block');
    var q = norm(mpSearch.value.trim());
    var shown = 0;
    Array.prototype.forEach.call(block.querySelectorAll('tbody tr'), function (row) {
      var ok = !q || norm(row.getAttribute('data-name') || '').indexOf(q) !== -1;
      row.classList.toggle('hidden', !ok);
      if (ok) shown++;
    });
  });
})();