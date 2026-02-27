/**
 * MCP tool registrations for ngx-oneforall.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { type UtilityIndex, type Utility } from './data.js';

/**
 * Simple text search across utility names, descriptions, and content.
 */
function searchIndex(index: UtilityIndex, query: string): Utility[] {
  const q = query.toLowerCase();
  const scored: { utility: Utility; score: number }[] = [];

  for (const utility of index.utilities) {
    let score = 0;

    // Exact name match is highest priority
    if (utility.name.toLowerCase() === q) {
      score += 100;
    } else if (utility.name.toLowerCase().includes(q)) {
      score += 50;
    }

    // dir name match
    if (utility.dirName.includes(q)) {
      score += 40;
    }

    // Category match
    if (
      utility.category.includes(q) ||
      utility.categoryTitle.toLowerCase().includes(q)
    ) {
      score += 20;
    }

    // Description match
    if (utility.description.toLowerCase().includes(q)) {
      score += 30;
    }

    // Full content match
    if (utility.fullContent.toLowerCase().includes(q)) {
      score += 10;
    }

    if (score > 0) {
      scored.push({ utility, score });
    }
  }

  return scored.sort((a, b) => b.score - a.score).map(s => s.utility);
}

/**
 * Find a utility by name (case-insensitive, supports partial matching).
 */
function findUtility(index: UtilityIndex, name: string): Utility | undefined {
  const q = name.toLowerCase().trim();

  // Exact match first
  const exact = index.byName.get(q);
  if (exact) return exact;

  // Try partial match
  for (const utility of index.utilities) {
    if (
      utility.name.toLowerCase() === q ||
      utility.dirName === q ||
      utility.dirName === q.replace(/\s+/g, '-')
    ) {
      return utility;
    }
  }

  // Fuzzy: find closest match
  const results = searchIndex(index, q);
  return results.length > 0 ? results[0] : undefined;
}

/**
 * Format a utility listing for display.
 */
function formatUtilityListing(utility: Utility): string {
  return `- **${utility.name}** (\`${utility.importPath}\`): ${utility.description || 'No description available.'}`;
}

/**
 * Register all MCP tools on the server.
 */
export function registerTools(server: McpServer, index: UtilityIndex): void {
  // --- get_utility_docs ---
  server.registerTool(
    'get_utility_docs',
    {
      title: 'Get Utility Documentation',
      description:
        'Get the full documentation for a specific ngx-oneforall utility by name. Returns complete markdown docs including API reference, usage examples, and code snippets.',
      inputSchema: z.object({
        name: z
          .string()
          .describe(
            'Name of the utility (e.g., "draggable", "cache", "time-ago", "debounced-signal")'
          ),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ name }) => {
      const utility = findUtility(index, name);

      if (!utility) {
        const suggestions = searchIndex(index, name).slice(0, 5);
        const suggestionText =
          suggestions.length > 0
            ? `\n\nDid you mean one of these?\n${suggestions.map(u => `- ${u.name} (${u.category})`).join('\n')}`
            : '';

        return {
          content: [
            {
              type: 'text' as const,
              text: `Utility "${name}" not found.${suggestionText}`,
            },
          ],
        };
      }

      const header = [
        `# ${utility.name}`,
        '',
        `**Category**: ${utility.categoryTitle}`,
        `**Import**: \`import { ... } from '${utility.importPath}';\``,
        `**Docs**: ${utility.url}`,
        '',
        '---',
        '',
      ].join('\n');

      return {
        content: [
          {
            type: 'text' as const,
            text:
              header + (utility.fullContent || 'No documentation available.'),
          },
        ],
      };
    }
  );

  // --- search_utilities ---
  server.registerTool(
    'search_utilities',
    {
      title: 'Search Utilities',
      description:
        'Search ngx-oneforall utilities by keyword. Searches across names, descriptions, and documentation content. Returns matching utilities with their import paths and descriptions.',
      inputSchema: z.object({
        query: z
          .string()
          .describe(
            'Search term (e.g., "keyboard", "cache", "form validation", "signal")'
          ),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ query }) => {
      const results = searchIndex(index, query);

      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No utilities found matching "${query}".`,
            },
          ],
        };
      }

      const lines = [
        `# Search Results for "${query}"`,
        '',
        `Found ${results.length} matching utilities:`,
        '',
        ...results.map(u => formatUtilityListing(u)),
      ];

      return {
        content: [{ type: 'text' as const, text: lines.join('\n') }],
      };
    }
  );

  // --- list_utilities ---
  server.registerTool(
    'list_utilities',
    {
      title: 'List Utilities',
      description:
        'List all ngx-oneforall utilities, optionally filtered by category. Returns utility names, import paths, and descriptions grouped by category.',
      inputSchema: z.object({
        category: z
          .string()
          .optional()
          .describe(
            'Optional category filter (e.g., "directives", "pipes", "signals", "validators")'
          ),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ category }) => {
      const lines: string[] = [];

      if (category) {
        const cat = category.toLowerCase();
        const utilities = index.byCategory.get(cat);

        if (!utilities) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Category "${category}" not found. Available categories: ${index.categories.join(', ')}`,
              },
            ],
          };
        }

        const catTitle = utilities[0]?.categoryTitle || category;
        lines.push(`# ${catTitle}`);
        lines.push('');
        lines.push(`${utilities.length} utilities:`);
        lines.push('');
        for (const u of utilities) {
          lines.push(formatUtilityListing(u));
        }
      } else {
        lines.push('# All ngx-oneforall Utilities');
        lines.push('');
        lines.push(
          `${index.utilities.length} utilities across ${index.categories.length} categories:`
        );
        lines.push('');

        for (const [cat, utilities] of index.byCategory) {
          const catTitle = utilities[0]?.categoryTitle || cat;
          lines.push(`## ${catTitle} (${utilities.length})`);
          lines.push('');
          for (const u of utilities) {
            lines.push(formatUtilityListing(u));
          }
          lines.push('');
        }
      }

      return {
        content: [{ type: 'text' as const, text: lines.join('\n') }],
      };
    }
  );

  // --- get_import_path ---
  server.registerTool(
    'get_import_path',
    {
      title: 'Get Import Path',
      description:
        'Get the exact TypeScript import statement for a specific ngx-oneforall utility. Returns the correct import path for use in Angular projects.',
      inputSchema: z.object({
        name: z
          .string()
          .describe(
            'Name of the utility (e.g., "draggable", "time-ago", "cache")'
          ),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ name }) => {
      const utility = findUtility(index, name);

      if (!utility) {
        const suggestions = searchIndex(index, name).slice(0, 3);
        const suggestionText =
          suggestions.length > 0
            ? `\n\nDid you mean: ${suggestions.map(u => u.name).join(', ')}?`
            : '';

        return {
          content: [
            {
              type: 'text' as const,
              text: `Utility "${name}" not found.${suggestionText}`,
            },
          ],
        };
      }

      const text = [
        `**${utility.name}**`,
        '',
        '```typescript',
        `import { ... } from '${utility.importPath}';`,
        '```',
        '',
        `**Category**: ${utility.categoryTitle}`,
        `**Docs**: ${utility.url}`,
      ].join('\n');

      return {
        content: [{ type: 'text' as const, text }],
      };
    }
  );
}
