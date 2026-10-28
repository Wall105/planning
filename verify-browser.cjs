const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');

// Use a local Playwright install, or the runtime supplied by Codex desktop.
let chromium;
try { ({ chromium } = require('playwright')); }
catch {
  ({ chromium } = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));
}

const root = __dirname;
const artifactDir = process.env.PLANNING_QA_DIR || path.join(os.tmpdir(), 'squadir-planning-qa');
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg' };

async function main() {
  fs.mkdirSync(artifactDir, { recursive: true });
  let browser;
  try {
    let executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
    if (!executablePath && !fs.existsSync(chromium.executablePath())) {
      const browserCache = path.join(os.homedir(), 'AppData/Local/ms-playwright');
      if (fs.existsSync(browserCache)) {
        executablePath = fs.readdirSync(browserCache).filter(name => name.startsWith('chromium_headless_shell-')).sort().reverse()
          .map(name => path.join(browserCache, name, 'chrome-headless-shell-win64/chrome-headless-shell.exe'))
          .find(filename => fs.existsSync(filename));
      }
    }
    browser = await chromium.launch({ headless: true, downloadsPath: artifactDir, ...(executablePath ? { executablePath } : {}) });
    const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1, acceptDownloads: true, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // Fulfill local assets directly so browser QA needs no network service or external dependencies.
    await page.route('**/*', async route => {
      const protocol = new URL(route.request().url()).protocol;
      const hostname = new URL(route.request().url()).hostname;
      if (hostname === '127.0.0.1') {
        const requestedPath = decodeURIComponent(new URL(route.request().url()).pathname);
        const filename = path.resolve(root, '.' + (requestedPath === '/' ? '/index.html' : requestedPath));
        if (!filename.startsWith(root + path.sep)) return route.fulfill({ status: 403 });
        if (!fs.existsSync(filename)) return route.fulfill({ status: 404 });
        return route.fulfill({ status: 200, contentType: mimeTypes[path.extname(filename)] || 'application/octet-stream', body: fs.readFileSync(filename) });
      }
      return protocol === 'data:' || protocol === 'blob:' ? route.continue() : route.abort();
    });
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => typeof applyScene === 'function');
    const sceneIds = await page.evaluate(() => Object.keys(scenePresets));
    assert.equal(sceneIds.length, 18, 'All eighteen requested scenes are available');
    assert.equal(await page.locator('#edition-label, #poster-capture .edition-label, #poster-capture .poster-tagline').count(), 0, 'Poster has no decorative tagline');
    assert.equal(await page.locator('[data-scene-id]').count(), sceneIds.length);
    const categoryCounts = await page.evaluate(() => Object.fromEntries(['festive', 'seasons', 'worlds', 'all'].map(category => [category, Object.values(scenePresets).filter(scene => category === 'all' || scene.category === category).length])));
    for (const [category, count] of Object.entries(categoryCounts)) {
      await page.locator(`.scene-filter[data-category="${category}"]`).click();
      assert.equal(await page.locator('[data-scene-id]').count(), count, `${category} gallery filter`);
    }
    const initialSchedule = await page.evaluate(() => JSON.stringify(schedule));
    const layouts = [];

    for (const id of sceneIds) {
      await page.evaluate(id => applyScene(id), id);
      await page.waitForTimeout(100);
      assert.equal(await page.locator('body').getAttribute('data-scene'), id, `Scene ${id} selected`);
      assert.equal(await page.evaluate(() => JSON.stringify(schedule)), initialSchedule, `Scene ${id} must preserve schedule`);
      assert.equal(await page.locator(`[data-scene-id="${id}"]`).getAttribute('aria-pressed'), 'true');
      const layout = await page.evaluate(() => {
        const poster = document.getElementById('poster-capture').getBoundingClientRect();
        const grid = document.getElementById('poster-grid-container').getBoundingClientRect();
        const badge = document.querySelector('.twitch-badge').getBoundingClientRect();
        return { posterWidth: poster.width, posterHeight: poster.height, gridBottom: grid.bottom, badgeTop: badge.top, posterBottom: poster.bottom };
      });
      assert.ok(layout.gridBottom < layout.posterBottom, `Scene ${id} grid contained in poster`);
      assert.ok(layout.gridBottom <= layout.badgeTop + 2, `Scene ${id} schedule does not overlap Twitch badge`);
      layouts.push({ id, ...layout });
      if (id !== 'none') await page.locator('#poster-capture').screenshot({ path: path.join(artifactDir, `${id}-landscape.png`) });
    }

    await page.evaluate(() => setStudioFormat('vertical'));
    for (const id of sceneIds) {
      await page.evaluate(id => applyScene(id), id);
      const contained = await page.evaluate(() => {
        const poster = document.getElementById('poster-capture').getBoundingClientRect();
        return [...document.querySelectorAll('.day-col')].every(day => {
          const rect = day.getBoundingClientRect();
          return rect.top >= poster.top && rect.bottom <= poster.bottom && rect.left >= poster.left && rect.right <= poster.right;
        });
      });
      assert.equal(contained, true, `Portrait ${id} contains every day`);
      if (id !== 'none') await page.locator('#poster-capture').screenshot({ path: path.join(artifactDir, `${id}-portrait.png`) });
    }
    await page.evaluate(() => setStudioFormat('horizontal'));

    // Real UI activation, browser persistence, decorative toggle, and original restoration.
    await page.locator('[data-scene-id="halloween"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator(':focus').getAttribute('data-scene-id'), 'halloween', 'Keyboard focus survives gallery rerender');
    await page.waitForTimeout(600);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('body').getAttribute('data-scene'), 'halloween');
    assert.equal(await page.evaluate(() => JSON.stringify(schedule)), initialSchedule);
    const decorToggle = page.locator('#toggle-decor');
    await decorToggle.uncheck();
    assert.equal(await page.locator('.scene-decor').isVisible(), false);
    await page.waitForTimeout(600);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await decorToggle.isChecked(), false);
    await decorToggle.check();
    await page.screenshot({ path: path.join(artifactDir, 'studio-halloween.png') });

    const defaultPalette = await page.evaluate(() => readCurrentPalette());
    await page.locator('#keep-colors').check();
    await page.evaluate(() => applyScene('forest'));
    assert.deepEqual(await page.evaluate(() => readCurrentPalette()), defaultPalette, 'Lock retains scene colors even before they are customized');
    await page.locator('#keep-colors').uncheck();
    await page.evaluate(() => applyScene('halloween'));

    // The color editor must change visible poster colors without losing the chosen scene or events.
    await page.locator('#color-editor').evaluate(element => { element.open = true; });
    await page.locator('#color-prim-hex').fill('#53c7d8');
    await page.locator('#color-prim-hex').press('Tab');
    assert.equal(await page.locator('#color-prim').inputValue(), '#53c7d8');
    assert.equal(await page.locator('body').getAttribute('data-scene'), 'halloween');
    assert.match(await page.locator('#scene-decor').innerHTML(), /<svg/);
    await page.locator('#color-prim-hex').fill('oops');
    await page.locator('#color-prim-hex').press('Tab');
    assert.equal(await page.locator('#color-prim').inputValue(), '#53c7d8', 'Invalid hex cannot change the applied color');

    const customColors = { primary: '#53c7d8', secondary: '#c494de', background: '#112233', surface: '#223344', text: '#edf0f4', muted: '#afbdce' };
    await page.evaluate(colors => Object.entries(colors).forEach(([key, value]) => updateColor(key, value)), customColors);
    for (const [accent, shouldBeDark] of [['#faf4d4', true], ['#142738', false]]) {
      await page.evaluate(color => { updateColor('primary', color); updateColor('secondary', color); }, accent);
      const textBrightness = await page.evaluate(() => ['.time-wrapper:not(.cyan) .time-text', '.time-wrapper.cyan .time-text'].map(selector => getComputedStyle(document.querySelector(selector)).color.match(/[\d.]+/g).slice(0, 3).map(Number).reduce((sum, value) => sum + value, 0)));
      assert.ok(textBrightness.every(value => shouldBeDark ? value < 384 : value > 384), `Badge text contrasts against ${accent}`);
    }
    await page.evaluate(colors => Object.entries(colors).forEach(([key, value]) => updateColor(key, value)), customColors);
    for (const look of ['original', 'cards', 'minimal']) {
      await page.evaluate(look => { document.getElementById('select-look').value = look; updateAppearance(); }, look);
      const colors = await page.evaluate(() => ({
        background: getComputedStyle(document.getElementById('poster-capture')).backgroundColor,
        title: getComputedStyle(document.querySelector('.title-planning')).color,
        game: getComputedStyle(document.querySelector('.game-title')).color,
        muted: getComputedStyle(document.querySelector('.game-sub')).color,
        surfaces: [...document.querySelectorAll('.day-card, .event-info')].map(element => getComputedStyle(element).backgroundColor)
      }));
      assert.equal(colors.background, 'rgb(17, 34, 51)', `${look} uses custom poster background`);
      assert.equal(colors.title, 'rgb(237, 240, 244)', `${look} uses custom title text`);
      assert.equal(colors.game, 'rgb(237, 240, 244)', `${look} uses custom game text`);
      assert.equal(colors.muted, 'rgb(175, 189, 206)', `${look} uses custom secondary text`);
      assert.ok(colors.surfaces.includes('rgb(34, 51, 68)'), `${look} uses custom card surface`);
    }
    await page.evaluate(() => { document.getElementById('select-look').value = 'cards'; updateAppearance(); });
    await page.screenshot({ path: path.join(artifactDir, 'studio-color-editor.png') });
    await page.evaluate(() => swapAccentColors());
    assert.equal(await page.locator('#color-prim').inputValue(), customColors.secondary);
    assert.equal(await page.locator('#color-sec').inputValue(), customColors.primary);
    await page.locator('#keep-colors').check();
    await page.evaluate(() => applyScene('sakura'));
    assert.equal(await page.locator('body').getAttribute('data-scene'), 'sakura');
    assert.equal(await page.locator('#color-prim').inputValue(), customColors.secondary, 'Color lock preserves accents when scene changes');
    assert.equal(await page.locator('#color-background').inputValue(), customColors.background);
    await page.waitForTimeout(600);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('#keep-colors').isChecked(), true);
    assert.equal(await page.locator('#color-prim').inputValue(), customColors.secondary);
    assert.equal(await page.locator('#color-background').inputValue(), customColors.background);
    assert.equal(await page.locator('body').getAttribute('data-scene'), 'sakura');
    await page.locator('#keep-colors').uncheck();
    await page.evaluate(() => resetSceneColors());
    const resetConfig = await page.evaluate(() => { saveConfig(); return JSON.stringify(schedule); });
    assert.equal(resetConfig, initialSchedule, 'Palette reset preserves events');
    assert.notEqual(await page.locator('#color-prim').inputValue(), customColors.secondary);
    await page.waitForTimeout(600);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('#select-theme').inputValue(), 'sakura', 'Reset theme selection persists');
    assert.equal(await page.locator('body').getAttribute('data-custom-colors'), null, 'Reset does not restore obsolete custom overrides');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('squadir_planning_save')).customPalette), null);
    const paletteButton = page.locator('#color-editor [onclick^="applyColorPalette"]').first();
    assert.equal(await paletteButton.count(), 1, 'Ready-made color palettes are offered');
    await page.locator('#color-editor').evaluate(element => { element.open = true; });
    await paletteButton.click();
    assert.equal(await page.locator('body').getAttribute('data-theme'), 'custom');
    for (const palette of ['paper', 'lavender']) {
      for (const look of ['original', 'esport']) {
        await page.evaluate(({ palette, look }) => { applyColorPalette(palette); document.getElementById('select-look').value = look; updateAppearance(); }, { palette, look });
        const lightPalette = await page.evaluate(() => ({ appliedSurface: getComputedStyle(document.querySelector('.event-info')).backgroundColor, chosenSurface: document.getElementById('color-surface').value }));
        const rgb = lightPalette.chosenSurface.slice(1).match(/../g).map(hex => parseInt(hex, 16));
        assert.equal(lightPalette.appliedSurface, `rgb(${rgb.join(', ')})`, `${palette} gives ${look} a readable text panel on photographs`);
      }
      await page.locator('#poster-capture').screenshot({ path: path.join(artifactDir, `palette-${palette}-esport.png`) });
    }
    await page.evaluate(() => resetSceneColors());

    await page.evaluate(() => localStorage.setItem('squadir_planning_save', JSON.stringify({theme:'custom',cp:'#123456',cs:'#aabbcc',look:'minimal',schedule})));
    await page.reload({ waitUntil: 'networkidle' });
    const migratedColors = await page.evaluate(() => ({ primary: document.getElementById('color-prim').value, secondary: document.getElementById('color-sec').value, background: getComputedStyle(document.getElementById('poster-capture')).backgroundColor, text: getComputedStyle(document.querySelector('.game-title')).color }));
    assert.deepEqual(migratedColors, { primary:'#123456', secondary:'#aabbcc', background:'rgb(244, 242, 236)', text:'rgb(24, 36, 50)' }, 'Legacy custom accents migrate with the minimal look colors');
    assert.equal(await page.evaluate(() => JSON.stringify(schedule)), initialSchedule);
    await page.evaluate(() => applyScene('halloween'));

    await page.evaluate(() => {
      const originalCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = function (blob) {
        window.__planningExportBlob = blob;
        return originalCreateObjectURL.call(URL, blob);
      };
      const originalHtml2canvas = window.html2canvas;
      window.html2canvas = function (element, options) {
        const originalOnclone = options.onclone;
        options.onclone = function (doc) {
          if (originalOnclone) originalOnclone(doc);
          const poster = doc.getElementById('poster-capture').getBoundingClientRect();
          const days = [...doc.querySelectorAll('.day-col')].map(day => day.getBoundingClientRect());
          const grid = doc.getElementById('poster-grid-container').getBoundingClientRect();
          const badge = doc.querySelector('.twitch-badge').getBoundingClientRect();
          const dayNames = [...doc.querySelectorAll('.day-name')].map(name => name.getBoundingClientRect());
          window.__planningCloneGeometry = {
            width: poster.width, height: poster.height, days: days.length,
            noTagline: !doc.querySelector('#edition-label, #poster-capture .edition-label, #poster-capture .poster-tagline'),
            allDaysContained: days.every(day => day.left >= poster.left && day.right <= poster.right && day.top >= poster.top && day.bottom <= poster.bottom),
            allDayNamesContained: dayNames.every(name => name.left >= poster.left && name.right <= poster.right),
            gridAboveBadge: grid.bottom <= badge.top + 2
          };
        };
        return originalHtml2canvas(element, options);
      };
    });
    for (const [scene, format, width, height, colors] of [['halloween', 'horizontal', 1920, 1080, null], ['christmas', 'vertical', 1080, 1920, null], ['aurora', 'horizontal', 1920, 1080, customColors]]) {
      await page.evaluate(({ scene, format, colors }) => {
        applyScene(scene);
        document.getElementById('select-format').value = format;
        updateFormat(format);
        if (colors) Object.entries(colors).forEach(([key, value]) => updateColor(key, value));
      }, { scene, format, colors });
      await page.waitForTimeout(150);
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 30000 }),
        page.locator('#export-btn').click()
      ]);
      const filename = path.join(artifactDir, `${scene}${colors ? '-custom' : ''}-${format}-export.png`);
      try { await download.saveAs(filename); }
      catch (error) {
        // Some desktop sandboxes cancel OS downloads; validate the actual PNG Blob produced by the app.
        if (!String(error).includes('canceled')) throw error;
        const bytes = await page.evaluate(async () => Array.from(new Uint8Array(await window.__planningExportBlob.arrayBuffer())));
        fs.writeFileSync(filename, Buffer.from(bytes));
      }
      const image = fs.readFileSync(filename);
      assert.equal(image.toString('hex', 0, 8), '89504e470d0a1a0a');
      assert.equal(image.readUInt32BE(16), width);
      assert.equal(image.readUInt32BE(20), height);
      const geometry = await page.evaluate(() => window.__planningCloneGeometry);
      assert.equal(geometry.width, width, `${format} capture DOM width`);
      assert.equal(geometry.height, height, `${format} capture DOM height`);
      assert.equal(geometry.days, 7, `${format} capture has all seven days`);
      assert.equal(geometry.noTagline, true, `${format} export has no poster tagline`);
      assert.equal(geometry.allDaysContained, true, `${format} capture contains all seven days`);
      assert.equal(geometry.allDayNamesContained, true, `${format} capture does not cut off day names`);
      assert.equal(geometry.gridAboveBadge, true, `${format} capture grid does not overlap footer`);
      assert.match(await page.locator('#export-status').textContent(), /PNG prêt/);
    }

    await page.evaluate(() => setStudioFormat('vertical'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(150);
    const overflow = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
    assert.ok(overflow.page <= overflow.viewport + 2, `Mobile page width ${overflow.page} fits ${overflow.viewport}`);
    const mobilePortrait = await page.evaluate(() => {
      const area = document.querySelector('.preview-area').getBoundingClientRect();
      const poster = document.getElementById('poster-capture').getBoundingClientRect();
      return { area: { top: area.top, bottom: area.bottom, left: area.left, right: area.right }, poster: { top: poster.top, bottom: poster.bottom, left: poster.left, right: poster.right } };
    });
    assert.ok(mobilePortrait.poster.top >= mobilePortrait.area.top - 1 && mobilePortrait.poster.bottom <= mobilePortrait.area.bottom + 1, 'Mobile portrait poster is contained vertically in preview');
    assert.ok(mobilePortrait.poster.left >= mobilePortrait.area.left - 1 && mobilePortrait.poster.right <= mobilePortrait.area.right + 1, 'Mobile portrait poster is contained horizontally in preview');
    await page.screenshot({ path: path.join(artifactDir, 'studio-mobile.png'), fullPage: true });
    assert.deepEqual(errors, [], 'No JavaScript page errors');
    fs.writeFileSync(path.join(artifactDir, 'layouts.json'), JSON.stringify(layouts, null, 2));
    console.log(`OK: ${sceneIds.length} scenes in both formats, no taglines, six-color editor across poster styles, invalid hex, swap, palette lock/reset/presets, persistence, schedule preservation, gallery filters/keyboard, mobile portrait bounds, export geometry and three PNGs including custom colors.`);
    console.log(`Browser artifacts: ${artifactDir}`);
  } finally {
    if (browser) await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
