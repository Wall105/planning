/* User colors are independent from the scene's illustrations and layout. */
const colorFields = { primary: 'color-prim', secondary: 'color-sec', background: 'color-background', surface: 'color-surface', text: 'color-text', muted: 'color-muted' };
let customPalette = null;
const colorPalettes = {
    neon: { name: 'Néon', colors: ['#a855f7', '#22d3ee', '#100b1c', '#191226', '#ffffff', '#d9c7f4'] },
    ember: { name: 'Braise', colors: ['#f5824b', '#edbf7c', '#1b1113', '#2c1d21', '#fff8ef', '#e7c8b0'] },
    mint: { name: 'Menthe', colors: ['#70c5a4', '#b9c7ef', '#101e1b', '#1b3029', '#f1fff8', '#bcd9cf'] },
    candy: { name: 'Candy', colors: ['#e49bbe', '#b3a4ec', '#231825', '#352339', '#fff4fa', '#e0c9e8'] },
    ice: { name: 'Glace', colors: ['#72b8eb', '#b7e8ef', '#0d1c2a', '#172c3e', '#f1faff', '#bad3e6'] },
    gold: { name: 'Or', colors: ['#d9b96d', '#e9e3d6', '#171715', '#282720', '#fff9e9', '#d4ccb8'] },
    paper: { name: 'Papier', colors: ['#5b7669', '#9b6078', '#f2eee7', '#fffcf6', '#26372f', '#58695f'] },
    lavender: { name: 'Lavande', colors: ['#8a74b5', '#a46586', '#eee9f4', '#faf7ff', '#352c46', '#73617e'] }
};

function normalizeColor(value) {
    if (typeof value !== 'string') return null;
    const hex = value.trim().replace(/^#/, '');
    if (/^[\da-f]{3}$/i.test(hex)) return '#' + hex.split('').map(char => char + char).join('').toLowerCase();
    return /^[\da-f]{6}$/i.test(hex) ? '#' + hex.toLowerCase() : null;
}

function readCurrentPalette() {
    if (customPalette) return { ...customPalette };
    const preset = scenePresets[activeScene];
    const computed = typeof getComputedStyle === 'function' ? getComputedStyle(document.body) : null;
    const variable = (name, fallback) => normalizeColor(computed?.getPropertyValue(name)) || fallback;
    const light = document.getElementById('select-look').value === 'minimal';
    return {
        primary: variable('--c-prim', preset.colors[0]), secondary: variable('--c-sec', preset.colors[1]),
        background: light ? '#f4f2ec' : variable('--scene-deep', '#05020a'),
        surface: light ? '#ffffff' : variable('--scene-ink', '#080c16'),
        text: light ? '#182432' : '#ffffff', muted: light ? '#455568' : variable('--time1-bord', '#d8c7ee')
    };
}

function contrastText(hex) {
    const channels = hex.slice(1).match(/../g).map(channel => {
        const value = parseInt(channel, 16) / 255;
        return value <= .04045 ? value / 12.92 : Math.pow((value + .055) / 1.055, 2.4);
    });
    const luminance = channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    return (luminance + .05) / .05 >= 1.05 / (luminance + .05) ? '#10151b' : '#ffffff';
}

function setCustomPalette(palette) {
    if (!palette || Object.keys(colorFields).some(key => !normalizeColor(palette[key]))) return false;
    customPalette = Object.fromEntries(Object.keys(colorFields).map(key => [key, normalizeColor(palette[key])]));
    const p = customPalette;
    document.getElementById('select-theme').value = 'custom';
    document.body.setAttribute('data-theme', 'custom');
    document.body.dataset.customColors = 'true';
    document.body.dataset.paletteLight = String(contrastText(p.surface) === '#10151b');
    const variables = {
        '--c-prim': p.primary, '--c-prim-rgb': hexToRgb(p.primary), '--c-prim-light-rgb': hexToRgb(p.primary),
        '--c-sec': p.secondary, '--c-sec-rgb': hexToRgb(p.secondary),
        '--grad-time1': `linear-gradient(110deg, ${p.primary}, ${p.primary})`,
        '--grad-time2': `linear-gradient(110deg, ${p.secondary}, ${p.secondary})`,
        '--time1-bord': p.muted, '--time2-bord': p.muted, '--time2-sub': p.muted,
        '--time2-txt': contrastText(p.secondary), '--studio-primary-ink': contrastText(p.primary),
        '--studio-background': p.background, '--studio-surface': p.surface,
        '--studio-text': p.text, '--studio-muted': p.muted
    };
    Object.entries(variables).forEach(([key, value]) => document.body.style.setProperty(key, value));
    syncColorInputs();
    saveConfig();
    return true;
}

function clearCustomPalette() {
    customPalette = null;
    delete document.body.dataset.customColors;
    delete document.body.dataset.paletteLight;
    ['--c-prim', '--c-prim-rgb', '--c-prim-light-rgb', '--c-sec', '--c-sec-rgb', '--grad-time1', '--grad-time2', '--time1-bord', '--time2-bord', '--time2-sub', '--time2-txt', '--studio-primary-ink', '--studio-background', '--studio-surface', '--studio-text', '--studio-muted'].forEach(key => document.body.style.removeProperty(key));
}

function updateColor(key, value) {
    if (!Object.prototype.hasOwnProperty.call(colorFields, key)) return false;
    const color = normalizeColor(value);
    const field = document.getElementById(colorFields[key] + '-hex');
    // Keep incomplete typing visible until blur; the last valid color stays applied.
    if (!color) { field.setAttribute('aria-invalid', 'true'); return false; }
    return setCustomPalette({ ...readCurrentPalette(), [key]: color });
}

function syncColorInputs() {
    const palette = readCurrentPalette();
    Object.entries(colorFields).forEach(([key, id]) => {
        document.getElementById(id).value = palette[key];
        const hex = document.getElementById(id + '-hex');
        // Do not replace a partially entered HEX code while its input has focus.
        if (document.activeElement !== hex) hex.value = palette[key].toUpperCase();
        hex.setAttribute('aria-invalid', 'false');
    });
    document.getElementById('palette-status').textContent = customPalette ? 'Personnalisée' : 'Palette de l’ambiance';
    const preview = document.getElementById('color-preview');
    Object.entries(palette).forEach(([key, value]) => preview.style.setProperty('--palette-' + key, value));
    document.querySelectorAll('[data-color-palette]').forEach(button => {
        const colors = colorPalettes[button.dataset.colorPalette].colors;
        button.setAttribute('aria-pressed', String(Object.keys(colorFields).every((key, index) => palette[key] === colors[index])));
    });
}

function renderColorPalettes() {
    document.getElementById('palette-presets').innerHTML = Object.entries(colorPalettes).map(([id, palette]) =>
        `<button type="button" data-color-palette="${id}" aria-pressed="false" onclick="applyColorPalette('${id}')"><span aria-hidden="true">${palette.colors.slice(0, 4).map(color => `<i style="background:${color}"></i>`).join('')}</span>${palette.name}</button>`).join('');
}

function applyColorPalette(id) {
    if (!Object.prototype.hasOwnProperty.call(colorPalettes, id)) return false;
    return setCustomPalette(Object.fromEntries(Object.keys(colorFields).map((key, index) => [key, colorPalettes[id].colors[index]])));
}

function swapAccentColors() {
    const palette = readCurrentPalette();
    setCustomPalette({ ...palette, primary: palette.secondary, secondary: palette.primary });
}

function resetSceneColors() {
    changeTheme(scenePresets[activeScene].theme || activeScene);
}
