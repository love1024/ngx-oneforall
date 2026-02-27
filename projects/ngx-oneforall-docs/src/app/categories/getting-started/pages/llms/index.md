LLM-optimized documentation endpoints for ngx-oneforall utilities.

The [llms.txt](https://llmstxt.org/) standard helps AI models better understand and navigate documentation. ngx-oneforall provides two files that follow this standard.

---

## /llms.txt

The `llms.txt` file is a structured index of all ngx-oneforall utilities. It lists every page with a title, link, and short description — making it easy for LLMs to find relevant documentation.

[Open llms.txt](https://love1024.github.io/ngx-oneforall/llms.txt)

---

## /llms-full.txt

The `llms-full.txt` file contains the **complete documentation** for all utilities in a single file. Use this when you want an LLM to have full context about the entire library.

[Open llms-full.txt](https://love1024.github.io/ngx-oneforall/llms-full.txt)

---

## Regenerating

If you update documentation pages and need to regenerate the LLMs files, run:

```bash
npm run generate:llms
```

This reads all `ng-doc.page.ts` and `index.md` files and produces both `llms.txt` and `llms-full.txt` in the `public/` directory.
