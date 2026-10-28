/* Complete visual presets. Applying an ambience only changes presentation. */
const scenePresets = {
    none: { name: 'Original', category: 'worlds', description: 'L’énergie esport, violet électrique et cyan.', colors: ['#9d00ff', '#22d3ee', '#100820'], theme: 'cyberpunk', bg: 'classique', look: 'original', radius: 8, neon: 1, italic: true, symbol: '✦' },
    halloween: { name: 'Halloween', category: 'festive', description: 'Clair de lune, citrouilles et frissons de minuit.', colors: ['#ee873c', '#c4a1ed', '#17101f'], bg: 'glow', look: 'cards', radius: 14, neon: .3, symbol: '☾' },
    christmas: { name: 'Noël', category: 'festive', description: 'Vert sapin, touches dorées et esprit de fête.', colors: ['#c45456', '#e4c68e', '#102923'], bg: 'minimal', look: 'cards', radius: 16, neon: .2, symbol: '✧' },
    autumn: { name: 'Automne', category: 'seasons', description: 'Cuivre, sauge et feuilles dorées. Installe-toi au chaud.', colors: ['#ca8054', '#c2c99c', '#30251e'], bg: 'glow', look: 'cards', radius: 18, neon: .1, symbol: '❧' },
    winter: { name: 'Hiver', category: 'seasons', description: 'Bleu givré, cristaux de neige et soirées au calme.', colors: ['#75a9d9', '#d3e9ef', '#172b3d'], bg: 'classique', look: 'esport', radius: 10, neon: .2, symbol: '❄' },
    spring: { name: 'Printemps', category: 'seasons', description: 'Une affiche claire, des fleurs et un nouveau souffle.', colors: ['#89b79b', '#e7d591', '#e9eee5'], bg: 'minimal', look: 'minimal', radius: 18, neon: 0, symbol: '✿' },
    summer: { name: 'Été', category: 'seasons', description: 'Corail, lagon et couchers de soleil après les streams.', colors: ['#f19179', '#8bdbd3', '#172a2d'], bg: 'glow', look: 'cards', radius: 20, neon: .2, symbol: '☀' },
    sakura: { name: 'Sakura', category: 'seasons', description: 'Pétales de cerisier, rose poudré et douceur japonaise.', colors: ['#dda2be', '#c4b2e4', '#f2eaf0'], bg: 'minimal', look: 'minimal', radius: 22, neon: 0, symbol: '❀' },
    synthwave: { name: 'Synthwave', category: 'worlds', description: 'Rose néon, horizon rétro et retour vers les années 80.', colors: ['#ed75c2', '#73dce8', '#241136'], bg: 'grid', look: 'esport', radius: 4, neon: .8, italic: true, symbol: '◒' },
    ocean: { name: 'Océan', category: 'worlds', description: 'Bleu profond, vagues et reflets turquoise.', colors: ['#4eb5b0', '#a9d9ed', '#10333d'], bg: 'glow', look: 'cards', radius: 24, neon: .2, symbol: '≈' },
    cosmic: { name: 'Cosmos', category: 'worlds', description: 'Planètes lointaines, poussière d’or et violet astral.', colors: ['#ad8bd7', '#e1c894', '#251d3b'], bg: 'classique', look: 'cards', radius: 16, neon: .5, symbol: '✷' },
    midnight: { name: 'Minuit', category: 'worlds', description: 'Bleu nuit et argent pour les oiseaux de nuit.', colors: ['#7d9bc3', '#d2d9e4', '#192638'], bg: 'minimal', look: 'esport', radius: 12, neon: 0, symbol: '☾' },
    ...window.planningExtraScenes
};
let activeScene = 'none';
let activeSceneCategory = 'all';

function renderSceneGallery(category = activeSceneCategory) {
    activeSceneCategory = ['all', 'seasons', 'festive', 'worlds'].includes(category) ? category : 'all';
    document.getElementById('scene-gallery').innerHTML = Object.entries(scenePresets)
        .filter(([, preset]) => activeSceneCategory === 'all' || preset.category === activeSceneCategory)
        .map(([id, preset]) => `<button type="button" class="scene-tile" data-scene-id="${id}" aria-pressed="${activeScene === id}" onclick="applyScene('${id}')" title="${preset.description}" style="--swatch-primary:${preset.colors[0]};--swatch-secondary:${preset.colors[1]};--swatch-bg:${preset.colors[2]}">
            <span class="scene-swatch ${preset.look === 'minimal' ? 'scene-swatch--light' : ''}" aria-hidden="true"><span class="swatch-symbol">${preset.symbol}</span><span class="swatch-heading">PLANNING</span><span class="swatch-rule"></span><span class="swatch-days"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></span>
            <span class="scene-tile-name">${preset.name}<span class="scene-check" aria-hidden="true">✓</span></span></button>`).join('');
    document.querySelectorAll('.scene-filter').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === activeSceneCategory)));
    const preset = scenePresets[activeScene];
    document.getElementById('scene-count').textContent = Object.keys(scenePresets).length + ' univers';
    document.getElementById('scene-status').textContent = preset.name;
    document.getElementById('scene-description').textContent = preset.description;
    document.getElementById('preview-scene-name').textContent = preset.name;
}

function applyScene(id) {
    if (!Object.prototype.hasOwnProperty.call(scenePresets, id)) return;
    const keepFocus = document.activeElement?.dataset.sceneId === id;
    const lockedPalette = document.getElementById('keep-colors').checked ? readCurrentPalette() : null;
    const preset = scenePresets[id];
    activeScene = id;
    document.body.dataset.scene = id;
    const controls = {
        'select-theme': preset.theme || id,
        'select-bg': preset.bg,
        'select-look': preset.look,
        'range-radius': preset.radius,
        'range-neon': preset.neon,
        'select-font': "'Oswald', sans-serif"
    };
    Object.entries(controls).forEach(([key, value]) => { document.getElementById(key).value = value; });
    document.getElementById('check-bold').checked = true;
    document.getElementById('check-italic').checked = preset.italic === true;
    changeTheme(preset.theme || id);
    updateBg(preset.bg);
    updateFont();
    updateRadius(preset.radius);
    updateNeon(preset.neon);
    updateAppearance();
    renderSceneGallery();
    if (keepFocus) document.querySelector(`[data-scene-id="${id}"]`).focus({ preventScroll: true });
    renderSceneDecor();
    if (lockedPalette) setCustomPalette(lockedPalette);
    else syncColorInputs();
    fitPreview();
    saveConfig();
}

function renderSceneDecor() {
    document.body.dataset.scene = activeScene;
    document.getElementById('scene-decor').innerHTML = window.planningSceneArt ? window.planningSceneArt.render(activeScene) : '';
    if (document.getElementById('toggle-decor').checked) document.body.classList.remove('scene-decor-hidden');
    else document.body.classList.add('scene-decor-hidden');
}

function updateSceneDecor() {
    renderSceneDecor();
    saveConfig();
}

function setStudioFormat(format) {
    document.getElementById('select-format').value = format;
    updateFormat(format);
}

function syncStudioFormat() {
    const vertical = document.body.classList.contains('vertical-mode');
    document.getElementById('format-horizontal').setAttribute('aria-pressed', String(!vertical));
    document.getElementById('format-vertical').setAttribute('aria-pressed', String(vertical));
    document.getElementById('preview-dimensions').textContent = vertical ? '1080 × 1920 px' : '1920 × 1080 px';
}
