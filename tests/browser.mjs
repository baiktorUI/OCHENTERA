import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
async function fits() {
  const overflow = await page.evaluate(() => {
    const selectors = ['.app-shell', '.topbar', '.game-layout', '.draw-card', '.media-card', '.history', '.history-list', '.board-card', '.bingo-board', '.shortcut-bar'];
    return selectors.filter(selector => {
      const element = document.querySelector(selector); const rect = element.getBoundingClientRect();
      return rect.bottom > innerHeight + 1 || rect.right > innerWidth + 1 || rect.top < -1 || element.scrollHeight > element.clientHeight + 2 || element.scrollWidth > element.clientWidth + 2;
    });
  });
  assert.deepEqual(overflow, [], 'All panels fit without internal or page overflow');
  const sizes = await page.evaluate(() => ['.draw-card', '.media-card'].map(s => { const r = document.querySelector(s).getBoundingClientRect(); return [r.width, r.height]; }));
  assert.ok(Math.abs(sizes[0][0] - sizes[1][0]) < 1 && Math.abs(sizes[0][1] - sizes[1][1]) < 1, 'Number and music occupy equal areas');
}
try {
  await page.goto('http://127.0.0.1:5173');
  assert.equal(await page.locator('html').getAttribute('lang'), 'ca');
  assert.equal(await page.getByRole('button', { name: /següent|empezar|siguiente/i }).count(), 0);
  await fits();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('ochentera-game-v1')).length === 1);
  await page.getByRole('button', { name: 'Pantalla completa', exact: true }).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.marked').count(), 2, 'Enter draws once even after a control was focused');
  await page.reload();
  assert.equal(await page.locator('.marked').count(), 2, 'Reload restores history');
  await page.keyboard.press('l');
  await page.getByRole('heading', { name: 'LÍNIA!' }).waitFor();
  await page.screenshot({ path: 'tests/line.png' });
  assert.equal(await page.locator('audio').evaluate(a => a.paused), true);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => !!document.activeElement.closest('dialog')), true);
  await page.keyboard.press('Escape');
  await page.keyboard.press('q');
  await page.getByRole('heading', { name: 'BINGO!' }).waitFor();
  await page.screenshot({ path: 'tests/bingo.png' });
  await page.keyboard.press('q');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.keyboard.press('n');
  await page.getByRole('button', { name: 'Continuar la partida', exact: true }).click();
  assert.equal(await page.locator('.marked').count(), 2);
  await page.keyboard.press('n');
  await page.getByRole('dialog').getByRole('button', { name: 'Nova partida', exact: true }).click();
  assert.equal(await page.locator('.marked').count(), 0);
  for (let i = 0; i < 90; i++) await page.keyboard.press('Enter');
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('ochentera-game-v1')).length === 90);
  const history = await page.evaluate(() => JSON.parse(localStorage.getItem('ochentera-game-v1')));
  assert.equal(new Set(history).size, 90);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.marked').count(), 90);
  await page.reload();
  assert.equal(await page.locator('.marked').count(), 90);
  for (const [width,height] of [[1920,1080],[1366,768],[1280,720],[1024,768],[800,600],[390,844],[320,568]]) {
    await page.setViewportSize({width,height}); console.log(width,height); await fits();
    if (width === 1280) await page.screenshot({path:'tests/projector.png'});
    if (width === 390) await page.screenshot({path:'tests/mobile.png'});
  }
  await page.setViewportSize({width:1280,height:720});
  await page.evaluate(() => localStorage.setItem('ochentera-game-v1', '[1,1,99]'));
  await page.reload();
  assert.equal(await page.locator('.marked').count(), 0);
  await page.route('**/assets/audio/*.mp3', route => route.abort());
  await page.route('**/assets/images/*.jpg', route => route.abort());
  await page.keyboard.press('Enter');
  await page.getByText('No es pot carregar l’àudio.', {exact:false}).waitFor();
  assert.equal(await page.locator('.record').count(), 1);
  await fits();
  assert.deepEqual(errors, []);
  console.log('PASS: Catalan, keyboard-only draw, 90 unique numbers, persistence, reset, prizes, modal focus, paused audio, equal panels and no overflow at 7 screen sizes, corrupt storage and media failures.');
} finally { await browser.close(); }
