import fs from 'node:fs';
import path from 'node:path';
import { CONFIG_NAME } from './config.js';

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.svelte-kit', '.output', 'out', 'coverage', '.turbo', '.vercel', 'vendor', 'Pods', '.cache']);
const CODE = /\.(tsx?|jsx?|vue|svelte|astro|mdx)$/;
const STYLE = /\.(css|scss|sass|less|pcss)$/;

const ICON_LIBS = {
  'lucide-react': 'lucide', 'lucide-vue-next': 'lucide', 'lucide-svelte': 'lucide', '@lucide/svelte': 'lucide', 'lucide': 'lucide', 'lucide-react-native': 'lucide', 'lucide-static': 'lucide', 'lucide-solid': 'lucide', 'lucide-angular': 'lucide',
  '@tabler/icons-react': 'tabler', '@tabler/icons-vue': 'tabler', '@tabler/icons-svelte': 'tabler', '@tabler/icons': 'tabler', '@tabler/icons-webfont': 'tabler',
  '@heroicons/react': 'heroicons', '@heroicons/vue': 'heroicons', 'heroicons': 'heroicons',
  '@phosphor-icons/react': 'phosphor', 'phosphor-react': 'phosphor', '@phosphor-icons/vue': 'phosphor', '@phosphor-icons/web': 'phosphor',
  '@hugeicons/react': 'hugeicons', '@hugeicons/core-free-icons': 'hugeicons', 'hugeicons-react': 'hugeicons',
  '@radix-ui/react-icons': 'radix', 'react-icons': 'react-icons', '@mui/icons-material': 'material', '@material-symbols/svg-400': 'material',
  'iconoir-react': 'iconoir', '@iconify/react': 'iconify', 'remixicon': 'remixicon', '@remixicon/react': 'remixicon',
  '@fortawesome/react-fontawesome': 'fontawesome', '@fortawesome/fontawesome-svg-core': 'fontawesome', 'feather-icons': 'feather', 'react-feather': 'feather',
};
const FRAMEWORKS = { next: 'next', react: 'react', vue: 'vue', nuxt: 'nuxt', svelte: 'svelte', '@sveltejs/kit': 'sveltekit', 'solid-js': 'solid', '@angular/core': 'angular', astro: 'astro', 'react-native': 'react-native', expo: 'expo', electron: 'electron', '@tauri-apps/api': 'tauri' };
const TW_RADIUS = { xs: 2, sm: 4, DEFAULT: 4, md: 6, lg: 8, xl: 12, '2xl': 16, '3xl': 24, full: 9999 };
const TW_WEIGHT = { thin: 100, extralight: 200, light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 };
function toPx(v) {
  const m = /^\s*([\d.]+)(px|rem|em)?\s*$/.exec(v.split(/\s+/)[0] || '');
  if (!m) return null;
  const n = Number(m[1]) * (m[2] === 'rem' || m[2] === 'em' ? 16 : 1);
  return Math.round(n * 10) / 10;
}
const TW_SIZE = { '3': 12, '3.5': 14, '4': 16, '4.5': 18, '5': 20, '6': 24, '7': 28, '8': 32, '10': 40, '12': 48 };

export function walk(root, limit = 6000) {
  const files = [];
  const stack = [root];
  while (stack.length && files.length < limit) {
    const dir = stack.pop();
    let ents = [];
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of ents) {
      if (e.name.startsWith('.') && e.name !== '.storybook') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (!SKIP.has(e.name)) stack.push(p); }
      else files.push(p);
    }
  }
  return files;
}

const bump = (m, k, n = 1) => { m[k] = (m[k] || 0) + n; };
const top = (m, n = 12) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);

