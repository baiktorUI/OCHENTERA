# Ochentera · Bingo musical

Quina musical de 90 números, pensada per projectar en una única pantalla. Interfície en català, fons negre, taronja i violeta inspirats en https://uuhqe.framer.website/ i el logotip existent del projecte.

## Desenvolupament

Node.js 20 o superior:

```sh
npm ci
npm run dev
npm run build
npm run lint
```

## Dreceres

| Tecla | Acció |
| --- | --- |
| Enter | Sortejar el següent número, sense repeticions |
| L | Mostrar o tancar el premi de línia |
| Q | Mostrar o tancar el premi de bingo / quina |
| P | Reproduir o pausar la cançó |
| F | Entrar o sortir de pantalla completa |
| N | Demanar una nova partida amb confirmació |
| Esc | Tancar el premi o cancel·lar el reinici |

No hi ha botó per sortejar. La llegenda inferior mostra totes les dreceres. Els controls d’àudio i de confirmació també es poden utilitzar amb ratolí. En un diàleg, Enter activa el botó enfocat; no sorteja números.

Els premis aturen l’àudio i el sorteig fins que es tanquen. Per reprendre la música, prem P. Les celebracions mostren una composició de gran format i dues ràfegues breus de confeti, amb neteja en tancar i respecte per la preferència de moviment reduït.

## Projecció

La pantalla s’ajusta a l’alçada i l’amplada disponibles, sense desplaçament de la pàgina ni dels panells. El número i la música ocupen dos panells iguals. Els cinc números anteriors es mostren destacats, del més recent al més antic. Es recomana F per aprofitar tota la superfície del projector.

Comprovat a 1920×1080, 1366×768, 1280×720, 1024×768, 800×600, 390×844 i 320×568. En pantalles verticals la distribució canvia i els textos són més petits; per projectar, utilitza orientació horitzontal.

## Partida i cançons

La partida es desa al navegador i es recupera en tornar a carregar la mateixa adreça. Es valida l’historial desat i no es reinicia automàticament en arribar als 90 números. Si no es pot desar, la partida continua mentre la pàgina segueixi oberta.

Es conserven els àudios `public/assets/audio/number-1.mp3` a `number-90.mp3` i les imatges equivalents a `public/assets/images`. Per canviar una cançó, substitueix el fitxer amb el mateix nom o edita `src/data/bingoContent.ts`.

Un enllaç de Spotify no és una URL de MP3. La política de desenvolupadors de Spotify prohibeix integrar la plataforma en jocs, inclosos els musicals; aquesta aplicació no incorpora Spotify. Fonts consultades el 7 de setembre de 2026:

- https://developer.spotify.com/policy
- https://developer.spotify.com/compliance-tips

## Proves

La compilació comprova TypeScript de l’aplicació i de Vite. `tests/browser.mjs` executa proves amb Playwright i Chrome. Instal·la Playwright al teu entorn de proves, inicia el servidor al port 5173 i executa `node tests/browser.mjs`. `PLAYWRIGHT_MODULE` permet indicar una instal·lació externa; `BROWSER_CHANNEL` permet seleccionar un altre navegador compatible.

Les proves comproven la llengua, absència del botó de sorteig, 90 números únics, persistència, reinici, premis, focus del diàleg, pausa de l’àudio, igualtat dels panells, absència de desbordaments en set resolucions, dades corruptes i errors d’àudio o imatge. Les captures es generen a `tests/` i no s’inclouen a Git.
