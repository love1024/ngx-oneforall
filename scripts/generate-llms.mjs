/**
 * Generates llms.txt and llms-full.txt for LLM-optimized documentation.
 *
 * Usage: node scripts/generate-llms.mjs
 *
 * Reads ng-doc page metadata (title) and index.md content from the docs
 * categories directory, then produces:
 *   - llms.txt: structured index with links and short descriptions
 *   - llms-full.txt: concatenation of all documentation pages
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
} from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CATEGORIES_DIR = join(
  ROOT,
  'projects/ngx-oneforall-docs/src/app/categories'
);
const OUTPUT_DIR = join(ROOT, 'projects/ngx-oneforall-docs/public');
const BASE_URL = 'https://love1024.github.io/ngx-oneforall';

/**
 * Category display order and labels (matches ng-doc category order).
 * Map from directory name → display title.
 */
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

/**
 * Extract the page title from a ng-doc.page.ts file.
 */
function extractTitle(pageFilePath) {
  const content = readFileSync(pageFilePath, 'utf-8');
  const match = content.match(/title:\s*['"`]([^'"`]+)/);
  return match ? match[1] : null;
}

/**
 * Extract the route path from the directory name.
 * ng-doc uses the page directory name as the route path
 * (or sometimes a custom slug). We parse the generated routes
 * to get the actual path, but since directory names match in most
 * cases we read from the generated routes.ts for accuracy.
 */
function extractRoutesFromGenerated() {
  const routesFile = join(ROOT, 'ng-doc/ngx-oneforall-docs/routes.ts');
  if (!existsSync(routesFile)) {
    console.warn(
      'Warning: ng-doc generated routes.ts not found. Falling back to directory names.'
    );
    return null;
  }

  const content = readFileSync(routesFile, 'utf-8');
  const routes = new Map(); // Map<"category/pageDirName", routePath>

  // Parse the routes structure: top-level path is category, children have page paths
  let currentCategory = null;
  for (const line of content.split('\n')) {
    // Match top-level category path
    const catMatch = line.match(/^\s*path:\s*'([^']+)'/);
    if (catMatch) {
      // Check if this is a top-level category (followed by children)
      currentCategory = catMatch[1];
    }

    // Match child page path + title
    const pageMatch = line.match(/^\s*path:\s*'([^']+)'/);
    if (pageMatch && currentCategory) {
      const titleLine = content.split('\n');
      // We'll use a different approach — regex for the full block
    }
  }

  // Better approach: regex for each route block
  const categoryRegex =
    /path:\s*'([^']+)',\s*\n\s*title:\s*`([^`]+)`[\s\S]*?children:\s*\[([^\]]*(?:\[[^\]]*\][^\]]*)*)\]/g;
  let match;
  while ((match = categoryRegex.exec(content)) !== null) {
    const catPath = match[1];
    const childrenBlock = match[3];

    const childRegex = /path:\s*'([^']+)',\s*\n\s*title:\s*`([^`]+)`/g;
    let childMatch;
    while ((childMatch = childRegex.exec(childrenBlock)) !== null) {
      const pagePath = childMatch[1];
      const pageTitle = childMatch[2];
      routes.set(`${catPath}/${pageTitle}`, pagePath);
      routes.set(`${catPath}/__path__/${pagePath}`, {
        path: pagePath,
        title: pageTitle,
      });
    }
  }

  return routes;
}

/**
 * Extract the first meaningful description line from an index.md file.
 */
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
      // Clean up markdown formatting for the description
      return trimmed
        .replace(/`([^`]+)`/g, '$1') // Remove inline code backticks
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to plain text
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1'); // Remove italic
    }
  }
  return '';
}

/**
 * Get the full markdown content of an index.md, cleaned for llms-full.txt.
 */
function getFullContent(mdFilePath) {
  if (!existsSync(mdFilePath)) return '';

  const content = readFileSync(mdFilePath, 'utf-8');

  // Remove ng-doc template expressions like {{ NgDocActions... }}
  return content
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/!\[Bundle Size\][^\n]*/g, '') // Remove bundle size badges
    .trim();
}

/**
 * Discover all pages in a category directory.
 */
function discoverPages(categoryDir) {
  const pagesDir = join(categoryDir, 'pages');
  if (!existsSync(pagesDir)) return [];

  const pages = [];
  for (const entry of readdirSync(pagesDir)) {
    const pageDir = join(pagesDir, entry);
    if (!statSync(pageDir).isDirectory()) continue;

    const pageFile = join(pageDir, 'ng-doc.page.ts');
    const mdFile = join(pageDir, 'index.md');

    if (!existsSync(pageFile)) continue;

    const title = extractTitle(pageFile);
    if (!title) continue;

    pages.push({
      dirName: entry,
      title,
      description: extractDescription(mdFile),
      fullContent: getFullContent(mdFile),
    });
  }

  // Sort alphabetically by title
  pages.sort((a, b) => a.title.localeCompare(b.title));
  return pages;
}

/**
 * Build the route path map from the generated routes.ts.
 * Returns Map<"categoryPath/pageDirName", routePath>.
 */
function buildRouteMap() {
  const routesFile = join(ROOT, 'ng-doc/ngx-oneforall-docs/routes.ts');
  if (!existsSync(routesFile)) return new Map();

  const content = readFileSync(routesFile, 'utf-8');
  const routeMap = new Map();

  // Parse category blocks with their children
  const categoryBlockRegex =
    /path:\s*'([^']+)',\s*\n\s*title:\s*`[^`]+`[\s\S]*?children:\s*\[([\s\S]*?)\],\s*\n\s*\}/g;
  let catMatch;

  while ((catMatch = categoryBlockRegex.exec(content)) !== null) {
    const catPath = catMatch[1];
    const childrenBlock = catMatch[2];

    // Extract page import paths to get directory names
    const pageRegex =
      /path:\s*'([^']+)',[\s\S]*?import\('\.\/guides\/app\/categories\/[^/]+\/pages\/([^/]+)\/page'\)/g;
    let pageMatch;

    while ((pageMatch = pageRegex.exec(childrenBlock)) !== null) {
      const routePath = pageMatch[1];
      const pageDirName = pageMatch[2];
      routeMap.set(`${catPath}/${pageDirName}`, routePath);
    }
  }

  return routeMap;
}