export function scan(root) {
  const facts = { root };
  const pkgPath = path.join(root, 'package.json');
  const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : null;
  const deps = pkg ? { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies } : {};

  facts.framework = [];
  for (const [d, f] of Object.entries(FRAMEWORKS)) if (deps[d]) facts.framework.push(f);
  facts.typescript = fs.existsSync(path.join(root, 'tsconfig.json'));
  facts.tailwind = !!(deps.tailwindcss || deps['@tailwindcss/vite'] || deps['@tailwindcss/postcss']);

  facts.iconLibraries = [];
  for (const [d, lib] of Object.entries(ICON_LIBS)) if (deps[d]) facts.iconLibraries.push({ package: d, library: lib, version: deps[d] });

  const files = walk(root);
  const libPkgs = Object.keys(ICON_LIBS);
  const iconUse = {}, sizeUse = {}, strokeUse = {}, fonts = {}, weights = {}, radiusPx = {};
  const svgDirs = {};
  for (const f of files) {
    const rel = path.relative(root, f);
    if (f.endsWith('.svg')) { bump(svgDirs, path.dirname(rel)); continue; }
    if (!CODE.test(f) && !STYLE.test(f) && !/tailwind\.config/.test(f)) continue;
    let text;
    try { text = fs.readFileSync(f, 'utf8'); } catch { continue; }
    if (text.length > 400_000) continue;
    for (const m of text.matchAll(/(?:--radius[\w-]*|border-radius)\s*:\s*([^;]+);/g)) { const px = toPx(m[1]); if (px) bump(radiusPx, px); }
    for (const m of text.matchAll(/\brounded(?:-(xs|sm|md|lg|xl|2xl|3xl|full))?(?=[\s"'`])/g)) bump(radiusPx, TW_RADIUS[m[1] || 'DEFAULT']);
    for (const m of text.matchAll(/font-weight\s*:\s*(\d{3})/g)) bump(weights, Number(m[1]));
    for (const m of text.matchAll(/\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g)) bump(weights, TW_WEIGHT[m[1]]);
    for (const m of text.matchAll(/font-family\s*:\s*([^;]+);/g)) bump(fonts, m[1].split(',')[0].replace(/["']/g, '').trim());
    const googleFonts = /import\s*\{([^}]+)\}\s*from\s*["']next\/font\/google["']/.exec(text);
    if (googleFonts) googleFonts[1].split(',').forEach((n) => bump(fonts, n.trim().replace(/_/g, ' ')));
    if (/from\s+["']geist\//.test(text)) bump(fonts, 'Geist');
    const imported = new Set();
    for (const m of text.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/g)) {
      if (!libPkgs.some((p) => m[2] === p || m[2].startsWith(p + '/'))) continue;
      for (const n of m[1].split(',')) {
        const name = n.trim().split(/\s+as\s+/).pop();
        if (name && /^[A-Z]/.test(name)) { imported.add(name); bump(iconUse, n.trim().split(/\s+as\s+/)[0]); }
      }
    }
    for (const name of imported) {
      for (const m of text.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'g'))) {
        const attrs = m[1];
        const s = /size=\{?["']?(\d+)/.exec(attrs);
        if (s) bump(sizeUse, Number(s[1]));
        const tw = /(?:^|[\s"'`])(?:size|w|h)-(\d+(?:\.5)?)\b/.exec(attrs);
        if (tw && TW_SIZE[tw[1]]) bump(sizeUse, TW_SIZE[tw[1]]);
        const sw = /strokeWidth=\{?["']?([\d.]+)/.exec(attrs);
        if (sw) bump(strokeUse, Number(sw[1]));
        if (!s && !tw) bump(sizeUse, 'default');
      }
    }
  }
  facts.iconsInUse = top(iconUse, 30).map(([n, c]) => ({ name: n, uses: c }));
  facts.iconSizes = top(sizeUse, 8).map(([s, c]) => ({ size: s === 'default' ? 'library default (usually 24)' : Number(s), uses: c }));
  facts.strokeWidthOverrides = top(strokeUse, 5).map(([s, c]) => ({ strokeWidth: Number(s), uses: c }));
  facts.fonts = top(fonts, 6).map(([f, c]) => ({ family: f, uses: c }));
  facts.fontWeights = top(weights, 4).map(([w]) => Number(w)).sort((a, b) => a - b);
  facts.radiusPx = top(radiusPx, 5).map(([r]) => Number(r)).filter((r) => r > 0).sort((a, b) => a - b);
  facts.svgFolders = top(svgDirs, 6).map(([d, c]) => ({ dir: d, svgs: c }));
  facts.suggestedDir = ['src/components', 'components', 'src'].map((d) => path.join(d, 'icons')).find((d) => fs.existsSync(path.join(root, path.dirname(d)))) || 'icons';
  facts.existingConfig = fs.existsSync(path.join(root, CONFIG_NAME)) ? CONFIG_NAME : null;
  facts.filesScanned = files.length;
  return facts;
}
