import { USERS, STAGES, ORIGINS, CLIENTS } from '../data/demo.js';

/* ---------- Utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const VIEWS = [
  ['resumen', 'Resumen'], ['solicitudes', 'Solicitudes'], ['presupuestos', 'Por presupuestar'],
  ['agenda', 'Agenda'], ['clientes', 'Clientes'], ['recordatorios', 'Recordatorios'],
];
const COLOR = { ruben: 'var(--c-ruben)', a2: 'var(--c-a2)' };
const userById = (id) => USERS.find((u) => u.id === id);
const first = (n) => n.split(' ')[0];
const initials = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');
const stageOf = (id) => STAGES.find((s) => s.id === id);
const stageIdx = (id) => STAGES.findIndex((s) => s.id === id);

/* ---------- Fechas (todo relativo a hoy) ---------- */
const NOW = new Date();
const MONDAY = (() => { const d = new Date(NOW); const k = (d.getDay() + 6) % 7; d.setDate(d.getDate() - k); d.setHours(0, 0, 0, 0); return d; })();
const TODAY_IDX = Math.floor((new Date(NOW).setHours(0, 0, 0, 0) - MONDAY) / 864e5);
const dayDate = (d) => { const x = new Date(MONDAY); x.setDate(x.getDate() + d); return x; };
const apptDate = (a) => { const x = dayDate(a.d); x.setHours(a.hour, 0, 0, 0); return x; };
const fDay = (dt) => dt.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
const fLong = (dt) => dt.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
const fHour = (h) => `${String(h).padStart(2, '0')}:00`;
const ago = (h) => { if (h < 1) return 'hace un momento'; if (h < 24) return `hace ${h} h`; const d = Math.round(h / 24); return d === 1 ? 'ayer' : `hace ${d} días`; };

/* ---------- Estado (en memoria: se reinicia al recargar) ---------- */
const state = {
  user: null,
  clients: CLIENTS.map((c) => ({ ...c, zones: [...c.zones], quote: c.quote ? { ...c.quote } : null, appt: c.appt ? { ...c.appt } : null, notes: '' })),
  unread: new Set(CLIENTS.filter((c) => c.stage === 'nueva' && c.h < 30).map((c) => c.id)),
  reqFilter: 'todas', cliQuery: '', cliOrigin: 'todos', week: 0, autoRem: true, open: null,
};
const me = () => userById(state.user);
const isAdmin = () => me().role === 'admin';
const mine = () => state.clients.filter((c) => isAdmin() || c.artist === state.user);
const view = () => { const h = location.hash.slice(1); return VIEWS.some(([v]) => v === h) ? h : 'resumen'; };

/* ---------- Piezas ---------- */
const av = (c) => `<span class="av" style="background:${COLOR[c.artist]}">${esc(initials(c.name))}</span>`;
const st = (c) => `<span class="st ${c.stage}">${esc(stageOf(c.stage).short)}</span>`;
const otag = (o) => `<span class="tag o-${esc(o)}">${esc(o)}</span>`;
const artTag = (c) => (isAdmin() ? `<span class="tag" style="border-color:${COLOR[c.artist]}">${esc(userById(c.artist).name)}</span>` : '');
const reminderDate = (c) => { const x = apptDate(c.appt); x.setDate(x.getDate() - 7); return x; };
const reminderSent = (c) => reminderDate(c) <= NOW;

function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2600); }

/* ---------- Menú ---------- */
function renderMenu() {
  const v = view(), my = mine();
  const unread = my.filter((c) => state.unread.has(c.id)).length;
  const toQuote = my.filter((c) => c.stage === 'nueva').length;
  $('#menu').innerHTML = VIEWS.map(([id, label]) => {
    const b = id === 'solicitudes' && unread ? `<span class="badge">${unread}</span>` : id === 'presupuestos' && toQuote ? `<span class="badge">${toQuote}</span>` : '';
    return `<a href="#${id}" class="${v === id ? 'on' : ''}">${label}${b}</a>`;
  }).join('');
}

