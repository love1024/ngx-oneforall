/**
 * Data layer for the MCP server.
 *
 * Reads the bundled docs.json (generated at build time by scripts/bundle-docs.mjs)
 * to provide an indexed, searchable collection of all ngx-oneforall utilities.
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface Utility {
  name: string;
  category: string;
  categoryTitle: string;
  dirName: string;
  routePath: string;
  importPath: string;
  url: string;
  description: string;
  fullContent: string;
}

export interface UtilityIndex {
  utilities: Utility[];
  byCategory: Map<string, Utility[]>;
  byName: Map<string, Utility>;
  categories: string[];
  llmsTxt: string;
}

const CATEGORY_ORDER: [string, string][] = [
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
 * Load and index all utility documentation from the bundled docs.json.
 */
export function loadUtilities(): UtilityIndex {
  // Read from bundled data (relative to dist/ → ../data/docs.json)
  const docsPath = join(__dirname, '..', 'data', 'docs.json');
  const raw = readFileSync(docsPath, 'utf-8');
  const { utilities } = JSON.parse(raw) as { utilities: Utility[] };

  const byCategory = new Map<string, Utility[]>();
  const byName = new Map<string, Utility>();
  const categories: string[] = [];

  for (const utility of utilities) {
    // Group by category
    if (!byCategory.has(utility.category)) {
      byCategory.set(utility.category, []);
      categories.push(utility.category);
    }
    byCategory.get(utility.category)!.push(utility);

    // Index by name variants for lookup
    byName.set(utility.name.toLowerCase(), utility);
    byName.set(utility.dirName, utility);
  }

  // Build llms.txt content
  const llmsLines = [
    '# ngx-oneforall',
    '',
    '> A collection of 85+ high-quality Angular utilities.',
    '> Tree-shakable, zero-dependency, SSR-ready, 100% test coverage.',
    '',
  ];

  for (const [cat, pages] of byCategory) {
    const catTitle = CATEGORY_ORDER.find(([d]) => d === cat)?.[1] || cat;
    llmsLines.push(`## ${catTitle}`);
    llmsLines.push('');
    for (const p of pages) {
      const desc = p.description ? `: ${p.description}` : '';
      llmsLines.push(`- [${p.name}](${p.url})${desc}`);
    }
    llmsLines.push('');
  }

  return {
    utilities,
    byCategory,
    byName,
    categories,
    llmsTxt: llmsLines.join('\n'),
  };
}