// ---- Main ----

function main() {
  const routeMap = buildRouteMap();

  const categories = [];

  for (const [dirName, displayTitle] of CATEGORY_ORDER) {
    const categoryDir = join(CATEGORIES_DIR, dirName);
    if (!existsSync(categoryDir)) continue;

    const pages = discoverPages(categoryDir);
    if (pages.length === 0) continue;

    // Resolve the route path for each page
    for (const page of pages) {
      const routeKey = `${dirName}/${page.dirName}`;
      page.routePath = routeMap.get(routeKey) || page.dirName;
      page.url = `${BASE_URL}/${dirName}/${page.routePath}`;
    }

    categories.push({ dirName, displayTitle, pages });
  }

  // ---- Generate llms.txt ----
  const llmsTxtLines = [
    '# ngx-oneforall',
    '',
    '> A collection of 85+ high-quality Angular utilities designed to solve common development challenges.',
    '> Tree-shakable, zero-dependency, SSR-ready, and fully tested with 100% coverage.',
    '',
    '## Docs',
    '',
    `- [Documentation](${BASE_URL}): Full API documentation and demos.`,
    `- [GitHub](https://github.com/love1024/ngx-oneforall): Source code and issue tracker.`,
    `- [npm](https://www.npmjs.com/package/ngx-oneforall): Package registry.`,
    '',
  ];

  for (const category of categories) {
    llmsTxtLines.push(`## ${category.displayTitle}`);
    llmsTxtLines.push('');

    for (const page of category.pages) {
      const desc = page.description ? `: ${page.description}` : '';
      llmsTxtLines.push(`- [${page.title}](${page.url})${desc}`);
    }

    llmsTxtLines.push('');
  }

  const llmsTxt = llmsTxtLines.join('\n');
  writeFileSync(join(OUTPUT_DIR, 'llms.txt'), llmsTxt, 'utf-8');
  console.log(`✅ Generated llms.txt (${llmsTxt.length} bytes)`);

  // ---- Generate llms-full.txt ----
  const llmsFullLines = [
    '# ngx-oneforall — Full Documentation',
    '',
    '> A collection of 85+ high-quality Angular utilities designed to solve common development challenges.',
    '> Tree-shakable, zero-dependency, SSR-ready, and fully tested with 100% coverage.',
    '',
  ];

  for (const category of categories) {
    llmsFullLines.push(`---`);
    llmsFullLines.push('');
    llmsFullLines.push(`# ${category.displayTitle}`);
    llmsFullLines.push('');

    for (const page of category.pages) {
      llmsFullLines.push(`## ${page.title}`);
      llmsFullLines.push('');
      llmsFullLines.push(`**URL**: ${page.url}`);
      llmsFullLines.push(
        `**Import**: \`ngx-oneforall/${category.dirName}/${page.dirName}\``
      );
      llmsFullLines.push('');

      if (page.fullContent) {
        llmsFullLines.push(page.fullContent);
      }

      llmsFullLines.push('');
    }
  }

  const llmsFullTxt = llmsFullLines.join('\n');
  writeFileSync(join(OUTPUT_DIR, 'llms-full.txt'), llmsFullTxt, 'utf-8');
  console.log(`✅ Generated llms-full.txt (${llmsFullTxt.length} bytes)`);

  // Summary
  const totalPages = categories.reduce((sum, c) => sum + c.pages.length, 0);
  console.log(
    `\n📊 Total: ${totalPages} pages across ${categories.length} categories`
  );
}

main();