/* ---------- Vistas ---------- */
function vResumen() {
  const my = mine(), u = me();
  const unread = my.filter((c) => state.unread.has(c.id));
  const toQuote = my.filter((c) => c.stage === 'nueva');
  const waiting = my.filter((c) => c.stage === 'presupuestada' || c.stage === 'senal');
  const appts = my.filter((c) => c.stage === 'cita' && c.appt && c.appt.d >= TODAY_IDX).sort((a, b) => apptDate(a.appt) - apptDate(b.appt));
  const weekAll = my.filter((c) => c.stage === 'cita' && c.appt && c.appt.d >= 0 && c.appt.d <= 6);
  const thisWeek = weekAll;
  const counts = ORIGINS.map((o) => [o, my.filter((c) => c.origin === o).length]).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...counts.map((x) => x[1]), 1);
  const remWeek = appts.filter((c) => { const r = reminderDate(c); const end = dayDate(7); return r >= dayDate(0) && r < end; });
  const perArtist = USERS.filter((x) => x.role === 'artist').map((a) => {
    const cs = state.clients.filter((c) => c.artist === a.id);
    const prev = cs.filter((c) => c.stage === 'cita').reduce((s, c) => s + (c.quote?.price || 0), 0);
    return `<tr><td><span class="tag" style="border-color:${COLOR[a.id]}">${esc(a.name)}</span></td><td class="r">${cs.filter((c) => c.stage === 'nueva').length}</td><td class="r">${cs.filter((c) => c.stage === 'presupuestada' || c.stage === 'senal').length}</td><td class="r">${cs.filter((c) => c.stage === 'cita').length}</td><td class="r">${prev.toLocaleString('es-ES')} €</td></tr>`;
  }).join('');
  return `
  <div class="top"><div><h1 class="hello">Hola, <em>${esc(isAdmin() ? 'equipo' : first(u.name))}</em></h1>
    <p class="sub">${esc(fLong(NOW))} · ${unread.length ? `${unread.length} solicitud${unread.length > 1 ? 'es' : ''} sin leer` : 'todo al día'}${isAdmin() ? ' · viendo todo el estudio' : ''}</p></div>
    <span class="demo-tag">Demo con datos de ejemplo</span></div>
  <div class="kpis">
    <button class="kpi ${unread.length ? 'hot' : ''}" data-go="solicitudes"><small>Solicitudes sin leer</small><span class="num">${unread.length}</span><small>nuevas desde la web y redes</small></button>
    <button class="kpi ${toQuote.length ? 'hot' : ''}" data-go="presupuestos"><small>Por presupuestar</small><span class="num">${toQuote.length}</span><small>con toda la info del cliente</small></button>
    <button class="kpi" data-go="clientes"><small>Esperando al cliente</small><span class="num">${waiting.length}</span><small>presupuesto enviado o falta señal</small></button>
    <button class="kpi" data-go="agenda"><small>Citas esta semana</small><span class="num">${thisWeek.length}</span><small>${thisWeek.reduce((s, c) => s + c.appt.dur, 0)} h de tatuaje</small></button>
  </div>
  <div class="cols">
    <div class="stack">
      <section class="card"><h3>Próximas citas <a class="link" href="#agenda">Ver agenda</a></h3><div class="list">
        ${appts.slice(0, 5).map((c) => `<button class="item" data-open="${c.id}">${av(c)}<span><span class="nm">${esc(c.name)}</span><span class="ex">${esc(c.idea)}</span></span><span class="when">${esc(fDay(apptDate(c.appt)))}<br>${fHour(c.appt.hour)} · ${c.appt.dur} h</span></button>`).join('') || '<p class="empty">No hay citas próximas.</p>'}
      </div></section>
      <section class="card"><h3>Por presupuestar <a class="link" href="#presupuestos">Ver todas</a></h3><div class="list">
        ${toQuote.map((c) => `<button class="item" data-open="${c.id}">${av(c)}<span><span class="nm">${esc(c.name)}</span><span class="ex">${esc(c.zones.join(', '))} · ${esc(c.size)}</span></span><span class="when">${esc(ago(c.h))}</span></button>`).join('') || '<p class="empty">Nada pendiente. Bien.</p>'}
      </div></section>
    </div>
    <div class="stack">
      <section class="card"><h3>De dónde vienen los clientes</h3><div class="bars">
        ${counts.map(([o, n]) => `<div class="bar"><span>${esc(o)}</span><i><b style="width:${(n / max) * 100}%"></b></i><span>${n} · ${Math.round((n / my.length) * 100)}%</span></div>`).join('')}
      </div></section>
      <section class="card"><h3>Recordatorios de esta semana <a class="link" href="#recordatorios">Ver</a></h3><div class="list">
        ${remWeek.map((c) => `<button class="item" data-open="${c.id}">${av(c)}<span><span class="nm">${esc(c.name)}</span><span class="ex">cita el ${esc(fDay(apptDate(c.appt)))}</span></span><span class="when">${reminderSent(c) ? '<span class="ok">Enviado</span>' : `<span class="sched">${esc(fDay(reminderDate(c)))}</span>`}</span></button>`).join('') || '<p class="empty">No sale ningún recordatorio esta semana.</p>'}
      </div></section>
      ${isAdmin() ? `<section class="card"><h3>Por artista</h3><div class="tw" style="border:0;background:none"><table><thead><tr><th>Artista</th><th class="r">Nuevas</th><th class="r">Esperando</th><th class="r">Citas</th><th class="r">Previsto</th></tr></thead><tbody>${perArtist}</tbody></table></div></section>` : ''}
    </div>
  </div>`;
}

