# Tezy Tattoo — web

Web de Tezy Tattoo (San Sebastián de los Reyes), hecha con [Astro](https://astro.build) por Catafa.

## Arrancar en local

```bash
npm install
npm run dev      # http://localhost:4321
```

`npm run build` genera la web final en `dist/`.

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Teléfono, dirección, Instagram, horario | `src/data/site.js` → `STUDIO` |
| Artistas | `src/data/site.js` → `ARTISTS` |
| Trabajos del portfolio | `src/data/site.js` → `WORKS` |
| Opciones del formulario | `src/data/site.js` → `FORM_GROUPS` |
| Estilos (colores, tipografías, pegatinas) | `src/styles/global.css` |
| Secciones | `src/components/*.astro` |
| Interacciones (humo, maniquí, formulario, separadores) | `src/scripts/*.js` |

## Pendiente

- Fotos reales del local y de los trabajos.
- Nombre y estilos del segundo artista; estilos y bio de Rubén.
- Confirmar Instagram, horario y si hay WhatsApp.
- Panel del artista (cara privada) y envío real del formulario.
