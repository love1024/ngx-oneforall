/**
 * ngx-oneforall MCP Server
 *
 * Provides AI tools with native knowledge of all ngx-oneforall
 * Angular utilities via the Model Context Protocol.
 *
 * Usage:
 *   npx @ngx-oneforall/mcp-server
 *
 * Or add to your MCP config:
 *   {
 *     "mcpServers": {
 *       "ngx-oneforall": {
 *         "command": "npx",
 *         "args": ["-y", "@ngx-oneforall/mcp-server"]
 *       }
 *     }
 *   }
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadUtilities } from './data.js';
import { registerTools } from './tools.js';

// Load documentation index
const index = loadUtilities();

// Create MCP server
const server = new McpServer({
  name: 'ngx-oneforall',
  version: '1.2.1',
});

// --- Register Tools ---
registerTools(server, index);

// --- Register Resources ---

// Static resource: llms.txt
server.registerResource(
  'llms-txt',
  'ngx-oneforall://llms.txt',
  {
    title: 'ngx-oneforall LLMs.txt',
    description:
      'Structured index of all ngx-oneforall utilities with links and descriptions',
    mimeType: 'text/plain',
  },
  async uri => ({
    contents: [
      {
        uri: uri.href,
        text: index.llmsTxt,
      },
    ],
  })
);

// Dynamic resource: per-utility docs
server.registerResource(
  'utility-docs',
  new ResourceTemplate('ngx-oneforall://docs/{category}/{utility}', {
    list: async () => ({
      resources: index.utilities.map(u => ({
        uri: `ngx-oneforall://docs/${u.category}/${u.dirName}`,
        name: `${u.name} (${u.categoryTitle})`,
        description: u.description,
        mimeType: 'text/markdown',
      })),
    }),
  }),
  {
    title: 'Utility Documentation',
    description: 'Full documentation for a specific ngx-oneforall utility',
    mimeType: 'text/markdown',
  },
  async (uri, { category, utility }) => {
    const cat = category as string;
    const util = utility as string;
    const utilities = index.byCategory.get(cat);
    const found = utilities?.find(u => u.dirName === util);

    if (!found) {
      return {
        contents: [
          {
            uri: uri.href,
            text: `Utility not found: ${cat}/${util}`,
          },
        ],
      };
    }

    const header = [
      `# ${found.name}`,
      '',
      `**Category**: ${found.categoryTitle}`,
      `**Import**: \`${found.importPath}\``,
      `**Docs**: ${found.url}`,
      '',
      '---',
      '',
    ].join('\n');

    return {
      contents: [
        {
          uri: uri.href,
          text: header + found.fullContent,
        },
      ],
    };
  }
);

// --- Start Server ---
const transport = new StdioServerTransport();
await server.connect(transport);