function vSolicitudes() {
  const f = state.reqFilter;
  const list = mine().filter((c) => f === 'todas' || c.stage === f).sort((a, b) => a.h - b.h);
  const chips = [['todas', 'Todas'], ...STAGES.map((s) => [s.id, s.short])];
  return `
  <div class="top"><div><h2>Solicitudes</h2><p class="sub">Todo lo que entra por la web, Instagram y WhatsApp, en un solo sitio.</p></div>
    <div class="filters">${chips.map(([id, l]) => `<button class="fchip" data-rf="${id}" aria-pressed="${f === id}">${l}</button>`).join('')}</div></div>
  <div class="reqs">${list.map((c) => `
    <button class="req ${state.unread.has(c.id) ? 'unread' : ''}" data-open="${c.id}">
      <span class="hd"><span style="display:flex;gap:10px;align-items:center">${av(c)}<span class="nm">${esc(c.name)}</span></span>${st(c)}</span>
      <p>${esc(c.idea)}</p>
      <span class="meta">${otag(c.origin)}<span class="tag">${esc(c.zones[0])}${c.zones.length > 1 ? ` +${c.zones.length - 1}` : ''}</span><span class="tag">${esc(c.size.split(' (')[0])}</span>${artTag(c)}</span>
      <span class="when" style="text-align:left">${esc(ago(c.h))}${state.unread.has(c.id) ? ' · <b style="color:var(--or)">sin leer</b>' : ''}</span>
    </button>`).join('') || '<p class="empty">No hay solicitudes en esta etapa.</p>'}</div>`;
}

function vPresupuestos() {
  const list = mine().filter((c) => c.stage === 'nueva').sort((a, b) => b.h - a.h);
  return `
  <div class="top"><div><h2>Por presupuestar</h2><p class="sub">Cada solicitud con todo lo que necesitas para dar precio sin preguntar nada.</p></div></div>
  <div class="stack">${list.map((c) => `
    <section class="card">
      <div class="dh"><div style="display:flex;gap:12px;align-items:center">${av(c)}<div><span class="nm">${esc(c.name)}</span><br><span class="muted" style="font-size:13px">${esc(ago(c.h))} · ${esc(c.origin)}${isAdmin() ? ` · ${esc(userById(c.artist).name)}` : ''}</span></div></div>
        <button class="btn or" data-open="${c.id}" data-q="1">Hacer presupuesto</button></div>
      <p class="idea" style="margin:14px 0">“${esc(c.idea)}”</p>
      <dl class="dl"><dt>Estilo</dt><dd>${esc(c.style)}</dd><dt>Zona</dt><dd>${esc(c.zones.join(', '))}</dd><dt>Tamaño</dt><dd>${esc(c.size)}</dd><dt>Primer tatuaje</dt><dd>${c.first ? 'Sí' : 'No'}</dd><dt>Referencias</dt><dd>${c.refs ? `${c.refs} foto${c.refs > 1 ? 's' : ''}` : 'Ninguna'}</dd></dl>
    </section>`).join('') || '<section class="card"><p class="empty">No tienes presupuestos pendientes.</p></section>'}</div>`;
}

