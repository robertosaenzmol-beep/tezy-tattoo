// Datos de EJEMPLO para la demo del panel. No hay base de datos todavía:
// todo vive en memoria y se reinicia al recargar la página.
// Las fechas de las citas son relativas al lunes de la semana actual.

export const USERS = [
  { id: 'ruben', name: 'Rubén', role: 'artist', email: 'ruben@tezytattoo.es' },
  { id: 'a2', name: 'Artista 2', role: 'artist', email: 'artista2@tezytattoo.es' },
  { id: 'admin', name: 'Admin', role: 'admin', email: 'admin@tezytattoo.es' },
];

// Etapas del proceso de venta
export const STAGES = [
  { id: 'nueva', label: 'Solicitud nueva', short: 'Nueva' },
  { id: 'presupuestada', label: 'Presupuesto enviado', short: 'Presupuestada' },
  { id: 'senal', label: 'Aceptado, falta la señal', short: 'Falta señal' },
  { id: 'cita', label: 'Cita reservada', short: 'Cita' },
  { id: 'hecho', label: 'Tatuado', short: 'Hecho' },
];

export const ORIGINS = ['Instagram', 'WhatsApp', 'Web', 'Google', 'Recomendación'];

// h = horas desde que llegó la solicitud
// appt.d = día desde el lunes de esta semana (0 = lunes, 7 = lunes siguiente)
export const CLIENTS = [
  { id: 'c1', name: 'Laura Gómez', phone: '612 418 903', ig: '@laura.gmz', origin: 'Instagram', artist: 'a2', stage: 'nueva', h: 2,
    idea: 'Una golondrina fine line con el nombre de mi madre debajo, en letra fina.', style: 'Fine line', zones: ['Antebrazo · lado izquierdo'], size: 'Pequeño (menos de 10 cm)', first: true, refs: 2 },
  { id: 'c2', name: 'Daniel Ruiz', phone: '634 207 551', ig: '@druiz_', origin: 'Web', artist: 'ruben', stage: 'nueva', h: 5,
    idea: 'Media manga blackwork con motivos japoneses: ola, flor de cerezo y nubes. Quiero que conecte con un tatuaje que ya tengo en el hombro.', style: 'Blackwork', zones: ['Brazo · lado derecho', 'Antebrazo · lado derecho'], size: 'Sesión completa', first: false, refs: 4 },
  { id: 'c3', name: 'Marta Sanz', phone: '655 930 114', ig: '@martasanz', origin: 'Instagram', artist: 'ruben', stage: 'nueva', h: 26,
    idea: 'Retrato realista de mi perro (border collie). Tengo varias fotos buenas de él.', style: 'Realismo', zones: ['Muslo · lado derecho'], size: 'Grande (más de 20 cm)', first: false, refs: 3 },
  { id: 'c4', name: 'Iván Moreno', phone: '688 512 007', ig: '', origin: 'WhatsApp', artist: 'a2', stage: 'presupuestada', h: 50,
    idea: 'La frase "Siempre adelante" en lettering en las costillas.', style: 'Lettering', zones: ['Costillas · lado izquierdo'], size: 'Mediano (10–20 cm)', first: true, refs: 1,
    quote: { price: 150, sessions: 1, deposit: 40 } },
  { id: 'c5', name: 'Carla Jiménez', phone: '611 774 265', ig: '@carlaj', origin: 'Google', artist: 'a2', stage: 'senal', h: 72,
    idea: 'Rosa en color, estilo neotradicional, con algunas hojas.', style: 'Color', zones: ['Hombro · lado derecho'], size: 'Mediano (10–20 cm)', first: false, refs: 2,
    quote: { price: 220, sessions: 1, deposit: 50 } },
  { id: 'c6', name: 'Sergio Navarro', phone: '622 845 390', ig: '@sergionav', origin: 'Instagram', artist: 'ruben', stage: 'cita', h: 140,
    idea: 'Serpiente blackwork enrollada alrededor del antebrazo.', style: 'Blackwork', zones: ['Antebrazo · lado izquierdo'], size: 'Grande (más de 20 cm)', first: false, refs: 2,
    quote: { price: 380, sessions: 2, deposit: 80 }, appt: { d: 1, hour: 11, dur: 4 } },
  { id: 'c7', name: 'Lucía Ortega', phone: '699 102 448', ig: '@lu.ortega', origin: 'Recomendación', artist: 'a2', stage: 'cita', h: 160,
    idea: 'Fecha en números romanos, pequeña, en la muñeca.', style: 'Fine line', zones: ['Mano · lado derecho'], size: 'Pequeño (menos de 10 cm)', first: true, refs: 0,
    quote: { price: 80, sessions: 1, deposit: 30 }, appt: { d: 3, hour: 17, dur: 1 } },
  { id: 'c8', name: 'Pablo Herrera', phone: '645 330 872', ig: '@pabloherr', origin: 'Instagram', artist: 'ruben', stage: 'cita', h: 200,
    idea: 'Polilla con luna en la espalda alta, tamaño grande, mucho contraste.', style: 'Blackwork', zones: ['Espalda alta'], size: 'Grande (más de 20 cm)', first: false, refs: 3,
    quote: { price: 450, sessions: 2, deposit: 100 }, appt: { d: 9, hour: 10, dur: 5 } },
  { id: 'c9', name: 'Nerea Castro', phone: '617 209 334', ig: '@nerea.cstr', origin: 'Web', artist: 'a2', stage: 'cita', h: 220,
    idea: 'Línea de montañas fine line en el antebrazo, con un pequeño sol.', style: 'Fine line', zones: ['Antebrazo · lado derecho'], size: 'Mediano (10–20 cm)', first: true, refs: 2,
    quote: { price: 120, sessions: 1, deposit: 30 }, appt: { d: 10, hour: 16, dur: 2 } },
  { id: 'c10', name: 'Álex Romero', phone: '603 881 259', ig: '@alexrmr', origin: 'Instagram', artist: 'ruben', stage: 'cita', h: 260,
    idea: 'Ola japonesa en el gemelo, en negro y gris.', style: 'Blackwork', zones: ['Gemelo · lado izquierdo'], size: 'Grande (más de 20 cm)', first: false, refs: 1,
    quote: { price: 300, sessions: 1, deposit: 70 }, appt: { d: 12, hour: 12, dur: 4 } },
  { id: 'c11', name: 'Irene Delgado', phone: '658 446 120', ig: '@irene.dlg', origin: 'WhatsApp', artist: 'ruben', stage: 'hecho', h: 400,
    idea: 'Calavera realista con flores en el muslo.', style: 'Realismo', zones: ['Muslo · lado izquierdo'], size: 'Grande (más de 20 cm)', first: false, refs: 2,
    quote: { price: 420, sessions: 2, deposit: 90 } },
  { id: 'c12', name: 'Hugo Prieto', phone: '626 571 903', ig: '@hugoprieto', origin: 'Instagram', artist: 'a2', stage: 'presupuestada', h: 30,
    idea: 'Constelación de Leo en la clavícula, muy fina.', style: 'Fine line', zones: ['Pecho · lado derecho'], size: 'Pequeño (menos de 10 cm)', first: true, refs: 1,
    quote: { price: 70, sessions: 1, deposit: 30 } },
];
