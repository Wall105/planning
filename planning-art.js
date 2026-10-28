/* Local vector artwork: no image requests, animations, or SVG filter dependencies. */
(function () {
    'use strict';

    const star = '<path d="m12 1 2.6 7.9H23l-6.8 4.9 2.6 8L12 16.9l-6.8 4.9 2.6-8L1 8.9h8.4Z" fill="currentColor"/>';
    const sparkle = '<path d="M12 1v22M1 12h22M5 5l14 14M5 19 19 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>';
    const leaf = '<path d="M3 21C-1 9 8 1 22 2c1 12-5 22-17 19Zm1 0L18 6" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="1.4"/>';
    const flake = '<path d="M12 1v22M2.5 6.5l19 11M2.5 17.5l19-11M8 4l4 4 4-4M8 20l4-4 4 4M3.5 11l5.5-1.5L7.5 4M16.5 20 15 14.5l5.5-1.5M3.5 13l5.5 1.5L7.5 20M16.5 4 15 9.5l5.5 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>';
    const blossom = '<path d="M12 10C2-1-4 11 8 13-4 17 7 28 12 17c5 11 16 0 4-4C28 11 22-1 12 10Z" fill="currentColor" fill-opacity=".6"/><circle cx="12" cy="13" r="2" fill="#fff1d1"/>';
    const bat = '<path d="M1 13 4 3l6 6 2-4 2 4 6-6 3 10-5-2-2 6-4-3-4 3-2-6Z" fill="currentColor"/>';
    const crescent = '<path d="M17 2a10 10 0 1 0 5 17A11 11 0 0 1 17 2Z" fill="currentColor"/>';
    const wave = '<path d="M1 10c4-7 8-7 12 0s8 7 12 0M1 18c4-7 8-7 12 0s8 7 12 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
    const sun = '<circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>';
    const heart = '<path d="M12 21 3.3 12.4C-3.4 5.6 6.3-2.1 12 5.6 17.7-2.1 27.4 5.6 20.7 12.4Z" fill="currentColor" fill-opacity=".7"/>';
    const pixelHeart = '<path d="M2 3h6v3h3V3h6v3h3v9h-3v3h-3v3h-3v-3H8v-3H5v-3H2Z" fill="currentColor"/>';

    function illustration(content, placement) {
        // Keep positioning on an HTML wrapper: html2canvas otherwise copies the SVG's
        // absolute inset into its standalone bitmap and shifts the drawing out of view.
        return '<span class="scene-art scene-art--' + placement + '"><svg viewBox="0 0 360 240" width="360" height="240" style="display:block;width:100%;height:100%;overflow:visible" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" focusable="false">' + content + '</svg></span>';
    }

    function particle(content, x, y, size, rotation) {
        return '<span class="scene-particle" style="left:' + x + '%;top:' + y + '%;width:' + size + 'px;height:' + size + 'px;transform:rotate(' + rotation + 'deg)"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + content + '</svg></span>';
    }

    const art = {
        halloween: {
            corner: '<path d="M280 15a71 71 0 1 0 39 122A81 81 0 0 1 280 15Z" fill="#f5ba68" fill-opacity=".8"/>' +
                '<g color="#a99ade" transform="translate(120 36) scale(2.3)">' + bat + '</g><g color="#a99ade" transform="translate(190 147) scale(1.4) rotate(-15)">' + bat + '</g>' +
                '<path d="M85 180c0-29 13-48 33-48s33 19 33 48v28l-11-8-11 8-11-8-11 8-11-8-11 8Z" fill="#e8dbff" fill-opacity=".7"/><ellipse cx="109" cy="166" rx="3" ry="5" fill="#21142e"/><ellipse cx="127" cy="166" rx="3" ry="5" fill="#21142e"/>' +
                '<path d="m302 177 7-13 6 2-8 13" fill="#8e9c69"/><ellipse cx="301" cy="198" rx="30" ry="26" fill="#dd7b36"/><ellipse cx="301" cy="198" rx="17" ry="26" stroke="#ffbd72" stroke-opacity=".7"/><path d="m283 192 8-6 4 9Zm23 3 5-9 8 6Zm-19 8 8 4 6-3 6 3 8-4-7 12h-14Z" fill="#38202e"/>' +
                '<circle cx="191" cy="22" r="2" fill="#ffd29c"/><circle cx="331" cy="158" r="2" fill="#ffd29c"/>',
            bottom: '<path d="M-10 240c47-35 75-66 96-107m-42 54-25-7m41-13-3-27m14 8 22-6m-55 57 9 20m52-92-4-25m5 24 22-13" stroke="#8a7897" stroke-width="2" stroke-linecap="round"/><path d="M123 240c-2-18 4-39 17-49m-9 20-13-8m18 0 2-17" stroke="#8a7897" stroke-width="2"/>',
            icon: bat
        },
        christmas: {
            corner: '<path d="M360 10C281 35 212 67 152 99m137-63-10 33m-6-26-29 2m10 6-8 30m-5-25-29 3m10 6-9 30m-6-23-29 3m7 7-8 28m-4-21-27 5" stroke="#66a78d" stroke-width="4" stroke-linecap="round"/>' +
                '<path d="M360 5c-19 43-38 78-68 117m35-62 21 1m-26 11-4-23m-4 34 22 4m-31 8-2-22m-4 33 20 5" stroke="#99bc91" stroke-width="3" stroke-linecap="round"/>' +
                '<path d="M220 63v61m63-84v105m-108-62v60" stroke="#dfca83" stroke-width="1.3"/>' +
                '<circle cx="220" cy="146" r="23" fill="#c65c64"/><circle cx="283" cy="166" r="20" fill="#dfca83"/><circle cx="175" cy="158" r="15" fill="#77a58e"/>' +
                '<path d="m201 136 38 20m-38-9 29 15M269 154l28 20M164 156l22 7" stroke="#f5ead4" stroke-opacity=".55" stroke-width="2"/><path d="M214 125h12v5h-12Zm63 20h12v5h-12Zm-107-4h10v5h-10Z" fill="#e9d8a4"/>' +
                '<g color="#e5c47c" transform="translate(105 35) scale(1.5)">' + star + '</g><g color="#e5c47c" transform="translate(317 188)">' + sparkle + '</g>',
            bottom: '<path d="M-10 234c75-7 141-40 195-83m-136 73 12-24m5 19 27 8m-9-15 8-29m6 22 26 5m-7-15 8-28m8 19 25 3m-5-16 6-22" stroke="#70a68b" stroke-width="3" stroke-linecap="round"/><circle cx="106" cy="202" r="5" fill="#c65c64"/><circle cx="119" cy="198" r="5" fill="#c65c64"/><circle cx="114" cy="210" r="5" fill="#c65c64"/>',
            icon: star
        },
        autumn: {
            corner: '<path d="M360 8C297 51 246 95 209 168m91-119-44-10m26 28 11 32m-35-9-43-5m24 35 12 31m-34-7-41-3" stroke="#a48f6a" stroke-width="2.5" stroke-linecap="round"/>' +
                '<path d="M257 41c-14-31-46-33-61-24 13 24 32 32 61 24Z" fill="#b87940"/><path d="M293 100c29-2 47-23 44-47-27 2-45 15-44 47Z" fill="#8e9a70"/><path d="M216 85c-18-28-45-30-63-21 9 24 31 36 63 21Z" fill="#d6a263"/><path d="M253 152c27-6 40-26 33-49-23 6-38 22-33 49Z" fill="#bd674b"/><path d="M177 141c-14-26-41-28-59-19 9 23 29 31 59 19Z" fill="#a3905b"/>' +
                '<path d="m111 58 7-16 9 7 10-8 1 14 16 2-14 9 4 17-14-7-11 12 1-17-15-5Z" fill="#c98542"/><path d="m123 69-10 24" stroke="#d8b17b" stroke-width="1.5"/><path d="m314 179 4-13 9 6 11-5-3 13 11 6-13 3-1 14-9-9-12 5 5-12-9-7Z" fill="#c38958"/>',
            bottom: '<path d="M-8 240c31-15 61-33 85-61m-41 37c-24-4-30-18-28-35 21 4 33 16 28 35m22-16c-9-24-2-39 12-49 11 20 8 37-12 49m16-18c18 6 37-1 45-18-21-9-35-2-45 18" stroke="#a48f6a" stroke-width="1.5" fill="#9b8d5c" fill-opacity=".6"/>',
            icon: leaf
        },
        winter: {
            corner: '<g color="#b8e2ed" transform="translate(211 22) scale(4.5)">' + flake + '</g><g color="#95b8dc" transform="translate(109 104) scale(2.7)">' + flake + '</g><g color="#d7edf5" transform="translate(300 157) scale(1.8)">' + flake + '</g>' +
                '<path d="m168 36 4 8-4 8-4-8Zm151 90 4 8-4 8-4-8Zm-115 54 4 8-4 8-4-8Z" fill="#c6e8f5"/><circle cx="122" cy="66" r="2" fill="#b8e2ed"/><circle cx="304" cy="22" r="3" fill="#b8e2ed"/>',
            bottom: '<path d="M-10 218c70-20 111-5 164 8s122 3 175-12M-10 235c77-16 121 4 184 4s103-20 173-10" stroke="#a8c9dd" stroke-width="1.5"/><g color="#b8e2ed" transform="translate(37 167) scale(2)">' + flake + '</g>',
            icon: flake
        },
        spring: {
            corner: '<path d="M354 236C312 156 279 97 238 48m86 129-65-11m49-17 22-53m-41 19-50-7m30-22 9-38" stroke="#8ca88c" stroke-width="2.5" stroke-linecap="round"/>' +
                '<path d="M260 166c-8-24-27-32-48-26 8 23 25 33 48 26Zm70-69c-4-22 5-37 23-43 5 21-2 36-23 43Zm-90 10c-12-20-31-24-47-14 11 20 28 25 47 14Z" fill="#8da58b"/>' +
                '<g transform="translate(224 40)"><ellipse cy="-16" rx="7" ry="16" fill="#f0e8be"/><ellipse cy="16" rx="7" ry="16" fill="#f0e8be"/><ellipse cx="-16" rx="16" ry="7" fill="#f0e8be"/><ellipse cx="16" rx="16" ry="7" fill="#f0e8be"/><circle r="9" fill="#d9b75c"/></g>' +
                '<g transform="translate(280 47) rotate(20) scale(.65)"><ellipse cy="-16" rx="7" ry="16" fill="#f3e8cf"/><ellipse cy="16" rx="7" ry="16" fill="#f3e8cf"/><ellipse cx="-16" rx="16" ry="7" fill="#f3e8cf"/><ellipse cx="16" rx="16" ry="7" fill="#f3e8cf"/><circle r="9" fill="#d9b75c"/></g>' +
                '<path d="M151 116c-23-23-39-4-17 9-15 21 10 27 17 3 7 24 32 18 17-3 22-13 6-32-17-9Z" fill="#d4bd7b"/><path d="M151 116v20" stroke="#8c8d6d" stroke-width="1.5"/>',
            bottom: '<path d="M-5 240c39-32 83-58 136-68M37 214c-8-20-22-26-37-21 7 18 19 26 37 21m27-17c1-20 11-32 28-32 0 17-9 29-28 32m33-16c11 13 27 15 43 4-13-12-27-13-43-4" fill="#8da58b" fill-opacity=".6" stroke="#8da58b" stroke-width="1.5"/>',
            icon: leaf
        },
        summer: {
            corner: '<circle cx="243" cy="103" r="64" fill="#efb177" fill-opacity=".85"/><path d="M162 148h167m-185 13h204m-220 14h218m-204 14h174" stroke="#efb177" stroke-width="3" stroke-linecap="round"/>' +
                '<path d="M308 226c-2-67-18-112-44-151" stroke="#78ad9f" stroke-width="9" stroke-linecap="round"/><path d="M266 78c-41-18-79-13-103 18 40-7 68-7 103-18Zm0 0c-45-45-84-48-111-29 40 0 74 12 111 29Zm0 0c-4-46 15-70 46-71-18 25-33 47-46 71Zm0 0c31-23 65-17 85 7-34-7-58-9-85-7Zm0 0c38 6 56 28 53 60-18-28-33-43-53-60Z" fill="#78ad9f"/><path d="M104 55c10-9 20-9 30 0 10-9 20-9 30 0" stroke="#efc7a0" stroke-width="2" stroke-linecap="round"/>',
            bottom: '<path d="M-10 208c34-15 58-15 82 0s48 15 72 0 48-15 72 0 48 15 72 0M-10 224c34-15 58-15 82 0s48 15 72 0 48-15 72 0 48 15 72 0" stroke="#86c8bf" stroke-width="2"/><circle cx="41" cy="172" r="9" stroke="#efb177" stroke-width="2"/>',
            icon: sun
        },
        sakura: {
            corner: '<path d="M368 10C299 62 254 104 197 170m100-108 19-43m-39 62-52-6m26 32 16 40m-39-13-51-4" stroke="#b696a6" stroke-width="3" stroke-linecap="round"/>' +
                '<g color="#e0a4bf" transform="translate(290 9) scale(2.7)">' + blossom + '</g><g color="#f0bfd0" transform="translate(202 49) scale(2.9)">' + blossom + '</g><g color="#db9cb7" transform="translate(243 123) scale(2.1)">' + blossom + '</g><g color="#edb5ce" transform="translate(146 104) scale(2.4)">' + blossom + '</g>' +
                '<path d="M143 42c-16-10-22 2-8 12 2 10 17 4 8-12Zm182 145c-13-10-22 0-10 12 1 10 17 5 10-12Zm-148 27c-13-10-22 0-10 12 1 10 17 5 10-12Z" fill="#eab7d0"/>',
            bottom: '<path d="M-10 237c43-18 78-43 106-71m-51 47-13-26m35 11 30 3" stroke="#b696a6" stroke-width="2"/><g color="#e7adc8" transform="translate(8 162) scale(1.8)">' + blossom + '</g><g color="#edbdd3" transform="translate(79 180) scale(1.5)">' + blossom + '</g>',
            icon: blossom
        },
        synthwave: {
            corner: '<path d="M174 82a71 71 0 0 1 142 0Zm-1 8h144v9H173Zm2 18h140v8H175Zm5 17h130v7H180Zm8 16h114v6H188Zm14 15h86v5h-86Zm24 14h38v4h-38Z" fill="#e48cbd"/><path d="M112 193h244M93 210h267M73 234h287M245 193l-60 47m60-47 60 47m-60-47-131 47m131-47 131 47" stroke="#7fc6d3" stroke-width="1.2"/><path d="m101 177 25-28 17 10 22-33 30 51m-16-25 12-13 17 19" stroke="#aa8bd7" stroke-width="1.5"/>',
            bottom: '<path d="M-10 235 52 171l30 28 37-45 67 81m-158-2 27-33 28 31m33-45 17 14 12-8 37 40" stroke="#aa8bd7" stroke-width="1.5"/><path d="M0 239h333m-268-3 7-35m64 35-5-35m76 35-13-35" stroke="#7fc6d3" stroke-width="1"/>',
            icon: sparkle
        },
        ocean: {
            corner: '<path d="M112 156c46 18 83 18 109-4 30-26 39-56 20-69-16-12-36-1-39 16 6-4 12-5 18-1 13 11-1 31-17 34-26 6-53 3-91-6" stroke="#82c5c4" stroke-width="3" stroke-linecap="round"/><path d="M100 178c39-10 69 12 100 8s43-29 71-24 52 27 86 14M130 202c32-13 57 8 84 6s44-24 72-19 45 20 71 12M179 226c29-15 52 4 77 0s37-21 59-15 27 11 42 10" stroke="#82c5c4" stroke-width="2" stroke-linecap="round"/>' +
                '<circle cx="301" cy="52" r="5" stroke="#b5dbd7" stroke-width="1.3"/><circle cx="325" cy="83" r="3" stroke="#b5dbd7" stroke-width="1.3"/><circle cx="281" cy="86" r="2" fill="#b5dbd7"/><path d="m155 35 5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1Z" stroke="#c3d4b2" stroke-width="1.5" stroke-linejoin="round"/>',
            bottom: '<path d="M-10 239c53-21 93-8 131-1m-80-1c9-24 11-46 1-64m0 31-21-13m24 25 22-14m21 34c-10-28-7-47 8-63m-9 34 22-17m-19 6-16-11" stroke="#82c5c4" stroke-width="2" stroke-linecap="round"/><path d="M138 235c12-17 15-32 8-46 20 13 22 28 11 46" fill="#82c5c4" fill-opacity=".5"/>',
            icon: wave
        },
        cosmic: {
            corner: '<circle cx="245" cy="109" r="59" fill="#a78cce" fill-opacity=".6"/><path d="M203 84c18 5 38 17 48 29m-48-4c15 4 32 15 42 28m-12-76c20 6 37 16 48 30" stroke="#d0bbdf" stroke-width="2" stroke-opacity=".55"/><ellipse cx="245" cy="109" rx="108" ry="24" transform="rotate(-27 245 109)" stroke="#e5c68c" stroke-width="3"/><path d="M194 79c12-23 31-34 57-29" stroke="#c6aade" stroke-width="3" stroke-linecap="round"/>' +
                '<g color="#e6d6b1" transform="translate(113 40) scale(1.3)">' + sparkle + '</g><g color="#e6d6b1" transform="translate(306 185)">' + star + '</g><g color="#c9b3de" transform="translate(164 193) scale(.8)">' + sparkle + '</g><circle cx="314" cy="34" r="2.5" fill="#dfcfea"/><circle cx="127" cy="158" r="2" fill="#dfcfea"/>',
            bottom: '<path d="m26 205 43-43 48 34 51-20 38 45" stroke="#b39bcf" stroke-width="1"/><circle cx="26" cy="205" r="3" fill="#dfca9d"/><circle cx="69" cy="162" r="3" fill="#dfca9d"/><circle cx="117" cy="196" r="3" fill="#dfca9d"/><circle cx="168" cy="176" r="3" fill="#dfca9d"/><circle cx="206" cy="221" r="3" fill="#dfca9d"/>',
            icon: sparkle
        },
        midnight: {
            corner: '<path d="M278 20a76 76 0 1 0 42 131A87 87 0 0 1 278 20Z" fill="#b2c0da" fill-opacity=".65"/><g color="#bdcae1" transform="translate(161 43) scale(1.15)">' + sparkle + '</g><g color="#bdcae1" transform="translate(319 176) scale(.8)">' + sparkle + '</g><g color="#bdcae1" transform="translate(119 137) scale(.7)">' + star + '</g><circle cx="194" cy="180" r="2" fill="#bdcae1"/><circle cx="329" cy="31" r="2" fill="#bdcae1"/>' +
                '<path d="M128 223c46-20 78-24 111-8s70 17 113-4" stroke="#8299bb" stroke-width="1.5"/>',
            bottom: '<path d="M-10 227c57-26 101-19 141-2s82 15 125-2M-10 240c57-26 101-19 141-2s82 15 125-2" stroke="#8299bb" stroke-width="1.3"/><g color="#bdcae1" transform="translate(63 158)">' + crescent + '</g><g color="#bdcae1" transform="translate(122 181) scale(.65)">' + sparkle + '</g>',
            icon: sparkle
        },
        aurora: {
            corner: '<path d="M102 104C177-2 214 138 284 57s92-10 101 31v28c-42-44-57 38-105 29s-76-104-144 0Z" fill="#71e2b8" fill-opacity=".48"/><path d="M118 120C179 22 211 150 285 78s82-9 94 27" stroke="#a7f0d4" stroke-width="2.5" stroke-linecap="round"/><path d="M141 143c54-76 84 46 137-7s78-49 101-3v34c-41-34-58 31-101 27s-79-86-116-28Z" fill="#b89bea" fill-opacity=".4"/><path d="M155 155c50-66 86 44 130-6s73-29 91-2" stroke="#cab3ed" stroke-width="2" stroke-linecap="round"/>' +
                '<g color="#d6eee1" transform="translate(182 11) scale(1.1)">' + sparkle + '</g><g color="#d6eee1" transform="translate(299 191) scale(.7)">' + star + '</g><circle cx="124" cy="48" r="2" fill="#d6eee1"/><circle cx="329" cy="30" r="2.5" fill="#d6eee1"/><path d="m143 226 25-30 25 30 32-42 38 42 25-23 26 23" stroke="#7da6b0" stroke-width="1.5"/>',
            bottom: '<path d="M-5 218c51-65 82 45 142-5s103-30 138 10M-5 232c51-65 82 45 142-5s103-30 138 10" stroke="#89d7bd" stroke-width="2"/><g color="#cbb6e8" transform="translate(43 166) scale(.8)">' + sparkle + '</g>',
            icon: sparkle
        },
        forest: {
            corner: '<path d="m235 16-24 39h12l-35 45h16l-36 51h54v35h25v-35h55l-37-51h16l-34-45h13Z" fill="#72a77f" fill-opacity=".76"/><path d="m304 86-20 31h10l-28 38h13l-29 39h44v25h19v-25h44l-29-39h13l-28-38h11Z" fill="#a0bf85" fill-opacity=".65"/><path d="M235 55v121m-58-67 16 11m75-11-17 11" stroke="#c3d8a5" stroke-width="1.5" stroke-opacity=".5"/>' +
                '<path d="M126 206c5-38 5-70-1-98m2 19-17-9m18 21 18-12m-17 24-21-9m22 23 21-14m-21 26-23-10m23 25 24-15" stroke="#b4cc94" stroke-width="2" stroke-linecap="round"/><circle cx="176" cy="32" r="2" fill="#d4dca0"/><circle cx="327" cy="61" r="2" fill="#d4dca0"/>',
            bottom: '<path d="M-10 240c54-32 83-58 106-99m-64 76-22-6m36-4-9-25m24 12 21-3m-10-15-3-23m15 8 19-6M116 240c8-23 14-47 14-72m-2 17-16-10m15 24 19-8m-23 24-18-9m13 25 19-11" stroke="#9fbc88" stroke-width="2" stroke-linecap="round"/><path d="M48 204c-20-20-23-40-11-57 17 18 21 37 11 57" fill="#7faa83" fill-opacity=".6"/>',
            icon: leaf
        },
        lava: {
            corner: '<path d="m111 227 83-117 21 8 23-12 29 14 86 107Z" fill="#957e82" fill-opacity=".6"/><path d="m194 110 21 8 23-12 29 14-18 13-12-5-15 10-16-13-16 7Z" fill="#f2a16c"/><path d="m226 126 4 24-14 21 11 25-6 30m20-96 15 28-7 24 21 43" stroke="#ef9965" stroke-width="7" stroke-linecap="round"/><path d="m226 126 4 24-14 21 11 25-6 30m20-96 15 28-7 24 21 43" stroke="#ffd09a" stroke-width="2" stroke-linecap="round"/>' +
                '<path d="M219 88c-10-20-23-26-29-13m44 7c11-26 24-36 31-24m-38-8-4-19m51 66 12-16m-112 26-9-10" stroke="#f6b17a" stroke-width="2.5" stroke-linecap="round"/><path d="m189 48 4-10 4 10-4 8Zm71-24 4-10 4 10-4 8Zm37 91 4-10 4 10-4 8Z" fill="#f4b074"/><circle cx="159" cy="65" r="2" fill="#f6c793"/><circle cx="290" cy="44" r="3" fill="#f6c793"/>',
            bottom: '<path d="m-5 234 38-37 26 27 21-16 44 30m-90-31 5 21 12 12m34-21 12 20" stroke="#b88b7f" stroke-width="2"/><path d="M19 235c38-16 59 13 98 1s58-13 92-1" stroke="#f0a371" stroke-width="2.5"/><path d="m67 164 4-10 4 10-4 8Zm67 30 3-8 3 8-3 6Z" fill="#f0a371"/>',
            icon: sparkle
        },
        arcade: {
            corner: '<path d="M177 83h112c15 0 24 12 28 28l15 63c4 17-9 30-22 18l-29-27h-96l-28 27c-14 12-27-1-23-18l15-63c4-16 13-28 28-28Z" stroke="#b5a7ed" stroke-width="3" fill="#938bd8" fill-opacity=".18"/><path d="M180 109v34m-17-17h34" stroke="#f0bd73" stroke-width="7" stroke-linecap="square"/><circle cx="277" cy="116" r="6" fill="#e8cf9c"/><circle cx="292" cy="131" r="6" fill="#e8cf9c"/><path d="M220 140h11m10 0h11" stroke="#c5b9ed" stroke-width="3" stroke-linecap="round"/><path d="M233 82V66c0-13 17-13 17-27" stroke="#b5a7ed" stroke-width="2.5"/>' +
                '<g color="#f0bd73" transform="translate(121 19) scale(1.5)">' + pixelHeart + '</g><g color="#e8cf9c" transform="translate(302 28)">' + pixelHeart + '</g><path d="M108 157h7v7h7v7h-7v7h-7v-7h-7v-7h7ZM298 211h5v5h5v5h-5v5h-5v-5h-5v-5h5Z" fill="#c0a6ec"/>',
            bottom: '<path d="M-3 232h24v-14h22v-18h24v-20h24v20h24v18h24v14h24" stroke="#e8cf9c" stroke-width="2"/><g color="#f0bd73" transform="translate(42 151) scale(.85)">' + pixelHeart + '</g><path d="M137 187h6v6h6v6h-6v6h-6v-6h-6v-6h6Z" fill="#b8a0e8"/>',
            icon: pixelHeart
        },
        newyear: {
            corner: '<g stroke="#eac98a" stroke-width="2.5" stroke-linecap="round"><path d="M246 68V24m0 89v44m-45-89h-44m89 0h44m-76-32-31-31m63 63 31 31m-63-31-31 31m63-63 31-31"/><path d="m232 44-10-24m38 24 10-24m0 62 24 10m-72-10-24 10m34 0-10 24m38-24 10 24" stroke-opacity=".6"/></g><g stroke="#bca1df" stroke-width="1.8" stroke-linecap="round"><path d="M143 156v-23m0 46v23m-23-46H97m69 0h23m-62-16-16-16m48 48 16 16m-48-16-16 16m48-48 16-16"/></g><path d="m301 160 4-11 5 11 11 4-11 5-5 11-4-11-11-5Z" fill="#f0d6a1"/><path d="m115 56 8-4 4 8-8 4Zm204 51 8-4 4 8-8 4ZM206 188h6v12h-6Z" fill="#e3bb89"/><path d="M287 202c12-12 22 8 34-4m-207-94c10 11 20-9 30 1" stroke="#d0b2e7" stroke-width="2" stroke-linecap="round"/>',
            bottom: '<g color="#e7c791" transform="translate(42 164) scale(1.7)">' + sparkle + '</g><path d="m18 225 8-4 4 8-8 4Zm96-17 8-4 4 8-8 4ZM79 149h6v12h-6Z" fill="#c7acdf"/><path d="M104 234c17-14 24 7 39-6m-100-28c10 10 17-9 27-1" stroke="#e7c791" stroke-width="2" stroke-linecap="round"/>',
            icon: star
        },
        valentine: {
            corner: '<g color="#e79bb8" transform="translate(176 39) scale(5.3)">' + heart + '</g><g color="#cda8df" transform="translate(125 152) scale(1.8) rotate(-16 12 12)">' + heart + '</g><g color="#f0bfcb" transform="translate(303 157) scale(1.2) rotate(14 12 12)">' + heart + '</g>' +
                '<path d="m154 194 135-135m-16 3 17-4-4 17M161 177l9 1 1 9m-18-1 9 1 1 9" stroke="#f4d0bd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M203 73c-12-6-22 0-24 9" stroke="#f7ccdb" stroke-width="2.5" stroke-linecap="round"/><g color="#edc2d3" transform="translate(130 51) scale(.7)">' + sparkle + '</g><g color="#edc2d3" transform="translate(300 25) scale(.8)">' + sparkle + '</g>',
            bottom: '<path d="M-5 240c46-15 87-38 117-70m-68 48-14-21m32 13 22 4m-3-18 1-22m15 6 20 1" stroke="#c79aaa" stroke-width="2" stroke-linecap="round"/><g color="#e8a1bd" transform="translate(21 172) scale(1.2)">' + heart + '</g><g color="#cda8df" transform="translate(104 205) scale(.8)">' + heart + '</g>',
            icon: heart
        }
    };

    window.planningSceneArt = Object.freeze({
        render: function (scene) {
            const selected = Object.prototype.hasOwnProperty.call(art, scene) ? art[scene] : null;
            if (!selected) return '';
            return illustration(selected.corner, 'corner') + illustration(selected.bottom, 'bottom') +
                particle(selected.icon, 40, 5, 23, -13) +
                particle(selected.icon, 59, 13, 15, 20) +
                particle(selected.icon, 89, 93, 22, -18) +
                particle(selected.icon, 19, 94, 15, 24);
        }
    });
}());