function vAgenda() {
  const w = state.week, H0 = 10, H1 = 20, ROW = 52;
  const days = [0, 1, 2, 3, 4, 5].map((i) => i + w * 7);
  const evs = mine().filter((c) => c.stage === 'cita' && c.appt && days.includes(c.appt.d));
  const hours = Array.from({ length: H1 - H0 }, (_, i) => H0 + i);
  const head = days.map((d) => { const dt = dayDate(d); return `<div class="calh ${d === TODAY_IDX ? 'today' : ''}">${esc(dt.toLocaleDateString('es-ES', { weekday: 'short' }))}<b>${dt.getDate()}</b></div>`; }).join('');
  const cols = days.map((d) => `<div class="dcol">${hours.map(() => '<div class="slot"></div>').join('')}${evs.filter((c) => c.appt.d === d).map((c) => `<button class="ev" data-open="${c.id}" style="top:${(c.appt.hour - H0) * ROW + 2}px;height:${c.appt.dur * ROW - 4}px;background:${COLOR[c.artist]}"><b>${esc(c.name)}</b>${fHour(c.appt.hour)}–${fHour(c.appt.hour + c.appt.dur)}<br>${esc(c.zones[0].split(' ·')[0])}</button>`).join('')}</div>`).join('');
  return `
  <div class="top"><div><h2>Agenda</h2><p class="sub">${esc(fDay(dayDate(days[0])))} – ${esc(fDay(dayDate(days[5])))}</p></div>
    <div class="filters"><button class="fchip" data-wk="0" aria-pressed="${w === 0}">Esta semana</button><button class="fchip" data-wk="1" aria-pressed="${w === 1}">Semana que viene</button></div></div>
  <div class="legend" style="margin-bottom:12px">${isAdmin() ? USERS.filter((u) => u.role === 'artist').map((u) => `<span><i style="background:${COLOR[u.id]}"></i>${esc(u.name)}</span>`).join('') : ''}<span class="sync">Sincronizado con Google Calendar (demo)</span></div>
  <div class="cal"><div class="calg"><div class="calh"></div>${head}<div>${hours.map((h) => `<div class="hr">${fHour(h)}</div>`).join('')}</div>${cols}</div></div>`;
}

function vClientes() {
  const q = state.cliQuery.toLowerCase(), o = state.cliOrigin;
  const list = mine().filter((c) => (o === 'todos' || c.origin === o) && (!q || c.name.toLowerCase().includes(q) || c.idea.toLowerCase().includes(q))).sort((a, b) => a.h - b.h);
  return `
  <div class="top"><div><h2>Clientes</h2><p class="sub">${mine().length} clientes · etiquetados por de dónde vienen.</p></div>
    <input class="inp sm" id="cq" placeholder="Buscar por nombre o idea" value="${esc(state.cliQuery)}" style="max-width:280px"></div>
  <div class="filters" style="margin-bottom:14px">${[['todos', 'Todos'], ...ORIGINS.map((x) => [x, x])].map(([id, l]) => `<button class="fchip" data-co="${esc(id)}" aria-pressed="${o === id}">${esc(l)}</button>`).join('')}</div>
  <div class="tw"><table><thead><tr><th>Cliente</th>${isAdmin() ? '<th>Artista</th>' : ''}<th>Etapa</th><th>Origen</th><th>Zona</th><th>Llegó</th><th class="r">Presupuesto</th></tr></thead><tbody>
    ${list.map((c) => `<tr data-open="${c.id}"><td><b>${esc(c.name)}</b></td>${isAdmin() ? `<td>${esc(userById(c.artist).name)}</td>` : ''}<td>${st(c)}</td><td>${otag(c.origin)}</td><td>${esc(c.zones[0])}</td><td>${esc(ago(c.h))}</td><td class="r">${c.quote ? `${c.quote.price} €` : '—'}</td></tr>`).join('') || `<tr><td colspan="7" class="empty">Sin resultados.</td></tr>`}
  </tbody></table></div>`;
}

