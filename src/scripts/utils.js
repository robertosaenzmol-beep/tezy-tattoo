export const $ = (s) => document.querySelector(s);
export const $$ = (s) => [...document.querySelectorAll(s)];
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const go = (id) => document.getElementById(id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
