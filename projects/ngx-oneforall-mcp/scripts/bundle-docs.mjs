/**
 * Bundles all documentation into data/docs.json for publishing.
 *
 * This script is run as a prebuild step (before `tsc`) so that
 * the published npm package contains all docs as bundled data.
 *
 * Usage: node scripts/bundle-docs.mjs
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
} from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MCP_ROOT = resolve(__dirname, '..');
const PROJECT_ROOT = resolve(MCP_ROOT, '..', '..');
const CATEGORIES_DIR = join(
  PROJECT_ROOT,
  'projects/ngx-oneforall-docs/src/app/categories'
);
const OUTPUT_FILE = join(MCP_ROOT, 'data', 'docs.json');
const BASE_URL = 'https://love1024.github.io/ngx-oneforall';

const CATEGORY_ORDER = [
  ['getting-started', 'Getting Started'],
  ['constants', 'Constants'],
  ['decorators', 'Decorators'],
  ['directives', 'Directives'],
  ['guards', 'Guards'],
  ['interceptors', 'Interceptors'],
  ['pipes', 'Pipes'],
  ['rxjs', 'RxJS'],
  ['services', 'Services'],
  ['signals', 'Signals'],
  ['types', 'Types'],
  ['utils', 'Utils'],
  ['validators', 'Validators'],
];

function extractTitle(pageFilePath) {
  const content = readFileSync(pageFilePath, 'utf-8');
  const match = content.match(/title:\s*['"`]([^'"`]+)/);
  return match ? match[1] : null;
}

function extractDescription(mdFilePath) {
  if (!existsSync(mdFilePath)) return '';
  const content = readFileSync(mdFilePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (
      trimmed &&
      /^[A-Z]/.test(trimmed) &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('!') &&
      !trimmed.startsWith('{')
    ) {
      return trimmed
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1');
    }
  }
  return '';
}

function getFullContent(mdFilePath) {
  if (!existsSync(mdFilePath)) return '';
  return readFileSync(mdFilePath, 'utf-8')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/!\[Bundle Size\][^\n]*/g, '')
    .trim();
}

function buildRouteMap() {
  const routesFile = join(PROJECT_ROOT, 'ng-doc/ngx-oneforall-docs/routes.ts');
  if (!existsSync(routesFile)) return new Map();
  const content = readFileSync(routesFile, 'utf-8');
  const routeMap = new Map();
  const categoryBlockRegex =
    /path:\s*'([^']+)',\s*\n\s*title:\s*`[^`]+`[\s\S]*?children:\s*\[([\s\S]*?)\],\s*\n\s*\}/g;
  let catMatch;
  while ((catMatch = categoryBlockRegex.exec(content)) !== null) {
    const catPath = catMatch[1];
    const childrenBlock = catMatch[2];
    const pageRegex =
      /path:\s*'([^']+)',[\s\S]*?import\('\.\/guides\/app\/categories\/[^/]+\/pages\/([^/]+)\/page'\)/g;
    let pageMatch;
    while ((pageMatch = pageRegex.exec(childrenBlock)) !== null) {
      routeMap.set(`${catPath}/${pageMatch[2]}`, pageMatch[1]);
    }
  }
  return routeMap;
}

// --- Main ---

const routeMap = buildRouteMap();
const utilities = [];

for (const [dirName, displayTitle] of CATEGORY_ORDER) {
  const pagesDir = join(CATEGORIES_DIR, dirName, 'pages');
  if (!existsSync(pagesDir)) continue;

  for (const entry of readdirSync(pagesDir)) {
    const pageDir = join(pagesDir, entry);
    if (!statSync(pageDir).isDirectory()) continue;

    const pageFile = join(pageDir, 'ng-doc.page.ts');
    const mdFile = join(pageDir, 'index.md');
    if (!existsSync(pageFile)) continue;

    const title = extractTitle(pageFile);
    if (!title) continue;

    const routeKey = `${dirName}/${entry}`;
    const routePath = routeMap.get(routeKey) || entry;

    utilities.push({
      name: title,
      category: dirName,
      categoryTitle: displayTitle,
      dirName: entry,
      routePath,
      importPath: `ngx-oneforall/${dirName}/${entry}`,
      url: `${BASE_URL}/${dirName}/${routePath}`,
      description: extractDescription(mdFile),
      fullContent: getFullContent(mdFile),
    });
  }
}

// Sort within categories
utilities.sort((a, b) => {
  const catOrder =
    CATEGORY_ORDER.findIndex(([d]) => d === a.category) -
    CATEGORY_ORDER.findIndex(([d]) => d === b.category);
  if (catOrder !== 0) return catOrder;
  return a.name.localeCompare(b.name);
});

// Write bundled data
mkdirSync(join(MCP_ROOT, 'data'), { recursive: true });
writeFileSync(OUTPUT_FILE, JSON.stringify({ utilities }, null, 2), 'utf-8');

console.log(`✅ Bundled ${utilities.length} utilities into data/docs.json`);