function vRecordatorios() {
  const list = mine().filter((c) => c.stage === 'cita' && c.appt && c.appt.d >= TODAY_IDX).sort((a, b) => apptDate(a.appt) - apptDate(b.appt));
  return `
  <div class="top"><div><h2>Recordatorios</h2><p class="sub">Una semana antes de cada cita, el cliente recibe un WhatsApp automático.</p></div>
    <label class="switch"><input type="checkbox" id="autorem" ${state.autoRem ? 'checked' : ''}>Envío automático ${state.autoRem ? 'activado' : 'pausado'}</label></div>
  <section class="card">${list.map((c) => `
    <div class="rem"><div><span class="d">${esc(fDay(apptDate(c.appt)))}</span><br><span class="muted">${fHour(c.appt.hour)} · ${c.appt.dur} h</span></div>
      <div><span class="nm">${esc(c.name)}</span>${isAdmin() ? ` <span class="muted">· ${esc(userById(c.artist).name)}</span>` : ''}<div class="msg">${esc(remMsg(c))}</div></div>
      <div style="text-align:right">${reminderSent(c) ? `<span class="ok">Enviado el ${esc(fDay(reminderDate(c)))}</span>` : `<span class="sched">${state.autoRem ? 'Sale el' : 'Pausado ·'} ${esc(fDay(reminderDate(c)))}</span><br><button class="btn sm" data-sendnow="${c.id}" style="margin-top:8px">Enviar ahora</button>`}</div></div>`).join('') || '<p class="empty">No hay citas próximas.</p>'}</section>`;
}

/* ---------- Mensajes ---------- */
function quoteMsg(c, q) {
  const s = q.sessions > 1 ? `${q.sessions} sesiones` : '1 sesión';
  return `¡Hola ${first(c.name)}! Soy ${userById(c.artist).name}, de Tezy Tattoo.\nHe visto tu idea y me encanta. Te paso presupuesto:\n\n• ${q.price} € (${s})\n• Señal para reservar: ${q.deposit} € (se descuenta del total)\n\n¿Te encaja? Si me dices que sí, te paso fechas libres.`;
}
function remMsg(c) {
  const dt = apptDate(c.appt);
  return `¡Hola ${first(c.name)}! Te recordamos tu cita en Tezy Tattoo el ${fLong(dt)} a las ${fHour(c.appt.hour)} con ${userById(c.artist).name}.\nVen descansado, con algo comido y bien hidratado. ¿Necesitas cambiarla? Respóndenos aquí.`;
}
function freeSlots(c) {
  const taken = state.clients.filter((x) => x.artist === c.artist && x.appt && x.id !== c.id);
  const out = [];
  for (let d = Math.max(TODAY_IDX + 1, 7); d < 13 && out.length < 4; d++) {
    if (d % 7 === 6) continue;
    for (const h of [10, 12, 16]) {
      if (out.length >= 4) break;
      const clash = taken.some((x) => x.appt.d === d && h < x.appt.hour + x.appt.dur && x.appt.hour < h + 3);
      if (!clash) { out.push({ d, hour: h }); break; }
    }
  }
  return out;
}

