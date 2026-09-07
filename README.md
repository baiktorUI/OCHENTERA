# Ochentera · Bingo musical

Aplicación React para sortear 90 números y reproducir los audios asociados. Diseño adaptable, historial local, controles de audio, pantalla completa y celebraciones de línea/bingo.

## Desarrollo

Requiere Node.js 20 o superior.

```sh
npm ci
npm run dev
npm run build
npm run lint
```

## Cómo jugar

- Empezar / Siguiente número o Enter: sortear sin repetir.
- L: celebrar línea. Q: celebrar bingo. Escape: cerrar el diálogo.
- La música se pausa durante la celebración. Pulsa reproducir para retomarla.
- Nueva partida pide confirmación antes de borrar el historial.
- Los 90 números permanecen al terminar. La partida se recupera al recargar en el mismo navegador y dirección, si el almacenamiento está disponible.

Los atajos no interfieren con botones ni controles de audio enfocados.

## Canciones

Los archivos existentes se conservan en `public/assets/audio/number-1.mp3` hasta `number-90.mp3`; las imágenes equivalentes están en `public/assets/images`. Para sustituir una canción, reemplaza su archivo manteniendo el nombre, o modifica `src/data/bingoContent.ts`. Las rutas respetan el directorio base del despliegue.

Un enlace de Spotify no es una URL de MP3. La API permite consultar información y controlar reproducción, pero la política de Spotify prohíbe integrar su plataforma en juegos, incluidos juegos musicales. No se ha añadido integración con Spotify. Referencias comprobadas el 7 de septiembre de 2026:

- https://developer.spotify.com/policy
- https://developer.spotify.com/compliance-tips

## Verificación

Compilación TypeScript de aplicación y configuración Vite, ESLint y prueba de navegador en `tests/browser.mjs`. Para ejecutar esta última, instala Playwright en tu entorno de pruebas, inicia `npm run dev` en el puerto 5173 y ejecuta `node tests/browser.mjs`. Usa `BROWSER_CHANNEL=chrome` para Chrome (por defecto Edge); `PLAYWRIGHT_MODULE` permite señalar una instalación externa de Playwright.

La prueba comprueba 90 números únicos, final sin reinicio automático, persistencia, reinicio confirmado/cancelado, activación por teclado sin doble sorteo, foco del diálogo, pantallas de 320/390 px, almacenamiento corrupto y fallos de audio/imagen. Genera capturas locales ignoradas por Git.

## Cambios de estabilidad y rendimiento

- Un único historial inmutable sustituye al estado duplicado del sorteo.
- Los datos guardados se validan antes de recuperarlos; un almacenamiento no disponible no bloquea el juego.
- Reproductor con controles nativos, mensajes de error, limpieza de audio anterior y carga bajo demanda.
- Tablero memorizado, sin actualizarlo en cada evento del audio.
- Se eliminan del flujo de juego los temporizadores y bucles de confeti y la descarga de fuentes externas.
- Se conservan los MP3 originales; no se ha medido una mejora de rendimiento mediante benchmark.
