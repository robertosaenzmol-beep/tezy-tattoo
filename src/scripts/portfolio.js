import { $, $$, go } from './utils.js';
import { pick, likeWork } from './form.js';

/* ---------- Filtros del portfolio ---------- */
let fA = 'todos', fE = 'todos';
function filter() {
  let n = 0;
  $$('.tile').forEach((t) => { const ok = (fA === 'todos' || t.dataset.a === fA) && (fE === 'todos' || t.dataset.e === fE); t.style.display = ok ? '' : 'none'; n += ok; });
  $('#empty').style.display = n ? 'none' : 'block';
}
function bindRow(el, cb) {
  el.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (!b) return; el.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', c === b)); cb(b.dataset.v); });
}
bindRow($('#fa'), (v) => { fA = v; filter(); });
bindRow($('#fe'), (v) => { fE = v; filter(); });
function setFilterArtist(id) { fA = id; $$('#fa .chip').forEach((c) => c.setAttribute('aria-pressed', c.dataset.v === id)); filter(); }

/* ---------- "Quiero algo así" ---------- */
$('#grid').addEventListener('click', (e) => {
  const b = e.target.closest('[data-like]'); if (!b) return;
  const t = b.closest('.tile'); likeWork(+b.dataset.like, t.dataset.a, t.dataset.e);
});

/* ---------- Botones de artistas ---------- */
$('#artists').addEventListener('click', (e) => {
  const s = e.target.closest('[data-see]'), k = e.target.closest('[data-ask]');
  if (s) { setFilterArtist(s.dataset.see); go('trabajos'); }
  if (k) { pick('artista', k.dataset.ask); go('idea'); }
});