/* ---------- Ficha lateral ---------- */
function drawer(id, focusQuote) {
  const c = state.clients.find((x) => x.id === id); if (!c) return;
  state.open = id; state.unread.delete(id);
  const si = stageIdx(c.stage);
  const q = c.quote || { price: '', sessions: 1, deposit: '' };
  let act = '';
  if (c.stage === 'nueva') {
    act = `<h4>Presupuesto</h4><div class="qform"><div><label class="fl" for="qp">Precio (€)</label><input class="inp" id="qp" type="number" min="0" inputmode="numeric" value="${esc(q.price)}" placeholder="150"></div><div><label class="fl" for="qs">Sesiones</label><input class="inp" id="qs" type="number" min="1" value="${esc(q.sessions)}"></div><div><label class="fl" for="qd">Señal (€)</label><input class="inp" id="qd" type="number" min="0" value="${esc(q.deposit)}" placeholder="40"></div></div>
      <div class="wa" id="wa"></div><div class="acts"><button class="btn or" data-act="sendq">Enviar por WhatsApp</button><button class="btn" data-act="copyq">Copiar mensaje</button></div>`;
  } else if (c.stage === 'presupuestada') {
    act = `<h4>Presupuesto enviado</h4><div class="wa">${esc(quoteMsg(c, c.quote))}</div><div class="acts"><button class="btn gn" data-act="accept">Ha aceptado</button><button class="btn" data-act="resend">Recordarle el presupuesto</button></div>`;
  } else if (c.stage === 'senal') {
    act = `<h4>Falta la señal (${c.quote.deposit} €)</h4><p class="muted" style="margin:0 0 12px">Cuando pague la señal, elige la fecha y se crea la cita en el calendario.</p><div class="slots">${freeSlots(c).map((s, i) => `<button class="fchip" data-slot="${i}" aria-pressed="false">${esc(fDay(dayDate(s.d)))} · ${fHour(s.hour)}</button>`).join('')}</div><div class="acts"><button class="btn or" data-act="book">Señal pagada · reservar</button></div>`;
  } else if (c.stage === 'cita') {
    act = `<h4>Cita reservada</h4><p style="margin:0 0 6px"><b>${esc(fLong(apptDate(c.appt)))}</b>, ${fHour(c.appt.hour)}–${fHour(c.appt.hour + c.appt.dur)}</p><p class="muted" style="margin:0">Recordatorio: ${reminderSent(c) ? `<span class="ok">enviado el ${esc(fDay(reminderDate(c)))}</span>` : `<span class="sched">sale el ${esc(fDay(reminderDate(c)))}</span>`}</p><div class="acts"><button class="btn gn" data-act="done">Marcar como tatuado</button></div>`;
  } else {
    act = `<h4>Tatuado</h4><p class="muted" style="margin:0">Buen momento para pedirle una reseña en Google: es lo que más ayuda a que os encuentren.</p><div class="acts"><button class="btn or" data-act="review">Pedir reseña por WhatsApp</button></div>`;
  }
  const art = isAdmin()
    ? `<select class="inp sm" id="reassign" style="max-width:200px">${USERS.filter((u) => u.role === 'artist').map((u) => `<option value="${u.id}" ${u.id === c.artist ? 'selected' : ''}>${esc(u.name)}</option>`).join('')}</select>`
    : esc(userById(c.artist).name);
  const d = $('#drawer');
  d.innerHTML = `
    <div class="dh"><div><h2>${esc(c.name)}</h2><p class="muted" style="margin:6px 0 0">${esc(stageOf(c.stage).label)} · ${esc(ago(c.h))}</p></div><button class="close" data-act="close" aria-label="Cerrar">✕</button></div>
    <div class="pipe">${STAGES.map((s, i) => `<span class="${i < si ? 'on' : i === si ? 'cur' : ''}"></span>`).join('')}</div>
    <div class="pipel"><span>Solicitud</span><span>Presupuesto</span><span>Señal</span><span>Cita</span><span>Hecho</span></div>
    <p class="idea">“${esc(c.idea)}”</p>
    <dl class="dl">
      <dt>Estilo</dt><dd>${esc(c.style)}</dd><dt>Zona</dt><dd>${esc(c.zones.join(', '))}</dd><dt>Tamaño</dt><dd>${esc(c.size)}</dd><dt>Primer tatuaje</dt><dd>${c.first ? 'Sí' : 'No'}</dd>
      <dt>Referencias</dt><dd>${c.refs ? `<div class="refs">${Array.from({ length: c.refs }, (_, i) => `<span>foto ${i + 1}</span>`).join('')}</div>` : 'Ninguna'}</dd>
      <dt>Teléfono</dt><dd>${esc(c.phone)}</dd><dt>Instagram</dt><dd>${esc(c.ig || '—')}</dd><dt>Vino por</dt><dd>${otag(c.origin)}</dd><dt>Artista</dt><dd>${art}</dd>
    </dl>
    <div class="sect">${act}</div>
    <div class="sect"><h4>Notas internas</h4><textarea class="inp" id="notes" placeholder="Solo las ve el equipo: alergias, cambios de idea, lo que sea.">${esc(c.notes)}</textarea></div>`;
  d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); $('#scrim').hidden = false;
  if (c.stage === 'nueva') { const upd = () => { $('#wa').textContent = quoteMsg(c, { price: $('#qp').value || '—', sessions: +$('#qs').value || 1, deposit: $('#qd').value || '—' }); }; ['#qp', '#qs', '#qd'].forEach((s) => $(s).addEventListener('input', upd)); upd(); if (focusQuote) setTimeout(() => $('#qp').focus(), 260); }
  $('#notes').addEventListener('input', (e) => { c.notes = e.target.value; });
  const ra = $('#reassign'); if (ra) ra.addEventListener('change', (e) => { c.artist = e.target.value; toast(`Asignado a ${userById(c.artist).name}`); render(); drawer(c.id); });
  d.dataset.pick = '';
  d.focus({ preventScroll: true });
  render(false);
}
function closeDrawer() { state.open = null; const d = $('#drawer'); d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); $('#scrim').hidden = true; }

