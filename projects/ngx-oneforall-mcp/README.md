# ngx-oneforall-mcp

Connect AI tools to **ngx-oneforall** documentation using the Model Context Protocol (MCP).

The MCP server gives AI assistants like Claude, Cursor, Windsurf, VS Code Copilot, and Antigravity **native knowledge** of all ngx-oneforall utilities — including correct import paths, API references, and usage examples.

---

## What is MCP?

MCP (Model Context Protocol) is a standard that lets AI tools connect to external knowledge sources. Instead of the AI guessing about your library, it can **look up real documentation** in real-time.

Without MCP, an AI might hallucinate:
```typescript
// ❌ Wrong import path
import { Draggable } from 'ngx-oneforall';
```

With MCP, the AI looks up the correct import:
```typescript
// ✅ Correct import path
import { DraggableDirective } from 'ngx-oneforall/directives/draggable';
```

---

## Installation

Install the MCP server globally or use it via `npx`:

```bash
npx ngx-oneforall-mcp
```

No additional dependencies are required in your Angular project.

---

## Setup by AI Tool

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "ngx-oneforall": {
      "command": "npx",
      "args": ["-y", "ngx-oneforall-mcp"]
    }
  }
}
```

Restart Claude Desktop after saving.

### Cursor

Edit `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "ngx-oneforall": {
      "command": "npx",
      "args": ["-y", "ngx-oneforall-mcp"]
    }
  }
}
```

### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "ngx-oneforall": {
      "command": "npx",
      "args": ["-y", "ngx-oneforall-mcp"]
    }
  }
}
```

### VS Code (GitHub Copilot)

Edit `.vscode/mcp.json` in your project root:

```json
{
  "servers": {
    "ngx-oneforall": {
      "command": "npx",
      "args": ["-y", "ngx-oneforall-mcp"]
    }
  }
}
```

### Antigravity

Configure your Antigravity agent settings:

```json
{
  "mcpServers": {
    "ngx-oneforall": {
      "command": "npx",
      "args": ["-y", "ngx-oneforall-mcp"]
    }
  }
}
```

---

## Available Tools

Once configured, your AI assistant can use these tools automatically:

| Tool | What it does |
|------|-------------|
| `get_utility_docs` | Returns full documentation for any utility by name |
| `search_utilities` | Searches utilities by keyword across names, descriptions, and docs |
| `list_utilities` | Lists all utilities, optionally filtered by category |
| `get_import_path` | Returns the exact TypeScript import statement for a utility |

---

## Example Usage

After setup, just ask your AI assistant naturally:

- *"How do I use the draggable directive from ngx-oneforall?"*
- *"What validators does ngx-oneforall provide?"*
- *"Show me the import path for the time-ago pipe"*
- *"What signals are available for reactive routing?"*

The AI will automatically call the MCP server to look up accurate documentation and provide correct answers.

---

## Resources

The MCP server also exposes resources that AI tools can read directly:

| Resource | URI |
|----------|-----|
| Structured index | `ngx-oneforall://llms.txt` |
| Per-utility docs | `ngx-oneforall://docs/{category}/{utility}` |
