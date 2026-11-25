// Datos del estudio. Edita aquí y la web se actualiza sola.

export const STUDIO = {
  name: 'Tezy Tattoo',
  tagline: 'Estudio de tatuaje y piercing',
  phone: '+34 911 92 98 76',          // ficha pública (Fresha)
  phoneHref: 'tel:+34911929876',
  instagram: '@tezytattoo',           // POR CONFIRMAR
  instagramUrl: 'https://www.instagram.com/',
  address: 'Av. de Guadarrama, 4',
  postal: '28701',
  city: 'San Sebastián de los Reyes',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tezy+Tattoo+Av.+de+Guadarrama+4+San+Sebasti%C3%A1n+de+los+Reyes',
  hours: 'Con cita previa',           // POR CONFIRMAR
};

export const ARTISTS = [
  { id: 'ruben', name: 'Rubén', styles: 'Estilos por confirmar', bio: 'Bio corta por rellenar tras el café.' },
  { id: 'a2', name: 'Artista 2', styles: 'Estilos por confirmar', bio: 'Bio corta por rellenar tras el café.' },
];

export const STYLES = ['Blackwork', 'Realismo', 'Fine line', 'Color', 'Lettering'];

// Trabajos del portfolio. Cuando lleguen las fotos reales:
// guarda la imagen en src/assets/trabajos/ y añade `img: 'nombre.jpg'`.
export const WORKS = [
  { artist: 'ruben', style: 'Blackwork', ratio: '4/5' },
  { artist: 'a2', style: 'Fine line', ratio: '1/1' },
  { artist: 'ruben', style: 'Realismo', ratio: '3/4' },
  { artist: 'a2', style: 'Color', ratio: '4/5' },
  { artist: 'ruben', style: 'Blackwork', ratio: '1/1' },
  { artist: 'a2', style: 'Lettering', ratio: '3/4' },
  { artist: 'ruben', style: 'Realismo', ratio: '4/5' },
  { artist: 'a2', style: 'Fine line', ratio: '3/4' },
  { artist: 'ruben', style: 'Blackwork', ratio: '3/4' },
  { artist: 'a2', style: 'Color', ratio: '1/1' },
  { artist: 'ruben', style: 'Lettering', ratio: '4/5' },
  { artist: 'a2', style: 'Fine line', ratio: '4/5' },
];

export const FORM_GROUPS = {
  estilo: [...STYLES, 'No lo sé'],
  tam: ['Pequeño (menos de 10 cm)', 'Mediano (10–20 cm)', 'Grande (más de 20 cm)', 'Sesión completa'],
  primero: ['Sí', 'No'],
  artista: [...ARTISTS.map((a) => [a.id, a.name]), ['igual', 'Me da igual']],
  origen: ['Instagram', 'Google', 'WhatsApp', 'Me lo recomendaron', 'Pasaba por aquí', 'Otro'],
};

export const artistName = (id) => (ARTISTS.find((a) => a.id === id) || {}).name || 'Me da igual';