function act(a, btn) {
  const c = state.clients.find((x) => x.id === state.open);
  if (a === 'close') return closeDrawer();
  if (!c) return;
  if (a === 'sendq' || a === 'copyq') {
    const p = +$('#qp').value, s = +$('#qs').value || 1, dep = +$('#qd').value;
    if (!p || !dep) { toast('Pon precio y señal'); return; }
    if (a === 'copyq') { navigator.clipboard?.writeText(quoteMsg(c, { price: p, sessions: s, deposit: dep })).then(() => toast('Mensaje copiado'), () => toast('No se pudo copiar')); return; }
    c.quote = { price: p, sessions: s, deposit: dep }; c.stage = 'presupuestada'; toast(`Presupuesto enviado a ${first(c.name)} (demo)`);
  } else if (a === 'accept') { c.stage = 'senal'; toast(`${first(c.name)} ha aceptado · falta la señal`); }
  else if (a === 'resend') { toast('Recordatorio del presupuesto enviado (demo)'); return; }
  else if (a === 'book') {
    const i = $('#drawer').dataset.pick ?? ''; if (i === '') { toast('Elige una fecha'); return; }
    const s = freeSlots(c)[+i]; const dur = Math.min(5, Math.max(1, (c.quote?.sessions || 1) > 1 ? 4 : c.size.startsWith('Pequeño') ? 1 : c.size.startsWith('Mediano') ? 2 : 3));
    c.appt = { d: s.d, hour: s.hour, dur }; c.stage = 'cita'; toast('Cita creada y añadida a Google Calendar (demo)');
  } else if (a === 'done') { c.stage = 'hecho'; toast(`¡Hecho! ${first(c.name)} pasa a tatuados`); }
  else if (a === 'review') { toast('Petición de reseña enviada (demo)'); return; }
  render(); drawer(c.id);
}

/* ---------- Render ---------- */
const RENDER = { resumen: vResumen, solicitudes: vSolicitudes, presupuestos: vPresupuestos, agenda: vAgenda, clientes: vClientes, recordatorios: vRecordatorios };
function render(full = true) {
  renderMenu();
  if (!full) return;
  const v = view();
  $('#main').innerHTML = RENDER[v]();
  document.title = `${VIEWS.find((x) => x[0] === v)[1]} · Panel Tezy`;
  const cq = $('#cq'); if (cq) cq.addEventListener('input', (e) => { state.cliQuery = e.target.value; const pos = e.target.selectionStart; render(); const n = $('#cq'); n.focus(); n.setSelectionRange(pos, pos); });
  const ar = $('#autorem'); if (ar) ar.addEventListener('change', (e) => { state.autoRem = e.target.checked; render(); toast(state.autoRem ? 'Recordatorios automáticos activados' : 'Recordatorios pausados'); });
}

/* ---------- Eventos ---------- */
document.addEventListener('click', (e) => {
  const t = e.target;
  const o = t.closest('[data-open]'); if (o) { drawer(o.dataset.open, !!o.dataset.q); return; }
  const g = t.closest('[data-go]'); if (g) { location.hash = g.dataset.go; return; }
  const rf = t.closest('[data-rf]'); if (rf) { state.reqFilter = rf.dataset.rf; render(); return; }
  const co = t.closest('[data-co]'); if (co) { state.cliOrigin = co.dataset.co; render(); return; }
  const wk = t.closest('[data-wk]'); if (wk) { state.week = +wk.dataset.wk; render(); return; }
  const sn = t.closest('[data-sendnow]'); if (sn) { toast('Recordatorio enviado por WhatsApp (demo)'); return; }
  const sl = t.closest('[data-slot]'); if (sl) { $$('[data-slot]').forEach((b) => b.setAttribute('aria-pressed', b === sl)); $('#drawer').dataset.pick = sl.dataset.slot; return; }
  const a = t.closest('[data-act]'); if (a) { act(a.dataset.act, a); return; }
});
$('#scrim').addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.open) closeDrawer(); });
addEventListener('hashchange', () => { closeDrawer(); render(); window.scrollTo(0, 0); });

/* ---------- Login (demo) ---------- */
function enter(id) {
  state.user = id; $('#asuser').value = id;
  $('#login').hidden = true; $('#app').hidden = false;
  render();
}
$('#lform').addEventListener('submit', (e) => { e.preventDefault(); enter($('#lemail').value); });
$('#asuser').addEventListener('change', (e) => { state.user = e.target.value; closeDrawer(); render(); toast(`Viendo como ${me().name}`); });
$('#logout').addEventListener('click', () => { closeDrawer(); $('#app').hidden = true; $('#login').hidden = false; });
