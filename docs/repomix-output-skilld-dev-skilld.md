# Directory Structure
```
.claude/
  skills/
    bombshell-dev-clack/
      SKILL.md
    microsoft-typescript/
      SKILL.md
    sindresorhus-log-update/
      SKILL.md
    sqlite-vec-skilld/
      SKILL.md
    unjs-citty/
      SKILL.md
    skilld-lock.yaml
.github/
  workflows/
    release.yml
    test.yml
src/
  agent/
    clis/
      claude.ts
      codex.ts
      gemini.ts
      index.ts
      pi-ai.ts
      types.ts
    prompts/
      optional/
        api-changes.ts
        best-practices.ts
        budget.ts
        custom.ts
        index.ts
        types.ts
        validate.ts
      index.ts
      prompt.ts
      skill.ts
    targets/
      amp.ts
      antigravity.ts
      base.ts
      claude-code.ts
      cline.ts
      codex.ts
      cursor.ts
      gemini-cli.ts
      github-copilot.ts
      goose.ts
      index.ts
      opencode.ts
      registry.ts
      roo.ts
      types.ts
      windsurf.ts
    detect-imports.ts
    detect-presets.ts
    detect.ts
    index.ts
    install.ts
    registry.ts
    types.ts
  cache/
    cache.test.ts
    config.ts
    index.ts
    storage.ts
    types.ts
    version.ts
  commands/
    assemble.ts
    author.ts
    cache.ts
    config.ts
    index.ts
    install.ts
    list.ts
    prepare.ts
    remove.ts
    search-interactive.ts
    search.ts
    setup.ts
    status.ts
    sync-git.ts
    sync-parallel.ts
    sync-shared.ts
    sync.ts
    uninstall.ts
    validate.ts
    wizard.ts
  core/
    config.ts
    formatting.ts
    index.ts
    lockfile.ts
    markdown.ts
    package-json.ts
    prepare.ts
    sanitize.ts
    shared.ts
    skills.ts
    yaml.ts
  retriv/
    embedding-cache.ts
    index.ts
    pool.ts
    types.ts
    worker.ts
  sources/
    blog-presets.ts
    blog-releases.ts
    crawl.ts
    discussions.ts
    docs.ts
    entries.ts
    git-skills.ts
    github-common.ts
    github.ts
    index.ts
    issues.ts
    llms.test.ts
    llms.ts
    npm.ts
    package-registry.ts
    releases.ts
    types.ts
    utils.test.ts
    utils.ts
  cli-entry.ts
  cli-helpers.ts
  cli.ts
  index.ts
  prepare.ts
  telemetry.ts
  types.ts
  version.ts
test/
  e2e/
    crosscheck-resolve.ts
    crosscheck.ts
    matrix.ts
    pipeline.ts
    preset-astro.test.ts
    preset-cross-framework.test.ts
    preset-general.test.ts
    preset-next.test.ts
    preset-nuxt.test.ts
    preset-react.test.ts
    preset-svelte.test.ts
    preset-vite.test.ts
    preset-vue.test.ts
    prompt-assemble.test.ts
    run-preset.ts
    sync.test.ts
    top-packages.ts
  e2e-agents/
    generate-matrix.ts
    generate-pipeline.ts
    generate.test.ts
  fixtures/
    detect-imports/
      src/
        app.ts
        builtins.ts
        component.vue
        scoped.ts
        utils.mjs
    mock-skills-repo/
      skills/
        another-skill/
          SKILL.md
        test-skill/
          SKILL.md
    no-nuxt/
      package.json
    nuxt/
      nuxt.config.ts
  unit/
    agent-detect.test.ts
    agent-install.test.ts
    agent-registry.test.ts
    agent-skill.test.ts
    author.test.ts
    cache-clean.test.ts
    cache-storage.test.ts
    cache.test.ts
    clean-section-output.test.ts
    cli-flags.test.ts
    detect-imports.test.ts
    detect-presets.test.ts
    discussions.test.ts
    docs-index.test.ts
    embedding-cache.test.ts
    git-skills.test.ts
    github-common-api.test.ts
    issues.test.ts
    list.test.ts
    llms.test.ts
    lockfile.test.ts
    markdown.test.ts
    package-json.test.ts
    portabilize-prompt.test.ts
    prepare-hook.test.ts
    prepare-restore.test.ts
    releases.test.ts
    sanitize.test.ts
    search.test.ts
    shared.test.ts
    skills.test.ts
    sources-github.test.ts
    sources-npm.test.ts
    sources-utils-auth.test.ts
    sources-utils.test.ts
    sync-shared.test.ts
    validate-section.test.ts
    version-resolution.test.ts
    yaml.test.ts
.editorconfig
.gitignore
.npmrc
build.config.ts
CLAUDE.md
eslint.config.mjs
LICENSE
package.json
pnpm-workspace.yaml
README.md
tsconfig.json
vitest.config.ts
```

# Files

## File: .claude/skills/bombshell-dev-clack/SKILL.md
````markdown
---
name: bombshell-dev-clack
description: "ALWAYS use when writing code importing \"@clack/prompts\". Consult for debugging, best practices, or modifying @clack/prompts, clack/prompts, clack prompts, clack."
metadata:
  version: 1.0.1
---

# bombshell-dev/clack `@clack/prompts`

**Version:** 1.0.1 (yesterday)
**Deps:** picocolors@^1.0.0, sisteransi@^1.0.5, @clack/core@1.0.1
**Tags:** alpha: 1.0.0-alpha.10 (2 weeks ago), latest: 1.0.1 (yesterday)

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [GitHub Issues](./.skilld/issues/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `npx -y skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases.

```bash
npx -y skilld search "query" -p @clack/prompts
npx -y skilld search "issues:error handling" -p @clack/prompts
npx -y skilld search "releases:deprecated" -p @clack/prompts
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

## API Changes

⚠️ **ESM-only** — v1.0 dropped CJS dual-publish, `require('@clack/prompts')` no longer works [source](./.skilld/releases/@clack/prompts@1.0.0.md)

⚠️ `spinner.stop(msg, 1)` / `spinner.stop(msg, 2)` — v1.0 replaced numeric codes with `spinner.cancel(msg)` and `spinner.error(msg)` [source](./.skilld/releases/@clack/prompts@1.0.0.md)

⚠️ `suggestion` prompt — added then removed in v1.0, use `path` prompt (autocomplete-based) instead [source](./.skilld/releases/@clack/prompts@1.0.0.md)

⚠️ `placeholder` in `text()` — v1.0 changed to visual-only hint, no longer used as tabbable/return value [source](./.skilld/releases/@clack/prompts@1.0.0.md)

✨ `autocomplete()` / `autocompleteMultiselect()` — new in v1.0, searchable select with `filter` option for custom/fuzzy matching [source](./.skilld/releases/@clack/prompts@1.0.0.md)

✨ `progress()` — new in v1.0, displays a progress bar with `start()`, `stop()`, `cancel()`, `error()` methods [source](./.skilld/releases/@clack/prompts@1.0.0.md)

✨ `taskLog()` — new in v1.0, scrolling log output cleared on success; supports `group()` for nested log sections [source](./.skilld/releases/@clack/prompts@1.0.0.md)

✨ `box()` — new in v1.0, renders boxed text similar to `note` [source](./.skilld/releases/@clack/prompts@1.0.0.md)

✨ `path()` — new in v1.0, autocomplete-based file path prompt [source](./.skilld/releases/@clack/prompts@1.0.0.md)

✨ `stream.step()` — new in v0.10, renders async iterable message streams (useful for LLM output) [source](./.skilld/releases/@clack/prompts@0.10.0.md)

✨ `spinner({ indicator: 'timer' })` — new in v0.10, shows elapsed time instead of dots animation [source](./.skilld/releases/@clack/prompts@0.10.0.md)

✨ `updateSettings({ aliases, messages })` — new in v0.9, configures global keybindings and i18n cancel/error messages [source](./.skilld/releases/@clack/prompts@0.9.0.md)

✨ `signal` option — new in v0.9, all prompts accept `AbortSignal` for programmatic cancellation [source](./.skilld/releases/@clack/prompts@0.9.0.md)

✨ `withGuide` option — new in v1.0, disables the default clack border on any prompt [source](./.skilld/releases/@clack/prompts@1.0.0.md)

✨ `spinner.clear()` — new in v1.0, stops and clears spinner output entirely [source](./.skilld/releases/@clack/prompts@1.0.0.md)

✨ `confirm({ vertical: true })` — new in v1.0.1, arranges yes/no options vertically [source](./.skilld/releases/@clack/prompts@1.0.1.md)

## Best Practices

✅ Use `spinner.cancel()` and `spinner.error()` instead of stop codes — v1.0 replaced `stop(msg, code)` with distinct methods [source](./.skilld/releases/@clack/prompts@1.0.0.md)

```ts
const s = spinner()
s.start('Deploying')
// s.stop('Done')       // success
// s.cancel('Aborted')  // user cancelled (CTRL+C)
// s.error('Failed')    // error occurred
// s.clear()            // stop and clear all output

```
✅ Pass `signal` to prompts for programmatic cancellation — all prompts accept `AbortSignal` since v0.9.0 [source](./.skilld/releases/@clack/prompts@0.9.0.md)

```ts
const answer = await confirm({
  message: 'Continue?',
  signal: AbortSignal.timeout(5000),
})
```

✅ Use `group()` with `onCancel` instead of checking `isCancel` after every prompt — centralizes cancellation handling for multi-step flows [source](./.skilld/pkg/README.md)

```ts
const result = await p.group({
  name: () => p.text({ message: 'Name?' }),
  lang: () => p.select({ message: 'Language?', options }),
}, {
  onCancel: () => { p.cancel('Cancelled.'); process.exit(0) },
})
```

✅ Use `updateSettings` for global i18n messages and key aliases — per-instance options override globals [source](./.skilld/releases/@clack/prompts@1.0.0.md)

```ts
import { updateSettings } from '@clack/prompts'
updateSettings({
  aliases: { w: 'up', s: 'down' },
  messages: { cancel: 'Cancelado', error: 'Error' },
})
```

✅ Use `stream` instead of `log` for LLM/async output — accepts sync and async iterables, renders incrementally [source](./.skilld/releases/@clack/prompts@0.10.0.md)

```ts
await stream.step((async function* () {
  yield* generateLLMResponse(question)
})())
```

✅ Use `taskLog` for subprocess output — renders lines continuously, clears on success, preserves on error [source](./.skilld/pkg/README.md)

```ts
const tl = taskLog({ title: 'Building' })
for await (const line of buildProcess()) tl.message(line)
success ? tl.success('Done') : tl.error('Failed')
```

✅ Distinguish `placeholder` from `defaultValue` in `text()` — placeholder is visual-only hint, never returned as value (changed in v1.0); use `defaultValue` for the fallback return value [source](./.skilld/issues/issue-321.md)

```ts
const name = await text({
  message: 'Project name?',
  placeholder: 'my-app',    // visual hint only, NOT returned
  defaultValue: 'my-app',   // returned when user presses Enter without typing
})
```

✅ v1.0 is ESM-only — CJS `require()` no longer works; use dynamic `import()` or switch to ESM [source](./.skilld/releases/@clack/prompts@1.0.0.md)

✅ Guard against empty `options` arrays in `select`/`multiselect` — passing `[]` throws `TypeError: Cannot read properties of undefined` [source](./.skilld/issues/issue-144.md)

✅ Vim keybindings (`h/j/k/l`) and `Escape` → cancel are enabled by default since v0.9.0 — `updateSettings` cannot disable defaults, only add aliases [source](./.skilld/releases/@clack/prompts@0.9.0.md)
````

## File: .claude/skills/microsoft-typescript/SKILL.md
````markdown
---
name: microsoft-typescript
description: "TypeScript is a language for application scale JavaScript development. ALWAYS use when editing or working with *.ts, *.tsx, *.mts, *.cts files or code importing \"typescript\". Consult for debugging, best practices, or modifying typescript, TypeScript."
metadata:
  version: 6.0.2
  generated_by: cached
  generated_at: 2026-03-24
---

# microsoft/TypeScript `typescript`

> TypeScript is a language for application scale JavaScript development

**Version:** 6.0.2
**Tags:** dev: 3.9.4, tag-for-publishing-older-releases: 4.1.6, insiders: 4.6.2-insiders.20220225, latest: 6.0.2, beta: 6.0.0-beta, rc: 6.0.1-rc, next: 6.0.0-dev.20260323

**References:** [package.json](./.skilld/pkg/package.json) — exports, entry points • [README](./.skilld/pkg/README.md) — setup, basic usage • [Docs](./.skilld/docs/_INDEX.md) — API reference, guides • [GitHub Issues](./.skilld/issues/_INDEX.md) — bugs, workarounds, edge cases • [Releases](./.skilld/releases/_INDEX.md) — changelog, breaking changes, new APIs

## Search

Use `skilld search "query" -p typescript` instead of grepping `.skilld/` directories. Run `skilld search --guide -p typescript` for full syntax, filters, and operators.

<!-- skilld:api-changes -->
## API Changes

This section documents version-specific API changes for TypeScript v5.7+, prioritizing recent major/minor releases.

- BREAKING: `ArrayBuffer` no longer supertype of `TypedArray` types — v5.9 changed `ArrayBuffer` relationships; methods expecting `ArrayBuffer` now reject `Uint8Array`, `Buffer`, etc. Fix by accessing `.buffer` property or using specific `Uint8Array<ArrayBuffer>` types [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-9.html.md#libdts-changes)

- NEW: `import defer * as ns from "module"` — v5.9 syntax for deferred module evaluation; module loading deferred until namespace accessed, useful for conditional/lazy imports. Only supports namespace imports, not named/default exports [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-9.html.md#support-for-import-defer)

- BREAKING: `TypedArray` generics over `ArrayBufferLike` — v5.7+ made all `TypedArray` types generic (`Uint8Array<TArrayBuffer>`), breaking code passing `Buffer`/`Uint8Array` where `ArrayBuffer` expected. Update `@types/node` and specify explicit buffer type or use `.buffer` property [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-7.html.md#typedarrays-are-now-generic-over-arraybufferlike)

- NEW: `--module node20` — v5.9 stable option modeling Node.js v20 behavior; unlike `nodenext`, implies `--target es2023` and is not floating. Use when locked to Node.js v20 [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-9.html.md#support-for---module-node20)

- NEW: `--erasableSyntaxOnly` option — v5.8 flag for Node.js 23.6+ `--experimental-strip-types` mode; errors on non-erasable TypeScript constructs (`enum`, `namespace` with code, parameter properties, `import =`, `export =`) [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-8.html.md#the---erasablesyntaxonly-option)

- NEW: `--module node18` — v5.8 stable option for Node.js 18; disallows `require()` of ESM but allows import assertions (unlike `nodenext`) [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-8.html.md#--module-node18)

- NEW: `require()` of ECMAScript modules — v5.8 `--module nodenext` now permits `require("esm")` from CommonJS (Node.js 22+), except for ESM with top-level `await` [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-8.html.md#support-for-require-of-ecmascript-modules-in---module-nodenext)

- BREAKING: Import assertions deprecated in `--module nodenext` — v5.8 rejects `assert { type: "json" }` syntax in favor of `with { type: "json" }` [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-8.html.md#restrictions-on-import-assertions-under---module-nodenext)

- NEW: `--rewriteRelativeImportExtensions` option — v5.7 compiler option rewrites relative `.ts` imports to `.js` when emitting, enabling in-place execution then compilation [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-7.html.md#path-rewriting-for-relative-paths)

- NEW: `--target es2024` and `--lib es2024` — v5.7 support for ES2024 features (`Object.groupBy`, `Map.groupBy`, `Promise.withResolvers`, `SharedArrayBuffer` types) [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-7.html.md#support-for---target-es2024-and---lib-es2024)

- NEW: Granular return expression checking — v5.8 type-checks each branch of conditional `return` statements against declared return type, catching type mismatches with `any` corruption [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-8.html.md#granular-checks-for-branches-in-return-expressions)

- BREAKING: JSON import validation in `--module nodenext` — v5.7 requires `with { type: "json" }` attribute for JSON imports; no named exports, only default [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-7.html.md#validated-json-imports-in---module-nodenext)

- NEW: `--libReplacement` flag — v5.8 option to disable/enable `@typescript/lib-*` package lookup; default behavior may change in future versions [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-8.html.md#the---libreplacement-flag)

- BREAKING: Index signatures from non-literal class methods — v5.7 now generates index signatures for non-literal computed method names (e.g., `[symbolName]() {}`), changing class type shape [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-7.html.md#creating-index-signatures-from-non-literal-method-names-in-classes)

- NEW: Preserved computed property names in declarations — v5.8 preserves entity names (bare variables, dotted names) in computed property declarations in classes [source](./.skilld/docs/docs/handbook/release-notes/typescript-5-8.html.md#preserved-computed-property-names-in-declaration-files)

**Also changed:** Checks for never-initialized variables (v5.7) · Minimal `tsc --init` output (v5.9) · Type argument inference changes may introduce new errors (v5.9) · V8 compile caching in Node.js (v5.7) · More implicit `any` errors on functions returning `null`/`undefined` (v5.7) · Expandable hovers preview (v5.9) · Configurable hover length `js/ts.hover.maximumLength` (v5.9) · Search ancestor `tsconfig.json` files (v5.7) · Faster project ownership checks for composite projects (v5.7)
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Use lowercase primitive type names (`string`, `number`, `boolean`, `symbol`) rather than capitalized versions (`String`, `Number`, `Boolean`, `Symbol`), which refer to boxed objects rarely used in JavaScript code [source](./.skilld/docs/handbook/declaration-files/do-s-and-don-ts.html.md:L154:L172)

- Avoid `any` unless actively migrating JavaScript to TypeScript; prefer `unknown` when the input type is truly unknown, as it forces explicit type checking before use [source](./.skilld/docs/handbook/declaration-files/do-s-and-don-ts.html.md:L178:L182)

- Use `void` for callback return types when the return value will be ignored; this prevents accidental access to the return value and catches real bugs [source](./.skilld/docs/handbook/declaration-files/do-s-and-don-ts.html.md:L196:L210)

```ts
// Good - prevents accidental use of return value
function fn(x: () => void) {
  x(); // return value is ignored
}
```

- Write callback parameters as required rather than optional unless you specifically need to allow invocation with fewer arguments; optional parameters create misleading contracts about how the callback can be called [source](./.skilld/docs/handbook/declaration-files/do-s-and-don-ts.html.md:L212:L230)

- Order function overloads from specific signatures to general ones; TypeScript selects the first matching overload, so more specific cases must come before general ones [source](./.skilld/docs/handbook/declaration-files/do-s-and-don-ts.html.md:L254:L272)

- Use optional parameters instead of multiple overloads that differ only in trailing parameters; this enables better error detection in higher-order functions and respects strict null checks [source](./.skilld/docs/handbook/declaration-files/do-s-and-don-ts.html.md:L274:L310)

- Use union types instead of overloads when signatures differ only in the type of a single argument; union signatures enable "pass-through" patterns where values can be forwarded without losing type information [source](./.skilld/docs/handbook/declaration-files/do-s-and-don-ts.html.md:L312:L338)

- Avoid writing generic types that don't use their type parameter, as unused generics provide no type safety benefit and confuse readers about intent [source](./.skilld/docs/handbook/declaration-files/do-s-and-don-ts.html.md:L174:L177)

- Enable strict compiler options in `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `verbatimModuleSyntax` catch real bugs at compile time rather than runtime [source](./.skilld/docs/handbook/release-notes/typescript-5-9.html.md:L160:L166)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force"
  }
}
```

- Rely on contextual typing to infer callback parameter types rather than explicitly annotating each one; TypeScript infers parameter types from the context in which the callback is used, reducing boilerplate [source](./.skilld/docs/handbook/type-inference.html.md:L194:L242)

- Use utility types like `Pick`, `Omit`, `Partial`, `Required`, and `Record` to transform existing types instead of manually rewriting object shapes; these compose reliably and reduce duplication [source](./.skilld/docs/handbook/utility-types.html.md:L152:L232)

- Provide explicit type annotations for array/collection literals when TypeScript's "best common type" algorithm fails; this is necessary when array elements have no single common base type across all candidates [source](./.skilld/docs/handbook/type-inference.html.md:L164:L192)

```ts
// TypeScript infers (Rhino | Elephant | Snake)[] without annotation
// Explicit annotation needed to get Animal[]
const zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()]
```
<!-- /skilld:best-practices -->
````

## File: .claude/skills/sindresorhus-log-update/SKILL.md
````markdown
---
name: sindresorhus-log-update
description: "Log by overwriting the previous output in the terminal. Useful for rendering progress bars, animations, etc. ALWAYS use when writing code importing \"log-update\". Consult for debugging, best practices, or modifying log-update, log update."
metadata:
  version: 7.2.0
  generated_by: cached
  generated_at: 2026-03-24
---

# sindresorhus/log-update `log-update`

> Log by overwriting the previous output in the terminal. Useful for rendering progress bars, animations, etc.

**Version:** 7.2.0
**Deps:** ansi-escapes@^7.3.0, cli-cursor@^5.0.0, slice-ansi@^8.0.0, strip-ansi@^7.2.0, wrap-ansi@^10.0.0
**Tags:** latest: 7.2.0

**References:** [package.json](./.skilld/pkg/package.json) — exports, entry points • [GitHub Issues](./.skilld/issues/_INDEX.md) — bugs, workarounds, edge cases • [Releases](./.skilld/releases/_INDEX.md) — changelog, breaking changes, new APIs

## Search

Use `skilld search "query" -p log-update` instead of grepping `.skilld/` directories. Run `skilld search --guide -p log-update` for full syntax, filters, and operators.

<!-- skilld:api-changes -->
## API Changes

This section documents version-specific API changes — prioritize recent major/minor releases.

- BREAKING: Node.js requirement updated from 18 to 20 in v7.0.0 — code targeting earlier Node.js versions will fail at runtime [source](./.skilld/releases/v7.0.0.md#breaking)

- NEW: `persist(...text)` method added in v7.0.0 — writes output that persists in terminal scrollback, unlike the main `logUpdate()` which updates in place [source](./.skilld/releases/v7.0.0.md#improvements)

- NEW: `defaultWidth` option added in v7.0.0 — allows specifying terminal width (default: 80) when the stream doesn't provide `columns` property, useful for piped or redirected output [source](./.skilld/releases/v7.0.0.md#improvements)

- NEW: `defaultHeight` option added in v7.0.0 — allows specifying terminal height (default: 24) when the stream doesn't provide `rows` property, useful for piped or redirected output [source](./.skilld/releases/v7.0.0.md#improvements)

**Also changed:** Partial update rendering optimization v7.0.0 · Trailing newline handling fixes v7.0.1–v7.0.2
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Use `.persist()` for permanent terminal output that should remain in scrollback history — it writes like `console.log()` instead of updating in-place, ideal for results or status messages that users need to scroll back to review [source](./.skilld/pkg/index.d.ts:L45:66)

- Call `.done()` before starting a new log session to persist the current output and prepare for fresh updates below — prevents scrollback contamination [source](./.skilld/pkg/readme.md#logUpdateDone)

- Enable `showCursor: true` when your CLI accepts user input or displays a prompt — otherwise the hidden cursor creates a poor UX for interactive interfaces [source](./.skilld/pkg/readme.md#showCursor)

- Set `defaultWidth` and `defaultHeight` options when output is piped, redirected, or running in non-TTY environments — without this, the library assumes 80x24 which causes incorrect line wrapping and erasure [source](./.skilld/releases/v7.0.0.md#improvements)

- Create separate `logUpdate` instances via `createLogUpdate(stream)` for each independent update context instead of reusing the default export — prevents one instance's updates from clobbering another's [source](./.skilld/pkg/index.d.ts:L74:87)

- Understand that log-update can only erase and rewrite lines currently visible in the terminal viewport — content already in scrollback cannot be manipulated, so extremely long outputs will overflow and "leak" [source](./.skilld/issues/issue-10.md)

- Account for ANSI escape sequences in output width calculations — the library properly handles colorized text with tools like chalk/yoctocolors and accounts for their escape codes when calculating line wrapping [source](./.skilld/issues/issue-12.md)

- Use `logUpdateStderr` for error messages and warnings instead of `logUpdate` — maintains separation between stdout and stderr streams [source](./.skilld/pkg/index.d.ts:L69:81)

- Leverage partial/synchronized rendering in v7.1.0+ for reduced flicker when updating large outputs — the library now intelligently redraws only changed lines instead of erasing everything [source](./.skilld/releases/v7.1.0.md)

- Be aware that multiple consecutive blank lines at the end of output may collapse to a single blank line during rendering optimization — design output that doesn't rely on exact blank line preservation [source](./.skilld/issues/issue-62.md)
<!-- /skilld:best-practices -->
````

## File: .claude/skills/sqlite-vec-skilld/SKILL.md
````markdown
---
name: sqlite-vec-skilld
description: "ALWAYS use when writing code importing \"sqlite-vec\". Consult for debugging, best practices, or modifying sqlite-vec, sqlite vec."
metadata:
  version: 0.1.7
  generated_by: Claude Code · Haiku 4.5
  generated_at: 2026-03-19
---

# asg017/sqlite-vec `sqlite-vec`

**Version:** 0.1.7
**Tags:** latest: 0.1.7, alpha: 0.1.7-alpha.13

**References:** [package.json](./.skilld/pkg/package.json) — exports, entry points • [README](./.skilld/pkg/README.md) — setup, basic usage • [Docs](./.skilld/docs/_INDEX.md) — API reference, guides • [GitHub Issues](./.skilld/issues/_INDEX.md) — bugs, workarounds, edge cases • [Releases](./.skilld/releases/_INDEX.md) — changelog, breaking changes, new APIs

## Search

Use `skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases. If `skilld` is unavailable, use `npx -y skilld search`.

```bash
skilld search "query" -p sqlite-vec
skilld search "issues:error handling" -p sqlite-vec
skilld search "releases:deprecated" -p sqlite-vec
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

<!-- skilld:api-changes -->
## API Changes

This section documents version-specific API changes — prioritize recent major/minor releases.

- BREAKING: DELETE operations now properly clear vector data and free space — v0.1.7 changed behavior from only setting validity bits. Code using DELETE statements may see different storage behavior [source](./.skilld/releases/v0.1.7.md:L16)

- NEW: Distance column constraints in KNN queries — v0.1.7 adds support for `>`, `>=`, `<`, `<=` constraints on the distance column, enabling pagination-like patterns without requiring large k values [source](./.skilld/releases/v0.1.7.md:L17)

- NEW: Metadata columns in vec0 virtual tables — v0.1.6 added ability to declare metadata columns that can be filtered in WHERE clauses of KNN queries alongside vector matching [source](./.skilld/releases/v0.1.6.md:L13-27)

- NEW: Partition keys for internal index sharding — v0.1.6 added `partition key` syntax to internally shard vector indexes by column values [source](./.skilld/releases/v0.1.6.md:L23-24)

- NEW: Auxiliary columns with `+` prefix — v0.1.6 added support for auxiliary columns (prefix with `+`) that are unindexed but available for fast lookups in KNN query results [source](./.skilld/releases/v0.1.6.md:L31-33)

- BREAKING: `vec_npy_each` table function removed from default entrypoint — v0.1.3 moved this experimental function out due to CVE-2024-46488 security mitigation; affected code using untrusted SQL or the rare `vec_npy_each` function [source](./.skilld/releases/v0.1.3.md:L9)

**Also changed:** Static linking support for SQLite 3.31.1+ · `serialize_float32()` / `serialize_int8()` Python functions added
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- **Use two-column re-scoring pattern for binary quantization** — store both quantized and full-precision vectors; query coarse index with quantized vectors, then re-score top candidates with full precision to recover quality lost from extreme dimensionality reduction [source](./.skilld/docs/binary-quant.md#re-scoring)

- **Combine `vec_slice()` with `vec_normalize()` for Matryoshka embeddings** — truncating dimensions requires subsequent normalization to maintain embedding quality and semantic meaning [source](./.skilld/docs/matryoshka.md#matryoshka-embeddings-with-sqlite-vec)

- **Prefer scalar quantization over binary quantization for moderate storage savings** — trade off storage efficiency against quality loss; `vec_quantize_float16` (2 bytes per value) and `vec_quantize_int8` (1 byte per value) offer better quality retention than binary quantization for many use cases [source](./.skilld/docs/scalar-quant.md#L1:26)

- **Use partition keys to shard large vector datasets** — declare a `partition key` column in `CREATE VIRTUAL TABLE` to internally shard the vector index on that column, improving query performance by reducing search scope [source](./.skilld/releases/v0.1.6.md#L23:24)

- **Combine metadata columns (indexed) with auxiliary columns (unindexed) for efficient filtering** — use regular metadata columns for dimensions you filter on in KNN WHERE clauses; prefix columns with `+` to store related data without indexing overhead [source](./.skilld/releases/v0.1.6.md#L26:33)

- **Use distance constraints instead of oversampling for pagination** — as of v0.1.7, apply `distance > threshold` or `distance < threshold` constraints in WHERE clauses to paginate through KNN results without fetching excess candidates [source](./.skilld/releases/v0.1.7.md#L17)

- **Monitor the k value limit when performing large KNN queries** — the default maximum k is 4096 (configurable) to prevent memory exhaustion; be aware that kNN results are materialized in memory and internally use O(n²) complexity on k [source](./.skilld/issues/issue-157.md#L22:33)

- **Rely on v0.1.7+ for automatic DELETE cleanup** — vector space is now reclaimed when enough vectors are deleted to clear a chunk (~1024 vectors); previous versions only marked entries as deleted without freeing space [source](./.skilld/releases/v0.1.7.md#L16)

- **Select embedding models with quantization support for better results** — models like `nomic-embed-text-v1.5`, `mxbai-embed-large-v1`, and OpenAI's `text-embedding-3` are specifically trained to maintain quality after quantization and Matryoshka truncation [source](./.skilld/docs/binary-quant.md#L114:125)
<!-- /skilld:best-practices -->
````

## File: .claude/skills/unjs-citty/SKILL.md
````markdown
---
name: unjs-citty
description: "ALWAYS use when writing code importing \"citty\". Consult for debugging, best practices, or modifying citty."
metadata:
  version: 0.2.1
---

# unjs/citty `citty`

**Version:** 0.2.1 (yesterday)
**Tags:** latest: 0.2.1 (yesterday)

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [GitHub Issues](./.skilld/issues/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `npx -y skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases.

```bash
npx -y skilld search "query" -p citty
npx -y skilld search "issues:error handling" -p citty
npx -y skilld search "releases:deprecated" -p citty
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

## API Changes

⚠️ **ESM-only** — v0.2.0 ships ESM only, `require('citty')` no longer works [source](./releases/v0.2.0.md)

⚠️ **`node:util.parseArgs` internally** — v0.2.0 replaced custom parser with Node.js native `util.parseArgs`, edge cases around arg parsing may differ from v0.1.x [source](./releases/v0.2.0.md)

⚠️ **Optional args type `T | undefined`** — v0.2.0 improved type inference: args without `required: true` or `default` now correctly type as `T | undefined` instead of `T` [source](./releases/v0.2.0.md)

⚠️ **`--no-` negation conditionally printed** — v0.2.0 only shows `--no-<flag>` in usage when `negativeDescription` is set; previously always shown [source](./releases/v0.2.0.md)

✨ `type: "enum"` — new arg type in v0.2.0, requires `options: string[]` array. Typed as union of options values [source](./releases/v0.2.0.md)

```ts
args: {
  color: {
    type: "enum",
    options: ["red", "blue", "green"] as const,
    description: "Pick a color",
  },
}
// args.color typed as "red" | "blue" | "green" | undefined

```
✨ `meta.hidden` — v0.2.0, hides a subcommand from usage/help output [source](./releases/v0.2.0.md)

✨ `negativeDescription` — v0.2.0, on boolean args, sets description for the `--no-<flag>` variant in usage [source](./releases/v0.2.0.md)

✨ `cleanup` hook — v0.1.4, runs after `run()` completes (mirror of `setup`) [source](./releases/v0.1.4.md)

✨ `createMain(cmd)` — v0.1.4, returns a reusable `(opts?) => Promise<void>` wrapper around `runMain` [source](./releases/v0.1.4.md)

✨ `--version` flag — v0.1.4, auto-handled when `meta.version` is set [source](./releases/v0.1.4.md)

✨ `runMain({ showUsage })` — v0.1.5, accepts custom `showUsage` function to override default help rendering [source](./releases/v0.1.5.md)

⚠️ `--no-` propagation fix — v0.2.1, `--no-<flag>` now correctly negates aliases too (was broken in v0.2.0) [source](./releases/v0.2.1.md)

## Best Practices

✅ Use `setup` and `cleanup` hooks for lifecycle management — undocumented in README but fully supported; `cleanup` runs in `finally` block so it executes even on errors [source](./.skilld/pkg/dist/index.mjs)

```ts
defineCommand({
  args: { db: { type: "string", default: "mydb" } },
  async setup({ args }) { await connectDb(args.db) },
  async cleanup() { await disconnectDb() },
  async run({ args }) { /* db is connected */ },
})

```
✅ Use `enum` type with `options` for constrained values — validates input and shows allowed values in usage/error messages (v0.2.0+) [source](./.skilld/releases/v0.2.0.md)

```ts
args: {
  format: {
    type: "enum",
    options: ["json", "yaml", "toml"],
    default: "json",
    description: "Output format",
  },
}
```

✅ Use `meta.hidden: true` to hide subcommands from usage output — keeps internal/debug commands accessible but invisible (v0.2.0+) [source](./.skilld/releases/v0.2.0.md)

```ts
subCommands: {
  debug: () => defineCommand({ meta: { name: "debug", hidden: true }, run() {} }),
}
```

✅ Make `subCommands` values lazy via arrow functions — citty resolves them with `resolveValue()`, enabling code-splitting and faster startup [source](./.skilld/pkg/dist/index.mjs)

```ts
subCommands: {
  deploy: () => import("./commands/deploy").then(m => m.default),
  build: () => import("./commands/build").then(m => m.default),
}
```

✅ Use `negativeDescription` on boolean args that default to `true` — citty auto-generates `--no-*` flags with separate help text (v0.2.0+) [source](./.skilld/pkg/dist/index.mjs)

```ts
args: {
  color: {
    type: "boolean",
    default: true,
    description: "Colorize output",
    negativeDescription: "Disable colored output",
  },
}
```

✅ Pass custom `showUsage` to `runMain` for branded help screens — citty calls your function instead of the built-in one for `--help` and error display [source](./.skilld/pkg/dist/index.d.mts)

```ts
runMain(cmd, {
  showUsage: async (cmd, parent) => {
    console.log(await renderUsage(cmd, parent))
    console.log("\nDocs: https://example.com/docs")
  },
})
```

✅ Arg names auto-alias between camelCase and kebab-case — defining `outputDir` auto-creates `--output-dir` and vice versa; don't add redundant aliases [source](./.skilld/pkg/dist/index.mjs)

✅ `--version` only works as the sole argument — citty checks `rawArgs.length === 1 && rawArgs[0] === "--version"`, so `--version --verbose` won't trigger it; set `meta.version` on the root command [source](./.skilld/pkg/dist/index.mjs)

✅ Use `runCommand` over `runMain` for programmatic invocation — `runMain` calls `process.exit(1)` on errors and handles `--help`/`--version`; `runCommand` returns `{ result }` and lets errors propagate [source](./.skilld/pkg/dist/index.mjs)

```ts
const { result } = await runCommand(cmd, { rawArgs: ["build", "--prod"] })
```

✅ Avoid positional args on commands with subcommands — if a positional value matches a subcommand name, citty routes to the subcommand instead of using it as the arg value [source](./.skilld/issues/issue-41.md)
````

## File: .claude/skills/skilld-lock.yaml
````yaml
skills:
  sindresorhus-log-update:
    packageName: log-update
    version: 7.2.0
    packages: "log-update@7.2.0"
    repo: sindresorhus/log-update
    source: "ungh://sindresorhus/log-update"
    syncedAt: 2026-03-24
    generator: skilld
  microsoft-typescript:
    packageName: typescript
    version: 6.0.2
    packages: "typescript@6.0.2"
    repo: microsoft/TypeScript
    source: "https://github.com/microsoft/TypeScript/tree/v6.0.2/docs"
    syncedAt: 2026-03-24
    generator: skilld
  vue-skilld:
    packageName: vue
    version: 3.5.30
    packages: "vue@3.5.30"
    repo: vuejs/core
    source: "https://github.com/vuejs/core/tree/v3.5.30/docs"
    syncedAt: 2026-03-21
    generator: skilld
  sqlite-vec-skilld:
    packageName: sqlite-vec
    version: 0.1.7
    packages: "sqlite-vec@0.1.7"
    repo: asg017/sqlite-vec
    source: "https://github.com/asg017/sqlite-vec/tree/v0.1.7/docs"
    syncedAt: 2026-03-19
    generator: skilld
  motion-v-skilld:
    packageName: motion-v
    version: 2.0.1
    packages: "motion-v@2.0.1"
    repo: motiondivision/motion-vue
    source: "https://github.com/motiondivision/motion-vue/tree/v2.0.1/docs"
    syncedAt: 2026-03-21
    generator: skilld
  citty-skilld:
    packageName: citty
    version: 0.2.1
    packages: "citty@0.2.1"
    repo: unjs/citty
    source: "ungh://unjs/citty"
    syncedAt: 2026-03-02
    generator: skilld
  log-update-skilld:
    packageName: log-update
    version: 7.2.0
    packages: "log-update@7.2.0"
    repo: sindresorhus/log-update
    source: "ungh://sindresorhus/log-update"
    syncedAt: 2026-03-21
    generator: skilld
  tinyglobby-skilld:
    packageName: tinyglobby
    version: 0.2.15
    repo: SuperchupuDev/tinyglobby
    source: "ungh://SuperchupuDev/tinyglobby"
    syncedAt: 2026-02-27
    generator: skilld
  nuxt-og-image-skilld:
    packageName: nuxt-og-image
    version: 6.0.7
    packages: "nuxt-og-image@6.0.7"
    repo: nuxt-modules/og-image
    source: "ungh://nuxt-modules/og-image@v6.0.7"
    syncedAt: 2026-03-21
    generator: skilld
  clack-prompts-skilld:
    packageName: "@clack/prompts"
    version: 1.1.0
    packages: "@clack/prompts@1.1.0"
    repo: bombshell-dev/clack
    source: "https://raw.githubusercontent.com/bombshell-dev/clack/main/packages/prompts/README.md"
    syncedAt: 2026-03-21
    generator: skilld
  defu-skilld:
    packageName: defu
    version: 6.1.4
    repo: unjs/defu
    source: "ungh://unjs/defu"
    syncedAt: 2026-03-12
    generator: skilld
  mdream-skilld:
    packageName: mdream
    version: 1.0.3
    packages: "mdream@1.0.3"
    repo: harlan-zw/mdream
    source: "https://github.com/harlan-zw/mdream/tree/v1.0.3/docs"
    syncedAt: 2026-03-23
    generator: skilld
````

## File: .github/workflows/release.yml
````yaml
name: Release
permissions:
  contents: write
  id-token: write
on:
  push:
    tags:
      - 'v*'
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v6
        with:
          node-version: lts/*
          cache: pnpm
          registry-url: https://registry.npmjs.org
      - run: npx changelogithub
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
      - run: pnpm i
      - run: pnpm build
      - run: pnpm publish -r --access public --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
````

## File: .github/workflows/test.yml
````yaml
name: Test
on:
  push:
    paths-ignore:
      - '**/README.md'
      - 'docs/**'
concurrency:
  group: ${{ github.workflow }}-${{ github.event.number || github.sha }}
  cancel-in-progress: true
permissions:
  contents: read
jobs:
  test:
    runs-on: ubuntu-24.04-arm
    steps:
      - uses: actions/checkout@v6
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v6
        with:
          node-version: lts/*
          cache: pnpm
      - run: pnpm i
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm build
      - run: pnpm test:run --project unit
````

## File: src/agent/clis/claude.ts
````typescript
import type { CliModelEntry, ParsedEvent } from './types.ts'
⋮----
export function buildArgs(model: string, skillDir: string, symlinkDirs: string[]): string[]
⋮----
export function parseLine(line: string): ParsedEvent
⋮----
// Capture Write content — primary output path since Write is auto-denied
⋮----
// Final result
````

## File: src/agent/clis/codex.ts
````typescript
import type { CliModelEntry, ParsedEvent } from './types.ts'
⋮----
export function buildArgs(model: string, _skillDir: string, _symlinkDirs: string[]): string[]
⋮----
export function parseLine(line: string): ParsedEvent
````

## File: src/agent/clis/gemini.ts
````typescript
import type { CliModelEntry, ParsedEvent } from './types.ts'
import { resolveSkilldCommand } from '../../core/shared.ts'
⋮----
export function buildArgs(model: string, skillDir: string, symlinkDirs: string[]): string[]
⋮----
export function parseLine(line: string): ParsedEvent
⋮----
// Capture write_file content as fallback (matches Claude's Write tool behavior)
````

## File: src/agent/clis/index.ts
````typescript
import type { SkillSection } from '../prompts/index.ts'
import type { AgentType } from '../types.ts'
import type { CliModelConfig, CliName, OptimizeDocsOptions, OptimizeModel, OptimizeResult, ParsedEvent, SectionResult, StreamProgress, ValidationWarning } from './types.ts'
import { exec, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { setTimeout as delay } from 'node:timers/promises'
import { promisify } from 'node:util'
import { dirname, join } from 'pathe'
import { isWindows } from 'std-env'
import { readCachedSection, writeSections } from '../../cache/index.ts'
import { sanitizeMarkdown } from '../../core/sanitize.ts'
import { detectInstalledAgents } from '../detect.ts'
import { buildAllSectionPrompts, getSectionValidator, SECTION_MERGE_ORDER, SECTION_OUTPUT_FILES, wrapSection } from '../prompts/index.ts'
import { agents } from '../registry.ts'
⋮----
import { getAvailablePiAiModels, isPiAiModel, optimizeSectionPiAi, parsePiAiModelId } from './pi-ai.ts'
⋮----
interface ToolProgressLog {
  message: (msg: string) => void
}
⋮----
export function createToolProgress(log: ToolProgressLog): (progress: StreamProgress) => void
⋮----
/** Per-section timestamp of last "Writing..." emission — throttles text_delta spam */
⋮----
function emit(msg: string)
⋮----
// Count bullet items in accumulated text for meaningful progress
⋮----
// Parse individual tool names and hints from "[Read: path]" or "[Read, Glob: path1, path2]"
⋮----
// ── Per-CLI dispatch ─────────────────────────────────────────────────
⋮----
// ── Provider display names ────────────────────────────────────────────
⋮----
/** Map CLI agent IDs to their LLM provider name (not the agent/tool name) */
⋮----
// ── Assemble CLI_MODELS from per-CLI model definitions ───────────────
⋮----
// ── Model helpers ────────────────────────────────────────────────────
⋮----
export function getModelName(id: OptimizeModel): string
⋮----
export function getModelLabel(id: OptimizeModel): string
⋮----
export async function getAvailableModels(): Promise<import('./types.ts').ModelInfo[]>
⋮----
// Append pi-ai direct API models (providers with auth configured)
⋮----
// ── Reference dirs ───────────────────────────────────────────────────
⋮----
/** Resolve symlinks in .skilld/ to get real paths for --add-dir */
function resolveReferenceDirs(skillDir: string): string[]
⋮----
// Include parent directories so CLIs can search across all references at once
// (e.g. Gemini's sandbox requires the parent dir to be explicitly included)
⋮----
// ── Cache ────────────────────────────────────────────────────────────
⋮----
/** Strip absolute paths from prompt so the hash is project-independent */
function normalizePromptForHash(prompt: string): string
⋮----
function hashPrompt(prompt: string, model: OptimizeModel, section: SkillSection): string
⋮----
function getCached(prompt: string, model: OptimizeModel, section: SkillSection, maxAge = 7 * 24 * 60 * 60 * 1000): string | null
⋮----
function setCache(prompt: string, model: OptimizeModel, section: SkillSection, text: string): void
⋮----
// ── pi-ai direct API path ────────────────────────────────────────────
⋮----
async function optimizeSectionViaPiAi(opts: {
  section: SkillSection
  prompt: string
  outputFile: string
  skillDir: string
  model: OptimizeModel
  onProgress?: (progress: StreamProgress) => void
  timeout: number
  debug?: boolean
}): Promise<SectionResult>
⋮----
// Remove stale output so we don't read a leftover from a previous run
⋮----
// Write prompt for debugging (same as CLI path)
⋮----
// Debug logging — match CLI path: actual prompt sent + raw output
⋮----
// Always write cleaned content to output file (matches CLI path)
⋮----
// Write error to logs on failure (matches CLI stderr logging)
⋮----
// ── Per-section spawn ────────────────────────────────────────────────
⋮----
interface OptimizeSectionOptions {
  section: SkillSection
  prompt: string
  outputFile: string
  skillDir: string
  model: OptimizeModel
  packageName: string
  onProgress?: (progress: StreamProgress) => void
  timeout: number
  debug?: boolean
  preExistingFiles: Set<string>
}
⋮----
/** Spawn a single CLI process for one section, or call pi-ai directly */
function optimizeSection(opts: OptimizeSectionOptions): Promise<SectionResult>
⋮----
// pi-ai direct API path — no CLI spawning
⋮----
// Remove stale output so we don't read a leftover from a previous run
⋮----
// Write prompt for debugging
⋮----
// Drain remaining buffer for metadata
⋮----
// Remove unexpected files the LLM may have written (prompt injection defense)
// Only clean files not in the pre-existing snapshot and not our expected output
⋮----
// Allow other section output files and debug prompts
⋮----
// Prefer file written by LLM, fall back to Write tool content (if denied), then accumulated stdout
⋮----
// Always write stderr on failure; write all logs in debug mode
⋮----
// Clean the section output (strip markdown fences, frontmatter, sanitize)
⋮----
// Write cleaned content back to the output file for debugging
⋮----
// ── Main orchestrator ────────────────────────────────────────────────
⋮----
export async function optimizeDocs(opts: OptimizeDocsOptions): Promise<OptimizeResult>
⋮----
// Build all section prompts
⋮----
// Check per-section cache: references dir first (version-keyed), then LLM cache (prompt-hashed)
⋮----
// Check global references dir (cross-project, version-keyed)
⋮----
// Check LLM prompt-hash cache
⋮----
// Prepare .skilld/ dir and snapshot before spawns
⋮----
// Pre-flight: warn about broken symlinks in .skilld/ (avoids wasting tokens on missing refs)
⋮----
// Spawn uncached sections with staggered starts to avoid rate-limit collisions
⋮----
const run = () => optimizeSection(
// Stagger: first section starts immediately, rest delayed
⋮----
// Collect results, retry failed sections once
⋮----
// Retry failed sections (sequential, with rate-limit aware backoff)
⋮----
// Write successful sections to global references dir for cross-project reuse
⋮----
// Merge results in SECTION_MERGE_ORDER, wrapped with comment markers
⋮----
// Collect errors and warnings from sections
⋮----
// ── Helpers ──────────────────────────────────────────────────────────
⋮----
/** Check if an error string indicates a rate limit (429) */
function isRateLimitError(error: string | undefined): boolean
⋮----
/** Parse delay hint from rate limit error (e.g. "reset after 5s" → 5). Returns undefined if not a rate limit. */
function parseRateLimitDelay(error: string | undefined): number | undefined
⋮----
function getRetryError(result: PromiseSettledResult<SectionResult>): string | undefined
⋮----
function shortenPath(p: string): string
⋮----
function shortenCommand(cmd: string): string
⋮----
// Only shorten paths that look like they're inside a project
⋮----
export function cleanSectionOutput(content: string): string
⋮----
// For bare ``` wrappers (no markdown/md tag), verify inner looks like section output
⋮----
// Normalize h1 headers to h2 — LLMs sometimes use # instead of ##
⋮----
// Strip accidental frontmatter or leading horizontal rules
⋮----
// Strip preamble before first section marker (LLM reasoning, fake tool calls, code dumps)
// Section markers: ## heading, BREAKING/DEPRECATED/NEW labels
⋮----
// Strip duplicate section headings (LLM echoing the format example before real content)
// Handles headings separated by blank lines or boilerplate text
⋮----
// Only strip if the gap between duplicates is small (< 200 chars of boilerplate)
⋮----
// Normalize citation link text to [source] — LLMs sometimes use the path as link text
// e.g. [./references/docs/api.md](./references/docs/api.md) or [`./references/...`](...)
// Also handles paren-wrapped variants: ([`path`](url))
⋮----
// Only normalize if the URL points to a reference path
````

## File: src/agent/clis/pi-ai.ts
````typescript
import type { AssistantMessage, Message, ToolCall } from '@mariozechner/pi-ai'
import type { SkillSection } from '../prompts/index.ts'
import type { StreamProgress } from './types.ts'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { getEnvApiKey, getModel, getModels, getProviders, streamSimple } from '@mariozechner/pi-ai'
import { getOAuthApiKey, getOAuthProvider, getOAuthProviders } from '@mariozechner/pi-ai/oauth'
import { Type } from '@sinclair/typebox'
import { join } from 'pathe'
import { sanitizeMarkdown } from '../../core/sanitize.ts'
⋮----
export function isPiAiModel(model: string): boolean
⋮----
export function parsePiAiModelId(model: string):
⋮----
interface OAuthCredentials {
  type: 'oauth'
  refresh: string
  access: string
  expires: number
  [key: string]: unknown
}
⋮----
function readAuthFile(path: string): Record<string, OAuthCredentials>
⋮----
function loadAuth(): Record<string, OAuthCredentials>
⋮----
function saveAuth(auth: Record<string, OAuthCredentials>): void
⋮----
function resolveOAuthProviderId(modelProvider: string): string | null
⋮----
async function resolveApiKey(provider: string): Promise<string | null>
⋮----
export interface LoginCallbacks {
  onAuth: (url: string, instructions?: string) => void
  onPrompt: (message: string, placeholder?: string) => Promise<string>
  onProgress?: (message: string) => void
}
⋮----
export function getOAuthProviderList(): Array<
⋮----
export async function loginOAuthProvider(providerId: string, callbacks: LoginCallbacks): Promise<boolean>
⋮----
export function logoutOAuthProvider(providerId: string): void
⋮----
function isLegacyModel(modelId: string): boolean
⋮----
export interface PiAiModelInfo {
  id: string
  name: string
  hint: string
  authSource: 'env' | 'oauth' | 'none'
  recommended: boolean
}
⋮----
export function getAvailablePiAiModels(): PiAiModelInfo[]
⋮----
// ── Tool definitions for agentic mode ────────────────────────────────
⋮----
/** Resolve a path safely within skilldDir, blocking traversal */
function resolveSandboxedPath(p: string, skilldDir: string): string
⋮----
/** Match a file path against a glob pattern using simple segment matching (no regex from user input) */
function globMatch(filePath: string, pattern: string): boolean
⋮----
// No **, simple wildcard match: split on * and check containment in order
⋮----
return false // first segment must match from start
⋮----
return pos === filePath.length // last segment must match to end
⋮----
// ** present: match any depth between segments
⋮----
// Replace single * within each segment for matching
⋮----
/** Execute a tool call against the .skilld/ directory */
function executeTool(toolCall: ToolCall, skilldDir: string): string
⋮----
const walkDir = (dir: string, prefix: string) =>
⋮----
// ── Section optimization ─────────────────────────────────────────────
⋮----
export interface PiAiSectionOptions {
  section: SkillSection
  prompt: string
  skillDir: string
  model: string
  onProgress?: (progress: StreamProgress) => void
  signal?: AbortSignal
}
⋮----
export interface PiAiSectionResult {
  text: string
  /** The raw prompt sent to the model */
  fullPrompt: string
  usage?: { input: number, output: number }
  cost?: number
}
⋮----
/** The raw prompt sent to the model */
⋮----
/** Optimize a single section using pi-ai agentic API with tool use */
export async function optimizeSectionPiAi(opts: PiAiSectionOptions): Promise<PiAiSectionResult>
````

## File: src/agent/clis/types.ts
````typescript
import type { FeaturesConfig } from '../../core/config.ts'
import type { CustomPrompt, SkillSection } from '../prompts/index.ts'
import type { AgentType } from '../types.ts'
⋮----
export interface ParsedEvent {
  textDelta?: string
  fullText?: string
  toolName?: string
  toolHint?: string
  writeContent?: string
  done?: boolean
  usage?: { input: number, output: number }
  cost?: number
  turns?: number
}
⋮----
export type OptimizeModel
  = | 'opus'
    | 'sonnet'
    | 'haiku'
    | 'gemini-3.1-pro'
    | 'gemini-3-flash'
    | 'gpt-5.3-codex'
    | 'gpt-5.3-codex-spark'
    | 'gpt-5.2-codex'
    | `pi:${string}`
⋮----
export interface ModelInfo {
  id: OptimizeModel
  name: string
  hint: string
  recommended?: boolean
  agentId: string
  agentName: string
  provider: string
  providerName: string
  vendorGroup: string
}
⋮----
export interface StreamProgress {
  chunk: string
  type: 'reasoning' | 'text'
  text: string
  reasoning: string
  section?: SkillSection
}
⋮----
export interface OptimizeDocsOptions {
  packageName: string
  skillDir: string
  model?: OptimizeModel
  version?: string
  hasGithub?: boolean
  hasReleases?: boolean
  hasChangelog?: string | false
  docFiles?: string[]
  docsType?: 'llms.txt' | 'readme' | 'docs'
  hasShippedDocs?: boolean
  onProgress?: (progress: StreamProgress) => void
  timeout?: number
  verbose?: boolean
  debug?: boolean
  noCache?: boolean
  sections?: SkillSection[]
  customPrompt?: CustomPrompt
  features?: FeaturesConfig
  pkgFiles?: string[]
  overheadLines?: number
}
⋮----
export interface OptimizeResult {
  optimized: string
  wasOptimized: boolean
  error?: string
  warnings?: string[]
  reasoning?: string
  finishReason?: string
  usage?: { inputTokens: number, outputTokens: number, totalTokens: number }
  cost?: number
  debugLogsDir?: string
}
⋮----
export interface SectionResult {
  section: SkillSection
  content: string
  wasOptimized: boolean
  error?: string
  warnings?: ValidationWarning[]
  usage?: { input: number, output: number }
  cost?: number
}
⋮----
export interface ValidationWarning {
  section: string
  warning: string
}
⋮----
export interface CliModelEntry {
  model: string
  name: string
  hint: string
  recommended?: boolean
}
⋮----
export interface CliModelConfig extends CliModelEntry {
  cli: CliName
  agentId: AgentType
}
⋮----
export type CliName = 'claude' | 'gemini' | 'codex'
````

## File: src/agent/prompts/optional/api-changes.ts
````typescript
import type { PromptSection, ReferenceWeight, SectionContext, SectionValidationWarning } from './types.ts'
import { resolveSkilldCommand } from '../../../core/shared.ts'
import { maxItems, maxLines, releaseBoost } from './budget.ts'
import { checkAbsolutePaths, checkLineCount, checkSourceCoverage, checkSourcePaths, checkSparseness } from './validate.ts'
⋮----
export function apiChangesSection(
⋮----
validate(content: string): SectionValidationWarning[]
⋮----
// Every detailed item needs BREAKING/DEPRECATED/NEW label
⋮----
// Exclude "Also changed" compact line from the count
⋮----
// Heading required
````

## File: src/agent/prompts/optional/best-practices.ts
````typescript
import type { PromptSection, ReferenceWeight, SectionContext, SectionValidationWarning } from './types.ts'
import { resolveSkilldCommand } from '../../../core/shared.ts'
import { maxItems, maxLines, releaseBoost } from './budget.ts'
import { checkAbsolutePaths, checkLineCount, checkSourceCoverage, checkSourcePaths, checkSparseness } from './validate.ts'
⋮----
export function bestPracticesSection(
⋮----
validate(content: string): SectionValidationWarning[]
````

## File: src/agent/prompts/optional/budget.ts
````typescript
function remainingLines(overheadLines?: number): number
⋮----
export function maxLines(min: number, max: number, sectionCount?: number, overheadLines?: number): number
⋮----
export function maxItems(min: number, max: number, sectionCount?: number): number
⋮----
export function releaseBoost(significantReleases?: number, minorVersion?: number): number
⋮----
function budgetScale(sectionCount?: number): number
````

## File: src/agent/prompts/optional/custom.ts
````typescript
import type { CustomPrompt, PromptSection, SectionValidationWarning } from './types.ts'
import { maxLines } from './budget.ts'
import { checkAbsolutePaths, checkLineCount, checkSourceCoverage, checkSourcePaths, checkSparseness } from './validate.ts'
⋮----
export function customSection(
⋮----
validate(content: string): SectionValidationWarning[]
````

## File: src/agent/prompts/optional/index.ts
````typescript

````

## File: src/agent/prompts/optional/types.ts
````typescript
import type { FeaturesConfig } from '../../../core/config.ts'
⋮----
export interface ReferenceWeight {
  name: string
  path: string
  score: number
  useFor: string
}
⋮----
export interface SectionValidationWarning {
  warning: string
}
⋮----
export interface PromptSection {
  task?: string
  format?: string
  rules?: string[]
  referenceWeights?: ReferenceWeight[]
  validate?: (content: string) => SectionValidationWarning[]
}
⋮----
export interface SectionContext {
  packageName: string
  version?: string
  hasIssues?: boolean
  hasDiscussions?: boolean
  hasReleases?: boolean
  hasChangelog?: string | false
  hasDocs?: boolean
  pkgFiles?: string[]
  features?: FeaturesConfig
  enabledSectionCount?: number
  releaseCount?: number
  overheadLines?: number
}
⋮----
export interface CustomPrompt {
  heading: string
  body: string
}
````

## File: src/agent/prompts/optional/validate.ts
````typescript
import type { SectionValidationWarning } from './types.ts'
⋮----
export function checkLineCount(content: string, max: number): SectionValidationWarning[]
⋮----
export function checkSparseness(content: string): SectionValidationWarning[]
⋮----
export function checkSourceCoverage(content: string, minRatio = 0.8): SectionValidationWarning[]
⋮----
export function checkSourcePaths(content: string): SectionValidationWarning[]
⋮----
export function checkAbsolutePaths(content: string): SectionValidationWarning[]
````

## File: src/agent/prompts/index.ts
````typescript

````

## File: src/agent/prompts/prompt.ts
````typescript
import type { FeaturesConfig } from '../../core/config.ts'
import type { CustomPrompt, PromptSection, SectionContext, SectionValidationWarning } from './optional/index.ts'
import { dirname } from 'pathe'
import { resolveSkilldCommand } from '../../core/shared.ts'
import { getPackageRules } from '../../sources/package-registry.ts'
import { apiChangesSection, bestPracticesSection, customSection } from './optional/index.ts'
⋮----
export type SkillSection = 'api-changes' | 'best-practices' | 'custom'
⋮----
export function wrapSection(section: SkillSection, content: string): string
⋮----
export function extractMarkedSections(md: string): Map<SkillSection,
⋮----
export interface BuildSkillPromptOptions {
  packageName: string
  skillDir: string
  version?: string
  hasIssues?: boolean
  hasDiscussions?: boolean
  hasReleases?: boolean
  hasChangelog?: string | false
  docFiles?: string[]
  docsType?: 'llms.txt' | 'readme' | 'docs'
  hasShippedDocs?: boolean
  customPrompt?: CustomPrompt
  features?: FeaturesConfig
  enabledSectionCount?: number
  pkgFiles?: string[]
  overheadLines?: number
}
⋮----
function formatDocTree(files: string[]): string
⋮----
function generateImportantBlock({ packageName, hasIssues, hasDiscussions, hasReleases, hasChangelog, docsType, hasShippedDocs, skillDir, features, pkgFiles }: {
  packageName: string
  hasIssues?: boolean
  hasDiscussions?: boolean
  hasReleases?: boolean
  hasChangelog?: string | false
  docsType: string
  hasShippedDocs: boolean
  skillDir: string
  features?: FeaturesConfig
  pkgFiles?: string[]
}): string
⋮----
/** Shared preamble: Security, references table, Quality Principles, doc tree */
function buildPreamble(opts: BuildSkillPromptOptions &
⋮----
function getSectionDef(section: SkillSection, ctx: SectionContext, customPrompt?: CustomPrompt): PromptSection | null
⋮----
export function getSectionValidator(section: SkillSection): ((content: string) => SectionValidationWarning[]) | null
⋮----
// Custom needs a dummy prompt to instantiate
⋮----
/**
 * Build prompt for a single section
 */
export function buildSectionPrompt(opts: BuildSkillPromptOptions &
⋮----
// Count significant (major/minor) releases — patch releases excluded from budget signal
⋮----
/**
 * Build prompts for all selected sections, sharing the computed preamble
 */
export function buildAllSectionPrompts(opts: BuildSkillPromptOptions &
⋮----
/**
 * Transform an agent-specific prompt into a portable prompt for any LLM.
 * - Rewrites .skilld/ paths → ./references/
 * - Strips ## Output section (file-writing instructions)
 * - Strips skilld search/validate instructions
 * - Replaces tool-specific language with generic equivalents
 * - Strips agent-specific rules
 */
export function portabilizePrompt(prompt: string, section?: SkillSection): string
⋮----
// Rewrite absolute and relative .skilld/ paths → ./references/
⋮----
// Strip ## Output section entirely (Write tool, validate instructions)
⋮----
// Strip ## Search section (skilld search instructions)
// Stop at table (|), next heading (##), XML tag (<), or **IMPORTANT
⋮----
// Strip skilld search/validate references in rules
⋮----
// Replace tool-specific language
⋮----
// Strip agent-specific rules
⋮----
// Add portable output instruction
⋮----
// Clean up multiple blank lines
````

## File: src/agent/prompts/skill.ts
````typescript
import type { FeaturesConfig } from '../../core/config.ts'
import { repairMarkdown, sanitizeMarkdown } from '../../core/sanitize.ts'
import { resolveSkilldCommand } from '../../core/shared.ts'
import { yamlEscape } from '../../core/yaml.ts'
import { getFilePatterns } from '../../sources/package-registry.ts'
import { computeSkillDirName } from '../install.ts'
⋮----
export interface SkillOptions {
  name: string
  version?: string
  releasedAt?: string
  distTags?: Record<string, { version: string, releasedAt?: string }>
  globs?: string[]
  description?: string
  body?: string
  relatedSkills: string[]
  hasIssues?: boolean
  hasDiscussions?: boolean
  hasReleases?: boolean
  hasChangelog?: string | false
  docsType?: 'llms.txt' | 'readme' | 'docs'
  hasShippedDocs?: boolean
  pkgFiles?: string[]
  generatedBy?: string
  dirName?: string
  packages?: Array<{ name: string }>
  repoUrl?: string
  features?: FeaturesConfig
  eject?: boolean
}
⋮----
export function generateSkillMd(opts: SkillOptions): string
⋮----
// Eject mode: rewrite .skilld/ paths to ./references/ in LLM-generated body
// Then strip [source](./references/pkg/...) links since pkg/ is not ejected
⋮----
/** Format ISO date as short absolute date: "Jan 2025", "Dec 2024" */
function formatShortDate(isoDate: string): string
⋮----
function generatePackageHeader(
⋮----
// References with context hints (progressive disclosure — describe what each contains)
⋮----
function expandPackageName(name: string): string[]
⋮----
variants.add(unscoped) // nuxt/ui
variants.add(unscoped.replace(/\//g, ' ')) // nuxt ui
⋮----
// Hyphen → space: vue-router → vue router
⋮----
// Remove the original name itself from variants (it's already in the description)
⋮----
function expandRepoName(repoUrl: string): string[]
⋮----
function generateFrontmatter(
⋮----
// Strip angle brackets from npm description (forbidden in frontmatter per Agent Skills spec)
// Cap at 200 chars so the npm description doesn't crowd out our triggering prompt
⋮----
// Enforce 1024 char limit (Agent Skills spec)
⋮----
// version and generated_by go under metadata per Agent Skills spec
⋮----
function generateSearchBlock(name: string): string
⋮----
function generateFooter(relatedSkills: string[]): string
````

## File: src/agent/targets/amp.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/targets/antigravity.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/targets/base.ts
````typescript
import type { AgentTarget, FrontmatterField } from './types.ts'
⋮----
type DefaultedFields = 'skillFilename' | 'nameMatchesDir' | 'namePattern' | 'additionalSkillsDirs' | 'extensions' | 'notes'
⋮----
export function defineTarget(
  target: Omit<AgentTarget, DefaultedFields> & Partial<Pick<AgentTarget, DefaultedFields>>,
): AgentTarget
````

## File: src/agent/targets/claude-code.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/targets/cline.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/targets/codex.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/targets/cursor.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/targets/gemini-cli.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/targets/github-copilot.ts
````typescript
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
⋮----
function hasCopilotExtension(): boolean
````

## File: src/agent/targets/goose.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/targets/index.ts
````typescript

````

## File: src/agent/targets/opencode.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/targets/registry.ts
````typescript
import type { AgentType } from '../types.ts'
import type { AgentTarget } from './types.ts'
import { amp } from './amp.ts'
import { antigravity } from './antigravity.ts'
import { claudeCode } from './claude-code.ts'
import { cline } from './cline.ts'
import { codex } from './codex.ts'
import { cursor } from './cursor.ts'
import { geminiCli } from './gemini-cli.ts'
import { githubCopilot } from './github-copilot.ts'
import { goose } from './goose.ts'
import { opencode } from './opencode.ts'
import { roo } from './roo.ts'
import { windsurf } from './windsurf.ts'
````

## File: src/agent/targets/roo.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/targets/types.ts
````typescript
import type { AgentType } from '../types.ts'
⋮----
export interface FrontmatterField {
  name: string
  required: boolean
  description: string
  constraints?: string
}
⋮----
export interface AgentTarget {
  agent: AgentType
  displayName: string
  detectInstalled: () => boolean
  detectEnv: () => boolean
  detectProject: (cwd: string) => boolean
  cli?: string
  instructionFile?: string
  skillFilename: string
  skillsDir: string
  globalSkillsDir: string
  additionalSkillsDirs: string[]
  frontmatter: FrontmatterField[]
  nameMatchesDir: boolean
  namePattern: string
  discoveryStrategy: 'eager' | 'lazy'
  discoveryNotes: string
  agentSkillsSpec: boolean
  extensions: string[]
  docs: string
  notes: string[]
  skillActivationHint?: string
}
````

## File: src/agent/targets/windsurf.ts
````typescript
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { defineTarget, SPEC_FRONTMATTER } from './base.ts'
````

## File: src/agent/detect-imports.ts
````typescript
import { readFile } from 'node:fs/promises'
import { findDynamicImports, findStaticImports } from 'mlly'
import { glob } from 'tinyglobby'
import { detectPresetPackages } from './detect-presets.ts'
⋮----
export interface PackageUsage {
  name: string
  count: number
  source?: 'import' | 'preset'
}
⋮----
export interface DetectResult {
  packages: PackageUsage[]
  error?: string
}
⋮----
function addPackage(counts: Map<string, number>, specifier: string | undefined)
⋮----
export async function detectImportedPackages(cwd: string = process.cwd()): Promise<DetectResult>
⋮----
function isNodeBuiltin(pkg: string): boolean
````

## File: src/agent/detect-presets.ts
````typescript
import type { PackageUsage } from './detect-imports.ts'
import { readFile } from 'node:fs/promises'
import { parseSync } from 'oxc-parser'
import { join } from 'pathe'
⋮----
async function findNuxtConfig(cwd: string): Promise<
⋮----
export function extractModuleStrings(node: any): string[]
⋮----
export async function detectNuxtModules(cwd: string): Promise<PackageUsage[]>
⋮----
export async function detectPresetPackages(cwd: string): Promise<PackageUsage[]>
````

## File: src/agent/detect.ts
````typescript
import type { AgentType } from './types.ts'
import { spawnSync } from 'node:child_process'
import { isWindows } from 'std-env'
import { agents } from './registry.ts'
⋮----
export function detectInstalledAgents(): AgentType[]
⋮----
export function detectTargetAgent(): AgentType | null
⋮----
export function detectProjectAgents(): AgentType[]
⋮----
export function getAgentVersion(agentType: AgentType): string | null
⋮----
// Extract version number from output
// Common formats: "v1.2.3", "1.2.3", "cli 1.2.3", "name v1.2.3"
````

## File: src/agent/index.ts
````typescript

````

## File: src/agent/install.ts
````typescript
import type { AgentType } from './types.ts'
import { existsSync, lstatSync, mkdirSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { join, relative } from 'pathe'
import { repairMarkdown, sanitizeMarkdown } from '../core/sanitize.ts'
import { detectInstalledAgents } from './detect.ts'
import { agents } from './registry.ts'
⋮----
export function sanitizeName(name: string): string
⋮----
export function computeSkillDirName(packageName: string): string
⋮----
export function installSkillForAgents(
  skillName: string,
  skillContent: string,
  options: {
    global?: boolean
    cwd?: string
    agents?: AgentType[]
    files?: Record<string, string>
  } = {},
):
⋮----
export function linkSkillToAgents(skillName: string, sharedDir: string, cwd: string, agentType?: AgentType): void
⋮----
export function unlinkSkillFromAgents(skillName: string, cwd: string, agentType?: AgentType): void
````

## File: src/agent/registry.ts
````typescript

````

## File: src/agent/types.ts
````typescript
export type AgentType
  = | 'claude-code'
    | 'cursor'
    | 'windsurf'
    | 'cline'
    | 'codex'
    | 'github-copilot'
    | 'gemini-cli'
    | 'goose'
    | 'amp'
    | 'opencode'
    | 'roo'
    | 'antigravity'
⋮----
export interface SkillMetadata {
  name: string
  version?: string
  releasedAt?: string
  description?: string
}
````

## File: src/cache/cache.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { getCacheDir, getCacheKey, getVersionKey } from './version.ts'
````

## File: src/cache/config.ts
````typescript
import { homedir } from 'node:os'
import { join } from 'pathe'
import { getCacheKey } from './version.ts'
⋮----
export function getRepoCacheDir(owner: string, repo: string): string
⋮----
export function getPackageDbPath(name: string, version: string): string
````

## File: src/cache/index.ts
````typescript

````

## File: src/cache/storage.ts
````typescript
import type { CachedDoc, CachedPackage } from './types.ts'
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'pathe'
import { readPackageJsonSafe } from '../core/package-json.ts'
import { resolvePkgDir } from '../core/prepare.ts'
import { sanitizeMarkdown } from '../core/sanitize.ts'
import { getRepoCacheDir, REFERENCES_DIR, REPOS_DIR } from './config.ts'
import { getCacheDir } from './version.ts'
⋮----
function safeSymlink(target: string, linkPath: string): void
⋮----
export function isCached(name: string, version: string): boolean
⋮----
export function ensureCacheDir(): void
⋮----
export function writeToCache(
  name: string,
  version: string,
  docs: CachedDoc[],
): string
⋮----
export function writeToRepoCache(
  owner: string,
  repo: string,
  docs: CachedDoc[],
): string
⋮----
export function linkRepoCachedDir(skillDir: string, owner: string, repo: string, subdir: string): void
⋮----
export function linkCachedDir(skillDir: string, name: string, version: string, subdir: string): void
⋮----
export function linkPkg(skillDir: string, name: string, cwd: string, version?: string): void
⋮----
export function linkPkgNamed(skillDir: string, name: string, cwd: string, version?: string): void
⋮----
export function getPkgKeyFiles(name: string, cwd: string, version?: string): string[]
⋮----
export function writeSections(name: string, version: string, sections: Array<
⋮----
export function readCachedSection(name: string, version: string, file: string): string | null
⋮----
export function hasShippedDocs(name: string, cwd: string, version?: string): boolean
⋮----
export function listCached(): CachedPackage[]
⋮----
export function readCachedDocs(name: string, version: string): CachedDoc[]
⋮----
function walk(dir: string, prefix = '')
⋮----
export function clearCache(name: string, version: string): boolean
⋮----
export function clearAllCache(): number
⋮----
export function listReferenceFiles(skillDir: string, maxDepth = 3): string[]
⋮----
function walk(dir: string, depth: number)
````

## File: src/cache/types.ts
````typescript
export interface CacheConfig {
  name: string
  version: string
}
⋮----
export interface CachedPackage {
  name: string
  version: string
  dir: string
}
⋮----
export interface CachedDoc {
  path: string
  content: string
}
````

## File: src/cache/version.ts
````typescript
import { resolve } from 'pathe'
import { REFERENCES_DIR } from './config.ts'
⋮----
export function getVersionKey(version: string): string
⋮----
export function getCacheKey(name: string, version: string): string
⋮----
export function getCacheDir(name: string, version: string): string
````

## File: src/commands/assemble.ts
````typescript
import type { SkillSection } from '../agent/index.ts'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
⋮----
import { defineCommand } from 'citty'
import { join, relative, resolve } from 'pathe'
import { cleanSectionOutput } from '../agent/clis/index.ts'
import {
  extractMarkedSections,
  getSectionValidator,
  SECTION_MERGE_ORDER,
  SECTION_OUTPUT_FILES,
  wrapSection,
} from '../agent/index.ts'
import { iterateSkills } from '../core/skills.ts'
⋮----
function discoverSkillDirsWithOutputs(): string[]
⋮----
export async function assembleCommand(dir: string | undefined): Promise<void>
⋮----
function assembleDir(targetDir: string, cwd: string): void
⋮----
async run(
````

## File: src/commands/author.ts
````typescript
import type { OptimizeModel } from '../agent/index.ts'
import type { FeaturesConfig } from '../core/config.ts'
import type { LlmConfig } from './sync-shared.ts'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
⋮----
import { defineCommand } from 'citty'
import { join, relative, resolve } from 'pathe'
import {
  computeSkillDirName,
  generateSkillMd,
  getModelLabel,
} from '../agent/index.ts'
import {
  ensureCacheDir,
  getCacheDir,
  writeToCache,
} from '../cache/index.ts'
import { guard } from '../cli-helpers.ts'
import { defaultFeatures, readConfig } from '../core/config.ts'
import { timedSpinner } from '../core/formatting.ts'
import { appendToJsonArray, patchPackageJson, readPackageJsonSafe } from '../core/package-json.ts'
import { sanitizeMarkdown } from '../core/sanitize.ts'
import {
  fetchGitHubDiscussions,
  fetchGitHubIssues,
  formatDiscussionAsMarkdown,
  formatIssueAsMarkdown,
  generateDiscussionIndex,
  generateIssueIndex,
  isGhAvailable,
  parseGitHubUrl,
  readLocalPackageInfo,
} from '../sources/index.ts'
import {
  detectChangelog,
  ejectReferences,
  enhanceSkillWithLLM,
  forceClearCache,
  linkAllReferences,
  selectLlmConfig,
  writePromptFiles,
} from './sync-shared.ts'
⋮----
// ── Monorepo detection ──
⋮----
export interface MonorepoPackage {
  name: string
  version: string
  description?: string
  repoUrl?: string
  dir: string
}
⋮----
export function detectMonorepoPackages(cwd: string): MonorepoPackage[] | null
⋮----
// Must be private (monorepo root) with workspaces or pnpm-workspace.yaml
⋮----
// Check pnpm-workspace.yaml
⋮----
// Expand simple glob: "packagespackage.json
⋮----
function walkMarkdownFiles(dir: string, base = ''): Array<
⋮----
function resolveLocalDocs(
  packageDir: string,
  packageName: string,
  version: string,
  monorepoRoot?: string,
):
⋮----
const cacheChangelog = ()
⋮----
function cacheLocalChangelog(dir: string, packageName: string, version: string, monorepoRoot?: string): void
⋮----
async function fetchRemoteSupplements(opts: {
  packageName: string
  version: string
  repoUrl?: string
  features: FeaturesConfig
  onProgress: (msg: string) => void
}): Promise<
⋮----
export function patchPackageJsonFiles(packageDir: string): void
⋮----
async function authorSinglePackage(opts: {
  packageDir: string
  packageName: string
  version: string
  description?: string
  repoUrl?: string
  monorepoRoot?: string
  out?: string
  llmConfig?: LlmConfig | null
  force?: boolean
  debug?: boolean
}): Promise<string | null>
⋮----
async function resolveLlmConfig(model?: OptimizeModel, yes?: boolean): Promise<LlmConfig | null | undefined>
⋮----
async function authorCommand(opts: {
  out?: string
  model?: OptimizeModel
  yes?: boolean
  force?: boolean
  debug?: boolean
}): Promise<void>
⋮----
function printConsumerGuidance(packageNames: string[]): void
⋮----
async run(
````

## File: src/commands/cache.ts
````typescript
import type { Dirent } from 'node:fs'
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
⋮----
import { defineCommand } from 'citty'
import { join } from 'pathe'
import { CACHE_DIR, REFERENCES_DIR, REPOS_DIR } from '../cache/index.ts'
import { clearEmbeddingCache } from '../retriv/embedding-cache.ts'
⋮----
function safeRemove(path: string): number
⋮----
export async function cacheCleanCommand(): Promise<void>
⋮----
function dirEntries(dir: string): Dirent[]
⋮----
function sumFileBytes(entries: Dirent[]): number
⋮----
function fmtBytes(n: number): string
⋮----
export function cacheStatsCommand(): void
⋮----
const dim = (s: string) => `\x1B[90m$
⋮----
async run(
````

## File: src/commands/config.ts
````typescript
import type { OptimizeModel } from '../agent/index.ts'
import type { FeaturesConfig } from '../core/config.ts'
⋮----
import { defineCommand } from 'citty'
import { getOAuthProviderList, loginOAuthProvider, logoutOAuthProvider } from '../agent/clis/pi-ai.ts'
import { agents, detectTargetAgent, getAvailableModels, getModelName } from '../agent/index.ts'
import { guard, introLine, menuLoop, NO_MODELS_MESSAGE, OAUTH_NOTE, pickModel, requireInteractive } from '../cli-helpers.ts'
import { defaultFeatures, readConfig, updateConfig } from '../core/config.ts'
import { getProjectState } from '../core/skills.ts'
⋮----
export async function configCommand(): Promise<void>
⋮----
const cyan = (s: string) => `\x1B[36m$
⋮----
async function configureOAuth(): Promise<void>
⋮----
// ── Model selection ──────────────────────────────────────────────────
⋮----
async function configureModel(): Promise<void>
⋮----
// Loop so user can connect OAuth and come back to pick a model
⋮----
async run()
````

## File: src/commands/index.ts
````typescript

````

## File: src/commands/install.ts
````typescript
import type { AgentType, CustomPrompt, SkillSection } from '../agent/index.ts'
import type { FeaturesConfig } from '../core/config.ts'
import type { SkillInfo } from '../core/lockfile.ts'
import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
⋮----
import { defineCommand } from 'citty'
import { dirname, join } from 'pathe'
import { agents, createToolProgress, getModelLabel, linkSkillToAgents, optimizeDocs } from '../agent/index.ts'
import { generateSkillMd } from '../agent/prompts/skill.ts'
import {
  hasShippedDocs as checkShippedDocs,
  ensureCacheDir,
  getCacheDir,
  getPackageDbPath,
  getPkgKeyFiles,
  getRepoCacheDir,
  getShippedSkills,
  isCached,
  linkPkgNamed,
  linkShippedSkill,
  listReferenceFiles,
  readCachedDocs,
  resolvePkgDir,
  writeToCache,
} from '../cache/index.ts'
import { promptForAgent, resolveAgent, sharedArgs } from '../cli-helpers.ts'
import { defaultFeatures, readConfig } from '../core/config.ts'
import { timedSpinner } from '../core/formatting.ts'
import { mergeLocks, parsePackages, readLock, syncLockfilesToDirs, writeLock } from '../core/lockfile.ts'
import { readPackageJsonSafe } from '../core/package-json.ts'
import { sanitizeMarkdown } from '../core/sanitize.ts'
import { getSharedSkillsDir } from '../core/shared.ts'
import { createIndex, SearchDepsUnavailableError } from '../retriv/index.ts'
import { shutdownWorker } from '../retriv/pool.ts'
import { fetchGitSkills } from '../sources/git-skills.ts'
import {
  downloadLlmsDocs,
  fetchGitDocs,
  fetchGitHubRaw,
  fetchLlmsTxt,
  fetchReadmeContent,
  filterFrameworkDocs,
  isShallowGitDocs,
  normalizeLlmsLinks,
  parseGitHubUrl,
  resolveEntryFiles,
  resolvePackageDocs,
} from '../sources/index.ts'
import { classifyCachedDoc, indexResources } from './sync-shared.ts'
import { selectLlmConfig, writePromptFiles } from './sync.ts'
⋮----
export interface InstallOptions {
  global: boolean
  agent: AgentType
}
⋮----
export async function installCommand(opts: InstallOptions): Promise<void>
⋮----
// Shipped skills: re-link from node_modules or cached dist
⋮----
const isFrameworkDoc = (path: string)
⋮----
function copyFromExistingAgent(skillDir: string, name: string, allSkillsDirs: string[]): boolean
⋮----
function unsanitizeName(sanitized: string, source?: string): string
⋮----
function linkPkgSymlink(referencesDir: string, name: string, cwd: string, version?: string): void
⋮----
function isReadmeOnly(cacheDir: string): boolean
⋮----
function pkgHasShippedDocs(name: string, cwd: string, version?: string): boolean
⋮----
async function enhanceRegenerated(
  pkgName: string,
  version: string,
  skillDir: string,
  model: Parameters<typeof optimizeDocs>[0]['model'],
  sections: SkillSection[],
  customPrompt?: CustomPrompt,
  packages?: string,
): Promise<void>
⋮----
async run(
⋮----
function regenerateBaseSkillMd(
  skillDir: string,
  pkgName: string,
  version: string,
  cwd: string,
  allSkillNames: string[],
  source?: string,
  packages?: string,
): boolean
⋮----
function hasStaleReferences(referencesPath: string, pkgName: string, version: string, features: FeaturesConfig): boolean
````

## File: src/commands/list.ts
````typescript
import { defineCommand } from 'citty'
import { sharedArgs } from '../cli-helpers.ts'
import { formatSource, timeAgo } from '../core/formatting.ts'
import { getProjectState, iterateSkills } from '../core/skills.ts'
⋮----
export interface ListOptions {
  global?: boolean
  json?: boolean
  outdated?: boolean
}
⋮----
interface ListEntry {
  name: string
  version: string
  source: string
  synced: string
  latest?: string
}
⋮----
export async function listCommand(opts: ListOptions =
⋮----
run(
````

## File: src/commands/prepare.ts
````typescript
import { existsSync, mkdirSync } from 'node:fs'
⋮----
import { defineCommand } from 'citty'
import { join } from 'pathe'
import { agents, linkSkillToAgents } from '../agent/index.ts'
import { resolveAgent } from '../cli-helpers.ts'
import { readLock, writeLock } from '../core/lockfile.ts'
import { getShippedSkills, linkShippedSkill, restorePkgSymlink } from '../core/prepare.ts'
import { getSharedSkillsDir } from '../core/shared.ts'
import { getProjectState } from '../core/skills.ts'
⋮----
async run(
````

## File: src/commands/remove.ts
````typescript
import type { AgentType } from '../agent/index.ts'
import type { ProjectState, SkillEntry } from '../core/skills.ts'
import { existsSync, rmSync } from 'node:fs'
⋮----
import { defineCommand } from 'citty'
import { unlinkSkillFromAgents } from '../agent/index.ts'
import { getInstalledGenerators, introLine, isInteractive, promptForAgent, resolveAgent, sharedArgs } from '../cli-helpers.ts'
import { readConfig } from '../core/config.ts'
import { removeLockEntry } from '../core/lockfile.ts'
import { getSharedSkillsDir } from '../core/shared.ts'
import { getProjectState, getSkillsDir, iterateSkills } from '../core/skills.ts'
⋮----
export interface RemoveOptions {
  packages?: string[]
  global: boolean
  agent: AgentType
  yes: boolean
}
⋮----
export async function removeCommand(state: ProjectState, opts: RemoveOptions): Promise<void>
⋮----
async function pickSkillsToRemove(skills: SkillEntry[], scope: 'local' | 'global'): Promise<SkillEntry[] | null>
⋮----
async run(
````

## File: src/commands/search-interactive.ts
````typescript
import type { SearchFilter, SearchSnippet } from '../retriv/index.ts'
import { createLogUpdate } from 'log-update'
import { formatCompactSnippet, highlightTerms, normalizeScores, sanitizeMarkdown, scoreLabel } from '../core/index.ts'
import { closePool, openPool, SearchDepsUnavailableError, searchPooled } from '../retriv/index.ts'
import { findPackageDbs, getPackageVersions, listLockPackages, parseFilterPrefix } from './search.ts'
⋮----
type FilterLabel = typeof FILTER_CYCLE[number]
⋮----
function filterToSearchFilter(label: FilterLabel): SearchFilter | undefined
⋮----
export async function interactiveSearch(packageFilter?: string): Promise<void>
⋮----
function getFilterLabel(): string
⋮----
function render()
⋮----
// Title
⋮----
// Input line
⋮----
// Separator / spinner
⋮----
// Results or empty state
⋮----
async function doSearch()
⋮----
// Spin animation
⋮----
// Discard stale results
⋮----
function scheduleSearch()
⋮----
// Show initial state
⋮----
// Raw stdin for keystroke handling
⋮----
function cleanup()
⋮----
function exit()
⋮----
function selectResult()
⋮----
function onData(data: string)
````

## File: src/commands/search.ts
````typescript
import type { SearchFilter } from '../retriv/index.ts'
import { existsSync, readdirSync } from 'node:fs'
⋮----
import { defineCommand } from 'citty'
import { join } from 'pathe'
import { detectCurrentAgent } from 'unagent/env'
import { agents, detectTargetAgent } from '../agent/index.ts'
import { getPackageDbPath, REFERENCES_DIR } from '../cache/index.ts'
import { isInteractive } from '../cli-helpers.ts'
import { formatSnippet, normalizeScores, readLock, sanitizeMarkdown } from '../core/index.ts'
import { getSharedSkillsDir, resolveSkilldCommand } from '../core/shared.ts'
import { SearchDepsUnavailableError, searchSnippets } from '../retriv/index.ts'
⋮----
export function findPackageDbs(packageFilter?: string): string[]
⋮----
export function getPackageVersions(cwd: string = process.cwd()): Map<string, string>
⋮----
function readProjectLock(cwd: string): ReturnType<typeof readLock>
⋮----
export function listLockPackages(cwd: string = process.cwd()): string[]
⋮----
function filterLockDbs(lock: ReturnType<typeof readLock>, packageFilter?: string): string[]
⋮----
const tokenize = (s: string)
⋮----
// All tokens from filter must appear in package name tokens
⋮----
// Fallback: find any cached version's search.db for this package
⋮----
function findAnyPackageDb(name: string): string | null
⋮----
export function parseFilterPrefix(rawQuery: string):
⋮----
export function parseJsonFilter(raw: string): SearchFilter | null
⋮----
function mergeFilters(prefix?: SearchFilter, json?: SearchFilter): SearchFilter | undefined
⋮----
export interface SearchCommandOptions {
  packageFilter?: string
  filter?: SearchFilter
  limit?: number
}
⋮----
export async function searchCommand(rawQuery: string, opts: SearchCommandOptions =
⋮----
export function generateSearchGuide(packageName?: string): string
⋮----
async run(
````

## File: src/commands/setup.ts
````typescript
import type { AgentType } from '../agent/index.ts'
import { defineCommand } from 'citty'
import { resolveAgent, sharedArgs } from '../cli-helpers.ts'
import { runWizard } from './wizard.ts'
⋮----
async run(
````

## File: src/commands/status.ts
````typescript
import type { AgentType } from '../agent/index.ts'
import type { SkillInfo } from '../core/lockfile.ts'
import { existsSync, readdirSync, statSync } from 'node:fs'
⋮----
import { defineCommand } from 'citty'
import { join } from 'pathe'
import { agents, getAgentVersion } from '../agent/index.ts'
import { CACHE_DIR, getPackageDbPath } from '../cache/index.ts'
import { getCacheDir } from '../cache/version.ts'
import { sharedArgs } from '../cli-helpers.ts'
import { defaultFeatures, hasConfig, readConfig } from '../core/config.ts'
import { formatSource, timeAgo } from '../core/formatting.ts'
import { parsePackages } from '../core/lockfile.ts'
import { getSharedSkillsDir, mapInsert } from '../core/shared.ts'
⋮----
import { iterateSkills } from '../core/skills.ts'
import { version as skilldVersion } from '../version.ts'
⋮----
export interface StatusOptions {
  global?: boolean
}
⋮----
interface TrackedPackage {
  name: string
  info: SkillInfo
  agents: Set<AgentType>
  scope: 'local' | 'global'
}
⋮----
function countDocs(packageName: string, version?: string): number
⋮----
const walk = (dir: string, depth = 0) =>
⋮----
async function countEmbeddings(packageName: string, version?: string): Promise<number | null>
⋮----
function countRefDocs(skillDir: string): number
⋮----
const dim = (s: string) => `\x1B[90m$
const bold = (s: string) => `\x1B[1m$
const green = (s: string) => `\x1B[32m$
⋮----
function getLastSynced(): string | null
⋮----
function buildConfigLines(): string[]
⋮----
export async function statusCommand(opts: StatusOptions =
⋮----
const buildPackageLines = async (pkgs: Map<string, TrackedPackage>): Promise<string[]> =>
⋮----
run(
````

## File: src/commands/sync-git.ts
````typescript
import type { AgentType, OptimizeModel } from '../agent/index.ts'
import type { GitSkillSource } from '../sources/git-skills.ts'
import { mkdirSync, writeFileSync } from 'node:fs'
⋮----
import { dirname, join, relative } from 'pathe'
import {
  agents,
  generateSkillMd,
  getModelLabel,
  linkSkillToAgents,
  sanitizeName,
} from '../agent/index.ts'
import {
  CACHE_DIR,
  ensureCacheDir,
  getCacheDir,
  getPkgKeyFiles,
  getVersionKey,
  hasShippedDocs,
  isCached,
  resolvePkgDir,
} from '../cache/index.ts'
import { defaultFeatures, readConfig, registerProject } from '../core/config.ts'
import { timedSpinner } from '../core/formatting.ts'
import { writeLock } from '../core/lockfile.ts'
import { sanitizeMarkdown } from '../core/sanitize.ts'
import { getSharedSkillsDir } from '../core/shared.ts'
import { shutdownWorker } from '../retriv/pool.ts'
import { fetchGitSkills } from '../sources/git-skills.ts'
import { resolveGitHubRepo } from '../sources/github.ts'
import { track } from '../telemetry.ts'
import {
  detectChangelog,
  enhanceSkillWithLLM,
  ensureAgentInstructions,
  ensureGitignore,
  fetchAndCacheResources,
  indexResources,
  linkAllReferences,
  resolveBaseDir,
  selectLlmConfig,
  writePromptFiles,
} from './sync-shared.ts'
⋮----
export interface GitSyncOptions {
  source: GitSkillSource
  global: boolean
  agent: AgentType
  yes: boolean
  model?: OptimizeModel
  force?: boolean
  debug?: boolean
  from?: string
  skillFilter?: string[]
}
⋮----
export async function syncGitSkills(opts: GitSyncOptions): Promise<void>
⋮----
// Direct path: auto-select the matched skill
⋮----
// Install each selected skill
⋮----
// Sanitize and write SKILL.md
⋮----
async function syncGitHubRepo(opts: GitSyncOptions): Promise<void>
````

## File: src/commands/sync-parallel.ts
````typescript
import type { AgentType, CustomPrompt, OptimizeModel, SkillSection } from '../agent/index.ts'
import type { FeaturesConfig } from '../core/config.ts'
import type { ResolvedPackage } from '../sources/index.ts'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
⋮----
import logUpdate from 'log-update'
import pLimit from 'p-limit'
import { join } from 'pathe'
import {
  agents,
  computeSkillDirName,
  generateSkillMd,
  getModelLabel,
  linkSkillToAgents,
  optimizeDocs,
  SECTION_MERGE_ORDER,
  SECTION_OUTPUT_FILES,
  wrapSection,
} from '../agent/index.ts'
import {
  ensureCacheDir,
  getCacheDir,
  getPkgKeyFiles,
  getVersionKey,
  hasShippedDocs,
  isCached,
  linkPkgNamed,
  listReferenceFiles,
  readCachedSection,
  resolvePkgDir,
} from '../cache/index.ts'
import { defaultFeatures, readConfig, registerProject } from '../core/config.ts'
import { formatDuration } from '../core/formatting.ts'
import { parsePackages, readLock, writeLock } from '../core/lockfile.ts'
import { parseFrontmatter } from '../core/markdown.ts'
import { getSharedSkillsDir, semverDiff, SHARED_SKILLS_DIR } from '../core/shared.ts'
import { shutdownWorker } from '../retriv/pool.ts'
import {
  fetchPkgDist,
  parsePackageSpec,
  readLocalDependencies,
  resolvePackageDocsWithAttempts,
  searchNpmPackages,
} from '../sources/index.ts'
⋮----
import {
  detectChangelog,
  fetchAndCacheResources,
  findRelatedSkills,
  forceClearCache,
  handleShippedSkills,
  indexResources,
  linkAllReferences,
  RESOLVE_STEP_LABELS,
  resolveBaseDir,
  resolveLocalDep,
} from './sync-shared.ts'
import { DEFAULT_SECTIONS, ensureAgentInstructions, ensureGitignore, selectLlmConfig, writePromptFiles } from './sync.ts'
⋮----
type PackageStatus = 'pending' | 'resolving' | 'downloading' | 'embedding' | 'exploring' | 'thinking' | 'generating' | 'done' | 'error'
⋮----
interface PackageState {
  name: string
  status: PackageStatus
  message: string
  version?: string
  streamPreview?: string
  startedAt?: number
  completedAt?: number
}
⋮----
export interface ParallelSyncConfig {
  packages: string[]
  global: boolean
  agent: AgentType
  model?: OptimizeModel
  yes?: boolean
  force?: boolean
  debug?: boolean
  concurrency?: number
  mode?: 'add' | 'update'
}
⋮----
interface BaseSkillData {
  resolved: ResolvedPackage
  version: string
  skillDirName: string
  docsType: 'llms.txt' | 'readme' | 'docs'
  hasIssues: boolean
  hasDiscussions: boolean
  hasReleases: boolean
  hasChangelog: string | false
  shippedDocs: boolean
  pkgFiles: string[]
  relatedSkills: string[]
  packages?: Array<{ name: string }>
  warnings: string[]
  features?: FeaturesConfig
  oldVersion?: string
  oldSyncedAt?: string
  wasEnhanced?: boolean
  usedCache: boolean
  overheadLines?: number
}
⋮----
export async function syncPackagesParallel(config: ParallelSyncConfig): Promise<void>
⋮----
function render()
⋮----
function update(pkg: string, status: PackageStatus, message: string, version?: string)
⋮----
// Use first package's versions for display when single, otherwise omit specific versions
⋮----
type UpdateFn = (pkg: string, status: PackageStatus, message: string, version?: string) => void
⋮----
async function syncBaseSkill(
  packageSpec: string,
  config: ParallelSyncConfig,
  cwd: string,
  update: UpdateFn,
): Promise<'shipped' | BaseSkillData>
⋮----
async function enhanceWithLLM(
  packageName: string,
  data: BaseSkillData,
  config: ParallelSyncConfig & { model: OptimizeModel },
  cwd: string,
  update: UpdateFn,
  sections?: SkillSection[],
  customPrompt?: CustomPrompt,
): Promise<void>
````

## File: src/commands/sync-shared.ts
````typescript
import type { AgentType, CustomPrompt, OptimizeModel, SkillSection } from '../agent/index.ts'
import type { FeaturesConfig } from '../core/config.ts'
import type { ResolvedPackage, ResolveStep } from '../sources/index.ts'
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
⋮----
import { join, relative, resolve } from 'pathe'
import {
  agents,
  buildAllSectionPrompts,
  createToolProgress,
  generateSkillMd,
  getAvailableModels,
  getModelLabel,
  getModelName,
  optimizeDocs,
  SECTION_OUTPUT_FILES,
} from '../agent/index.ts'
import { maxItems, maxLines } from '../agent/prompts/optional/budget.ts'
import {
  clearCache,
  getCacheDir,
  getPackageDbPath,
  getRepoCacheDir,
  getShippedSkills,
  hasShippedDocs,
  linkCachedDir,
  linkPkg,
  linkPkgNamed,
  linkRepoCachedDir,
  linkShippedSkill,
  listReferenceFiles,
  readCachedDocs,
  resolvePkgDir,
  writeToCache,
  writeToRepoCache,
} from '../cache/index.ts'
import { isInteractive, NO_MODELS_MESSAGE, pickModel } from '../cli-helpers.ts'
import { defaultFeatures, readConfig, registerProject, updateConfig } from '../core/config.ts'
import { parsePackages, readLock, writeLock } from '../core/lockfile.ts'
import { parseFrontmatter } from '../core/markdown.ts'
import { readPackageJsonSafe } from '../core/package-json.ts'
import { sanitizeMarkdown } from '../core/sanitize.ts'
import { getSharedSkillsDir, semverDiff } from '../core/shared.ts'
import { createIndex, listIndexIds, SearchDepsUnavailableError } from '../retriv/index.ts'
import {
  downloadLlmsDocs,
  fetchBlogReleases,
  fetchCrawledDocs,
  fetchGitDocs,
  fetchGitHubDiscussions,
  fetchGitHubIssues,
  fetchGitHubRaw,
  fetchLlmsTxt,
  fetchNpmPackage,
  fetchReadmeContent,
  fetchReleaseNotes,
  filterFrameworkDocs,
  formatDiscussionAsMarkdown,
  formatIssueAsMarkdown,
  generateDiscussionIndex,
  generateDocsIndex,
  generateIssueIndex,
  generateReleaseIndex,
  getBlogPreset,
  getPrereleaseChangelogRef,
  isGhAvailable,
  isPrerelease,
  isShallowGitDocs,
  normalizeLlmsLinks,
  parseGitHubUrl,
  resolveEntryFiles,
  resolveLocalPackageDocs,
  toCrawlPattern,
} from '../sources/index.ts'
⋮----
export function classifyCachedDoc(path: string):
⋮----
export async function findRelatedSkills(packageName: string, skillsDir: string): Promise<string[]>
⋮----
export function forceClearCache(packageName: string, version: string, repoInfo?:
⋮----
export function linkAllReferences(skillDir: string, packageName: string, cwd: string, version: string, docsType: string, extraPackages?: Array<
⋮----
export function detectDocsType(packageName: string, version: string, repoUrl?: string, llmsUrl?: string):
⋮----
export interface HandleShippedResult {
  shipped: Array<{ skillName: string, skillDir: string }>
  baseDir: string
}
⋮----
export function handleShippedSkills(
  packageName: string,
  version: string,
  cwd: string,
  agent: AgentType,
  global: boolean,
): HandleShippedResult | null
⋮----
export function resolveBaseDir(cwd: string, agent: AgentType, global: boolean): string
⋮----
export async function resolveLocalDep(packageName: string, cwd: string): Promise<ResolvedPackage | null>
⋮----
export function detectChangelog(pkgDir: string | null, cacheDir?: string): string | false
⋮----
export interface IndexDoc {
  id: string
  content: string
  metadata: Record<string, any>
}
⋮----
export interface FetchResult {
  docSource: string
  docsType: 'llms.txt' | 'readme' | 'docs'
  docsToIndex: IndexDoc[]
  hasIssues: boolean
  hasDiscussions: boolean
  hasReleases: boolean
  warnings: string[]
  repoInfo?: { owner: string, repo: string }
  usedCache: boolean
}
⋮----
export async function fetchAndCacheResources(opts: {
  packageName: string
  resolved: ResolvedPackage
  version: string
  useCache: boolean
  features?: FeaturesConfig
  from?: string
  onProgress: (message: string) => void
}): Promise<FetchResult>
⋮----
const isFrameworkDoc = (path: string)
⋮----
// Parse GitHub releases for index (extract from frontmatter)
⋮----
function parentDocId(id: string): string
⋮----
function capDocs(allDocs: IndexDoc[], max: number, onProgress: (msg: string) => void): void
⋮----
export async function indexResources(opts: {
  packageName: string
  version: string
  cwd: string
  docsToIndex: IndexDoc[]
  features?: FeaturesConfig
  onProgress: (message: string) => void
}): Promise<void>
⋮----
export function ejectReferences(skillDir: string, packageName: string, cwd: string, version: string, docsType: string, features?: FeaturesConfig, repoInfo?:
⋮----
function copyCachedSubdir(cacheDir: string, refsDir: string, subdir: string): void
⋮----
function walk(dir: string, rel: string)
⋮----
// ── Shared UI + LLM functions (used by sync.ts, sync-git.ts, sync-parallel.ts, etc.) ──
⋮----
/**
 * Check if .gitignore has `.skilld` entry.
 * If missing, prompt to add it. Skipped for global installs.
 */
export async function ensureGitignore(skillsDir: string, cwd: string, isGlobal: boolean): Promise<void>
⋮----
function getSkillInstructions(agent: AgentType): string
⋮----
function getMdcSkillInstructions(agent: AgentType): string
⋮----
export async function ensureAgentInstructions(agent: AgentType, cwd: string, isGlobal: boolean): Promise<void>
⋮----
export async function selectModel(skipPrompt: boolean): Promise<OptimizeModel | null>
⋮----
export async function selectSkillSections(message = 'Enhance SKILL.md'): Promise<
⋮----
export interface LlmConfig {
  model: OptimizeModel
  sections: SkillSection[]
  customPrompt?: CustomPrompt
  promptOnly?: boolean
}
⋮----
export interface UpdateContext {
  oldVersion?: string
  newVersion?: string
  syncedAt?: string
  wasEnhanced: boolean
  bumpType?: string
}
⋮----
export async function selectLlmConfig(presetModel?: OptimizeModel, message?: string, updateCtx?: UpdateContext): Promise<LlmConfig | null>
⋮----
export interface EnhanceOptions {
  packageName: string
  version: string
  skillDir: string
  dirName?: string
  model: OptimizeModel
  resolved: { repoUrl?: string, llmsUrl?: string, releasedAt?: string, docsUrl?: string, gitRef?: string, dependencies?: Record<string, string>, distTags?: Record<string, { version: string, releasedAt?: string }> }
  relatedSkills: string[]
  hasIssues: boolean
  hasDiscussions: boolean
  hasReleases: boolean
  hasChangelog: string | false
  docsType: 'llms.txt' | 'readme' | 'docs'
  hasShippedDocs: boolean
  pkgFiles: string[]
  force?: boolean
  debug?: boolean
  sections?: SkillSection[]
  customPrompt?: CustomPrompt
  packages?: Array<{ name: string }>
  features?: FeaturesConfig
  eject?: boolean
  overheadLines?: number
}
⋮----
export async function enhanceSkillWithLLM(opts: EnhanceOptions): Promise<void>
⋮----
export interface WritePromptFilesOptions {
  packageName: string
  skillDir: string
  version: string
  hasIssues: boolean
  hasDiscussions: boolean
  hasReleases: boolean
  hasChangelog: string | false
  docsType: 'llms.txt' | 'readme' | 'docs'
  hasShippedDocs: boolean
  pkgFiles: string[]
  sections: SkillSection[]
  customPrompt?: CustomPrompt
  features?: FeaturesConfig
  overheadLines?: number
}
⋮----
export function writePromptFiles(opts: WritePromptFilesOptions): SkillSection[]
````

## File: src/commands/sync.ts
````typescript
import type { AgentType, OptimizeModel, SkillSection } from '../agent/index.ts'
import type { ProjectState } from '../core/skills.ts'
import type { GitSkillSource } from '../sources/git-skills.ts'
import type { ResolveAttempt } from '../sources/index.ts'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
⋮----
import { defineCommand } from 'citty'
import { join, relative, resolve } from 'pathe'
import {
  agents,
  buildAllSectionPrompts,
  computeSkillDirName,
  detectImportedPackages,
  generateSkillMd,
  getAvailableModels,
  getModelLabel,
  linkSkillToAgents,
  portabilizePrompt,
  sanitizeName,
  SECTION_MERGE_ORDER,
  SECTION_OUTPUT_FILES,
  wrapSection,
} from '../agent/index.ts'
import {
  ensureCacheDir,
  getCacheDir,
  getPkgKeyFiles,
  getVersionKey,
  hasShippedDocs,
  isCached,
  linkPkgNamed,
  listReferenceFiles,
  readCachedSection,
  resolvePkgDir,
} from '../cache/index.ts'
import { getInstalledGenerators, introLine, isInteractive, promptForAgent, resolveAgent, sharedArgs, suggestPrepareHook } from '../cli-helpers.ts'
import { defaultFeatures, hasCompletedWizard, readConfig, registerProject } from '../core/config.ts'
import { timedSpinner } from '../core/formatting.ts'
import { parsePackages, readLock, removeLockEntry, writeLock } from '../core/lockfile.ts'
import { parseFrontmatter } from '../core/markdown.ts'
import { getSharedSkillsDir, SHARED_SKILLS_DIR } from '../core/shared.ts'
import { getProjectState } from '../core/skills.ts'
import { shutdownWorker } from '../retriv/pool.ts'
import { parseGitSkillInput } from '../sources/git-skills.ts'
import {
  fetchPkgDist,
  isPrerelease,
  parsePackageSpec,
  readLocalDependencies,
  resolvePackageDocsWithAttempts,
  searchNpmPackages,
} from '../sources/index.ts'
import { syncGitSkills } from './sync-git.ts'
import { syncPackagesParallel } from './sync-parallel.ts'
import {
  DEFAULT_SECTIONS,
  detectChangelog,
  ejectReferences,
  enhanceSkillWithLLM,
  ensureAgentInstructions,
  ensureGitignore,
  fetchAndCacheResources,
  findRelatedSkills,
  forceClearCache,
  handleShippedSkills,
  indexResources,
  linkAllReferences,
  RESOLVE_STEP_LABELS,
  resolveBaseDir,
  resolveLocalDep,
  selectLlmConfig,
  writePromptFiles,
} from './sync-shared.ts'
import { runWizard } from './wizard.ts'
⋮----
function showResolveAttempts(attempts: ResolveAttempt[]): void
⋮----
export interface SyncOptions {
  packages?: string[]
  global: boolean
  agent: AgentType
  model?: OptimizeModel
  yes: boolean
  force?: boolean
  debug?: boolean
  mode?: 'add' | 'update'
  eject?: boolean | string
  name?: string
  from?: string
  noSearch?: boolean
}
⋮----
export async function syncCommand(state: ProjectState, opts: SyncOptions): Promise<void>
⋮----
async function interactivePicker(state: ProjectState): Promise<string[] | null>
⋮----
function maskPatch(version: string | undefined): string | undefined
⋮----
async function pickFromList(
  packages: Array<{ name: string, version?: string, count: number, inPkgJson: boolean }>,
  state: ProjectState,
): Promise<string[] | null>
⋮----
interface SyncConfig {
  global: boolean
  agent: AgentType
  model?: OptimizeModel
  yes: boolean
  force?: boolean
  debug?: boolean
  mode?: 'add' | 'update'
  eject?: boolean | string
  name?: string
  from?: string
  noSearch?: boolean
}
⋮----
async function syncSinglePackage(packageSpec: string, config: SyncConfig): Promise<void>
⋮----
async run(
⋮----
export async function exportPortablePrompts(packageSpec: string, opts: {
  out?: string
  sections?: SkillSection[]
  force?: boolean
  agent?: AgentType | 'none'
}): Promise<void>
````

## File: src/commands/uninstall.ts
````typescript
import type { AgentType } from '../agent/index.ts'
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
⋮----
import { defineCommand } from 'citty'
import { join } from 'pathe'
import { agents } from '../agent/index.ts'
import { CACHE_DIR } from '../cache/index.ts'
import { isInteractive, sharedArgs } from '../cli-helpers.ts'
import { getRegisteredProjects, unregisterProject } from '../core/config.ts'
import { readLock } from '../core/lockfile.ts'
import { mapInsert, SHARED_SKILLS_DIR } from '../core/shared.ts'
import { SKILLD_MARKER_END, SKILLD_MARKER_START } from './sync.ts'
⋮----
function removeAgentInstructions(agent: AgentType, projectPath: string): boolean
⋮----
function removeMarkerBlock(filePath: string): boolean
⋮----
export interface UninstallOptions {
  scope?: 'project' | 'all'
  agent?: AgentType
  yes: boolean
}
⋮----
export async function uninstallCommand(opts: UninstallOptions): Promise<void>
⋮----
interface RemoveItem { label: string, path: string, version?: string }
⋮----
const addToRemove = (label: string, path: string, version?: string) =>
⋮----
const addSkillsFromLock = (skillsDir: string, label: string): string[] =>
⋮----
const findUntrackedSkills = (skillsDir: string, trackedNames: string[]): string[] =>
⋮----
const processSkillsDir = (skillsDir: string, label: string) =>
⋮----
// Shared dir
⋮----
// Global skills from lockfiles
⋮----
const formatGroup = (items: Array<
⋮----
async run(
````

## File: src/commands/validate.ts
````typescript
import type { SkillSection } from '../agent/prompts/index.ts'
import { existsSync, readFileSync } from 'node:fs'
import { defineCommand } from 'citty'
import { getSectionValidator } from '../agent/prompts/index.ts'
⋮----
function inferSection(content: string): SkillSection | null
⋮----
async run(
````

## File: src/commands/wizard.ts
````typescript
import type { AgentType, OptimizeModel } from '../agent/index.ts'
import type { FeaturesConfig } from '../core/config.ts'
import { execSync } from 'node:child_process'
⋮----
import { getOAuthProviderList, loginOAuthProvider } from '../agent/clis/pi-ai.ts'
import { agents, getAvailableModels, getModelName } from '../agent/index.ts'
import { isInteractive, NO_MODELS_MESSAGE, OAUTH_NOTE, pickModel } from '../cli-helpers.ts'
import { defaultFeatures, updateConfig } from '../core/config.ts'
⋮----
function hasGhCli(): boolean
⋮----
export interface WizardOptions {
  agent?: AgentType
  showOutro?: boolean
}
⋮----
export async function runWizard(opts: WizardOptions =
⋮----
async function wizardConnectProvider(): Promise<void>
````

## File: src/core/config.ts
````typescript
import type { OptimizeModel } from '../agent/index.ts'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'pathe'
import { yamlEscape, yamlParseKV, yamlUnescape } from './yaml.ts'
⋮----
export interface FeaturesConfig {
  search: boolean
  issues: boolean
  discussions: boolean
  releases: boolean
}
⋮----
export interface SkilldConfig {
  model?: OptimizeModel
  agent?: string
  features?: FeaturesConfig
  projects?: string[]
  skipLlm?: boolean
}
⋮----
export function hasConfig(): boolean
⋮----
export function hasCompletedWizard(): boolean
⋮----
export function readConfig(): SkilldConfig
⋮----
export function writeConfig(config: SkilldConfig): void
⋮----
export function updateConfig(updates: Partial<SkilldConfig>): void
⋮----
export function registerProject(projectPath: string): void
⋮----
export function unregisterProject(projectPath: string): void
⋮----
export function getRegisteredProjects(): string[]
````

## File: src/core/formatting.ts
````typescript
import type { SearchSnippet } from '../retriv/index.ts'
import type { ProjectState } from './skills.ts'
⋮----
export function timeAgo(iso?: string): string
⋮----
export function formatSource(source?: string): string
⋮----
export function formatDuration(ms: number): string
⋮----
/** Spinner wrapper that shows elapsed time via built-in timer indicator */
export function timedSpinner()
⋮----
start(msg: string)
message(msg: string)
stop(msg: string)
⋮----
export function formatSkillStatus(state: ProjectState): void
⋮----
export function highlightTerms(content: string, terms: string[]): string
⋮----
export function scoreLabel(pct: number): string
⋮----
export function normalizeScores(results: SearchSnippet[]): Map<SearchSnippet, number>
⋮----
export function formatSnippet(r: SearchSnippet, versions?: Map<string, string>, pct?: number): string
⋮----
export function formatCompactSnippet(r: SearchSnippet, cols: number):
⋮----
// First meaningful line as preview (skip empty, frontmatter delimiters, headings-only)
````

## File: src/core/index.ts
````typescript

````

## File: src/core/lockfile.ts
````typescript
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'pathe'
import { parseFrontmatter } from './markdown.ts'
import { yamlEscape, yamlParseKV } from './yaml.ts'
⋮----
export interface SkillInfo {
  packageName?: string
  version?: string
  packages?: string
  repo?: string
  source?: string
  syncedAt?: string
  generator?: string
  path?: string
  ref?: string
  commit?: string
}
⋮----
export function parsePackages(packages?: string): Array<
⋮----
export function serializePackages(pkgs: Array<
⋮----
export interface SkilldLock {
  skills: Record<string, SkillInfo>
}
⋮----
function isSkillInfoKey(key: string): key is keyof SkillInfo
⋮----
export function parseSkillFrontmatter(skillPath: string): SkillInfo | null
⋮----
export function invalidateLockCache(skillsDir?: string): void
⋮----
export function readLock(skillsDir: string): SkilldLock | null
⋮----
function serializeLock(lock: SkilldLock): string
⋮----
export function writeLock(skillsDir: string, skillName: string, info: SkillInfo): void
⋮----
// Add/update new package
⋮----
// Keep primary as first package
⋮----
// Preserve fields from existing entry that aren't in new info
⋮----
export function mergeLocks(locks: SkilldLock[]): SkilldLock
⋮----
export function syncLockfilesToDirs(sourceLock: SkilldLock, dirs: string[]): void
⋮----
export function removeLockEntry(skillsDir: string, skillName: string): void
````

## File: src/core/markdown.ts
````typescript
import type { Nodes, Root } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter'
import { toString } from 'mdast-util-to-string'
import { frontmatter } from 'micromark-extension-frontmatter'
import { visit } from 'unist-util-visit'
import { yamlParseKV } from './yaml.ts'
⋮----
export interface MdHeading {
  depth: number
  text: string
}
⋮----
export interface MdLink {
  title: string
  url: string
}
⋮----
export interface ParsedMd {
  tree: Root
  frontmatter: Record<string, string>
}
⋮----
export function parseMd(content: string): ParsedMd
⋮----
export function parseFrontmatter(content: string): Record<string, string>
⋮----
function stripHeadingAnchors(text: string): string
⋮----
/** Extract title: frontmatter title > first h1 > null */
export function extractTitle(content: string): string | null
⋮----
/** Extract first paragraph text, 150 char max */
export function extractDescription(content: string): string | null
⋮----
export function extractHeadings(content: string): MdHeading[]
⋮----
export function extractLinks(content: string): MdLink[]
⋮----
export function stripFrontmatter(content: string): string
````

## File: src/core/package-json.ts
````typescript
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { applyEdits, modify, parseTree } from 'jsonc-parser'
⋮----
export interface EditOptions {
  tabSize?: number
  insertSpaces?: boolean
}
⋮----
export function readPackageJson(pkgPath: string):
⋮----
export function readPackageJsonSafe(pkgPath: string):
⋮----
export function invalidatePackageJson(pkgPath: string): void
⋮----
export function clearPackageJsonCache(): void
⋮----
export function editJsonProperty(raw: string, path: (string | number)[], value: unknown, options?: EditOptions): string
⋮----
export function removeJsonProperty(raw: string, path: (string | number)[]): string
⋮----
export function patchPackageJson(
  pkgPath: string,
  editFn: (raw: string, pkg: Record<string, unknown>) => string | null,
): boolean
⋮----
export function appendToJsonArray(raw: string, path: string[], value: string, options?: EditOptions): string
````

## File: src/core/prepare.ts
````typescript
import type { SkillInfo } from './lockfile.ts'
import { existsSync, lstatSync, mkdirSync, readdirSync, rmSync, symlinkSync, unlinkSync } from 'node:fs'
import { join } from 'pathe'
import { getCacheDir } from '../cache/version.ts'
⋮----
export function resolvePkgDir(name: string, cwd: string, version?: string): string | null
⋮----
export function restorePkgSymlink(skillsDir: string, name: string, info: SkillInfo, cwd: string): void
⋮----
export interface ShippedSkill {
  skillName: string
  skillDir: string
}
⋮----
export function getShippedSkills(name: string, cwd: string, version?: string): ShippedSkill[]
⋮----
export function linkShippedSkill(baseDir: string, skillName: string, targetDir: string): void
````

## File: src/core/sanitize.ts
````typescript
function decodeAngleBracketEntities(text: string): string
⋮----
function stripTags(text: string, tags: string[]): string
⋮----
// Then strip any remaining standalone open/close/self-closing tags
⋮----
/** External image markdown: ![alt](https://...) or ![alt](http://...) */
⋮----
/**
 * External link markdown: [text](https://...) or [text](http://...)
 * Preserves relative links and anchors.
 */
⋮----
/** Dangerous URI protocols in links/images — match entire [text](protocol:...) */
⋮----
/** Directive-style lines that look like agent instructions */
⋮----
/** Base64 blob: 100+ chars of pure base64 alphabet on a single line */
⋮----
/** Unicode escape spam: 4+ consecutive \uXXXX sequences */
⋮----
/**
 * Claude Code dynamic context: !`command` executes shell commands inline when a skill loads.
 * Matches !` followed by content and closing backtick(s) of same length.
 * Stripped globally — never legitimate in generated skills, always a command injection vector.
 */
⋮----
/** Emoji characters — token-inefficient (2-3x cost), distort embeddings, semantically ambiguous for LLMs */
// Also strips variation selectors (\uFE0E text, \uFE0F emoji) which dangle after emoji removal
⋮----
/**
 * Process content outside of fenced code blocks.
 * Uses a line-by-line state machine to properly track fence boundaries,
 * handling nested fences, mismatched lengths, and mixed backtick/tilde fences.
 * Unclosed fences are treated as non-code for security (prevents bypass via malformed fences).
 */
export function processOutsideCodeBlocks(content: string, fn: (text: string) => string): string
⋮----
function flushNonCode()
⋮----
// Unclosed fence: treat as non-code so sanitization still applies
⋮----
export function sanitizeMarkdown(content: string): string
⋮----
// Layer 2: Strip dynamic command placeholders globally (!`command` → command injection vector)
⋮----
// Layer 3: Strip agent directive tags globally (never legitimate, even in code blocks)
⋮----
// Layers 4-10: Only outside fenced code blocks
⋮----
// Protect inline code spans from tag stripping (e.g. `<script setup>` in Vue docs)
⋮----
// Layer 4: Strip HTML comments (outside code blocks where they're hidden from review;
⋮----
// Layer 5: Decode entities + strip remaining dangerous tags (HTML + entity-encoded agent directives)
⋮----
// Layer 6: Strip external images (exfil via query params)
⋮----
// Layer 7: Convert external links to plain text
⋮----
// Layer 9: Strip directive-style lines
⋮----
// Layer 10: Strip encoded payloads
⋮----
// Layer 11: Strip emoji (token-inefficient, distort embeddings, semantically ambiguous)
⋮----
// Restore inline code spans
⋮----
// --- Markdown repair ---
⋮----
/** Heading missing space after #: `##Heading` → `## Heading` */
⋮----
/** 3+ consecutive blank lines → 2 */
⋮----
/** Trailing whitespace on lines (preserve intentional double-space line breaks) */
⋮----
/** Emoji at start of line inside a code block — LLM forgot to close the block */
⋮----
/**
 * Close unclosed fenced code blocks.
 * Walks line-by-line tracking open/close state.
 */
function closeUnclosedCodeBlocks(content: string): string
⋮----
// Check for closing fence (same char, at least same length)
⋮----
// New fence opener inside unclosed block (same char, same length, with lang tag)
// LLMs commonly forget to close a code block before starting a new one
⋮----
// fence char/length stays the same since both match
⋮----
// Emoji at line start → LLM forgot to close code block before markdown content
⋮----
// If still inside a code block, close it
⋮----
// Ensure trailing newline before closing fence
⋮----
function cleanupCodeBlocks(content: string): string
⋮----
// Non-blank text between code blocks resets dedup tracking
⋮----
function closeUnclosedInlineCode(content: string): string
⋮----
// Outside fenced code blocks — fix unclosed inline backticks
⋮----
export function repairMarkdown(content: string): string
````

## File: src/core/shared.ts
````typescript
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import { diff as _semverDiff, gt as _semverGt, valid as _semverValid } from 'semver'
import { isWindows } from 'std-env'
⋮----
export function mapInsert<K, V>(map: Map<K, V>, key: K, create: () => V): V
⋮----
export function semverValid(v: string): string | null
⋮----
export function semverGt(a: string, b: string): boolean
⋮----
export function semverDiff(a: string, b: string): string | null
⋮----
export function resolveSkilldCommand(): string
⋮----
export function getSharedSkillsDir(cwd: string = process.cwd()): string | null
````

## File: src/core/skills.ts
````typescript
import type { AgentType } from '../agent/index.ts'
import type { ShippedSkill } from '../cache/storage.ts'
import type { SkillInfo } from './lockfile.ts'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'pathe'
import { agents } from '../agent/index.ts'
import { getShippedSkills } from '../cache/storage.ts'
import { readLocalDependencies } from '../sources/index.ts'
import { parsePackages, parseSkillFrontmatter, readLock } from './lockfile.ts'
import { getSharedSkillsDir, semverGt, semverValid } from './shared.ts'
⋮----
export interface SkillEntry {
  name: string
  dir: string
  agent: AgentType
  info: SkillInfo | null
  scope: 'local' | 'global'
  packageName?: string
  latestVersion?: string
}
⋮----
export interface AvailableShippedSkill {
  packageName: string
  skills: ShippedSkill[]
}
⋮----
export interface ProjectState {
  skills: SkillEntry[]
  deps: Map<string, string>
  missing: string[]
  outdated: SkillEntry[]
  synced: SkillEntry[]
  unmatched: SkillEntry[]
  shipped: AvailableShippedSkill[]
}
⋮----
export interface IterateSkillsOptions {
  scope?: 'local' | 'global' | 'all'
  agents?: AgentType[]
  cwd?: string
}
⋮----
export function isOutdated(skill: SkillEntry, depVersion: string): boolean
⋮----
// Non-semver versions (e.g. '*' from catalog:/workspace: specifiers) can't be compared
⋮----
export async function getProjectState(cwd: string = process.cwd()): Promise<ProjectState>
⋮----
const setBestSkill = (key: string, s: SkillEntry) =>
⋮----
// Prefer packageName-based lookup (handles duplicates correctly), fall back to name-based
⋮----
// Skills in lockfile but not matched to any local dep
⋮----
// Discover dependencies that ship skills not yet installed
⋮----
export function getSkillsDir(agent: AgentType, scope: 'local' | 'global', cwd: string = process.cwd()): string
````

## File: src/core/yaml.ts
````typescript
/**
 * Escape a value for safe YAML emission. Always double-quotes if the value
 * contains any special characters; returns unquoted for simple values.
 */
export function yamlEscape(value: string): string
⋮----
// Escape backslashes first, then double quotes, then control chars
⋮----
export function yamlUnescape(raw: string): string
⋮----
// Double-quoted: single-pass escape processing to handle backslashes correctly
⋮----
export function yamlParseKV(line: string): [string, string] | null
````

## File: src/retriv/embedding-cache.ts
````typescript
import type { DatabaseSync } from 'node:sqlite'
import type { Embedding } from 'retriv'
import { rmSync } from 'node:fs'
import { join } from 'pathe'
import { CACHE_DIR } from '../cache/index.ts'
⋮----
interface EmbeddingConfig {
  resolve: () => Promise<{ embedder: (texts: string[]) => Promise<Embedding[]>, dimensions: number, maxTokens?: number }>
}
⋮----
async function openDb(): Promise<DatabaseSync>
⋮----
function closeDb(): void
⋮----
function createSqliteStorage(db: DatabaseSync)
⋮----
export async function cachedEmbeddings(config: EmbeddingConfig): Promise<EmbeddingConfig>
⋮----
async resolve()
⋮----
export function clearEmbeddingCache(): void
````

## File: src/retriv/index.ts
````typescript
import type { ChunkEntity, Document, IndexConfig, IndexPhase, IndexProgress, SearchFilter, SearchOptions, SearchResult, SearchSnippet } from './types.ts'
import { stripFrontmatter } from '../core/markdown.ts'
⋮----
type RetrivInstance = Awaited<ReturnType<typeof getDb>>
⋮----
export class SearchDepsUnavailableError extends Error
⋮----
constructor(cause: unknown)
⋮----
export async function getDb(config: Pick<IndexConfig, 'dbPath'>)
⋮----
export async function createIndexDirect(
  documents: Document[],
  config: IndexConfig & { removeIds?: string[] },
): Promise<void>
⋮----
export async function createIndex(
  documents: Document[],
  config: IndexConfig & { removeIds?: string[] },
): Promise<void>
⋮----
export async function listIndexIds(
  config: Pick<IndexConfig, 'dbPath'>,
): Promise<string[]>
⋮----
export async function removeFromIndex(
  ids: string[],
  config: Pick<IndexConfig, 'dbPath'>,
): Promise<void>
⋮----
export async function search(
  query: string,
  config: IndexConfig,
  options: SearchOptions = {},
): Promise<SearchResult[]>
⋮----
/**
 * Search and return formatted snippets
 */
export async function searchSnippets(
  query: string,
  config: IndexConfig,
  options: SearchOptions = {},
): Promise<SearchSnippet[]>
⋮----
function toSnippets(results: SearchResult[]): SearchSnippet[]
⋮----
export async function openPool(dbPaths: string[]): Promise<Map<string, RetrivInstance>>
⋮----
export async function searchPooled(
  query: string,
  pool: Map<string, RetrivInstance>,
  options: SearchOptions = {},
): Promise<SearchSnippet[]>
⋮----
export async function closePool(pool: Map<string, RetrivInstance>): Promise<void>
````

## File: src/retriv/pool.ts
````typescript
import type { IndexConfig, Document as RetrivDocument } from './types.ts'
import type { WorkerMessage, WorkerResponse } from './worker.ts'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Worker } from 'node:worker_threads'
import { dirname, join } from 'pathe'
⋮----
interface PendingTask {
  id: number
  resolve: () => void
  reject: (err: Error) => void
  onProgress?: IndexConfig['onProgress']
}
⋮----
function resolveWorkerPath():
⋮----
function ensureWorker(): Worker
⋮----
function drainQueue()
⋮----
export async function createIndexInWorker(
  documents: RetrivDocument[],
  config: IndexConfig & { removeIds?: string[] },
): Promise<void>
⋮----
const run = () =>
⋮----
export async function shutdownWorker(): Promise<void>
````

## File: src/retriv/types.ts
````typescript
export interface ChunkEntity {
  name: string
  type: string
  signature?: string
  isPartial?: boolean
}
⋮----
export interface Document {
  id: string
  content: string
  metadata?: Record<string, any>
}
⋮----
export interface ChunkingOptions {
  chunkSize?: number
  chunkOverlap?: number
}
⋮----
export type IndexPhase = 'chunking' | 'embedding' | 'storing'
⋮----
export interface IndexProgress {
  phase: IndexPhase
  current: number
  total: number
}
⋮----
export interface IndexConfig {
  dbPath: string
  model?: string
  chunking?: ChunkingOptions
  onProgress?: (progress: IndexProgress) => void
}
⋮----
export interface SearchResult {
  id: string
  content: string
  score: number
  metadata: Record<string, any>
  highlights: string[]
  lineRange?: [number, number]
  entities?: ChunkEntity[]
  scope?: ChunkEntity[]
}
⋮----
export type FilterOperator
  = | { $eq: string | number | boolean }
    | { $ne: string | number | boolean }
    | { $gt: number }
    | { $gte: number }
    | { $lt: number }
    | { $lte: number }
    | { $in: (string | number)[] }
    | { $prefix: string }
    | { $exists: boolean }
⋮----
export type FilterValue = string | number | boolean | FilterOperator
export type SearchFilter = Record<string, FilterValue>
⋮----
export interface SearchOptions {
  limit?: number
  filter?: SearchFilter
}
⋮----
export interface SearchSnippet {
  package: string
  source: string
  lineStart: number
  lineEnd: number
  content: string
  score: number
  highlights: string[]
  entities?: ChunkEntity[]
  scope?: ChunkEntity[]
}
````

## File: src/retriv/worker.ts
````typescript
import type { IndexConfig, Document as RetrivDocument } from './types.ts'
import { parentPort } from 'node:worker_threads'
⋮----
export interface WorkerIndexMessage {
  type: 'index'
  id: number
  documents: RetrivDocument[]
  dbPath: string
  removeIds?: string[]
}
⋮----
export interface WorkerShutdownMessage {
  type: 'shutdown'
}
⋮----
export type WorkerMessage = WorkerIndexMessage | WorkerShutdownMessage
⋮----
export interface WorkerProgressResponse {
  type: 'progress'
  id: number
  phase: string
  current: number
  total: number
}
⋮----
export interface WorkerDoneResponse {
  type: 'done'
  id: number
}
⋮----
export interface WorkerErrorResponse {
  type: 'error'
  id: number
  message: string
}
⋮----
export type WorkerResponse = WorkerProgressResponse | WorkerDoneResponse | WorkerErrorResponse
````

## File: src/sources/blog-presets.ts
````typescript
export interface BlogRelease {
  version: string
  url: string
  date: string
  title?: string
}
⋮----
export interface BlogPreset {
  packageName: string
  releases: BlogRelease[]
}
⋮----
export function getBlogPreset(packageName: string): BlogPreset | undefined
````

## File: src/sources/blog-releases.ts
````typescript
import type { BlogRelease } from './package-registry.ts'
import { htmlToMarkdown } from 'mdream'
import pLimit from 'p-limit'
import { yamlEscape } from '../core/yaml.ts'
import { getBlogPreset } from './package-registry.ts'
import { compareSemver, parseSemver } from './releases.ts'
import { $fetch } from './utils.ts'
⋮----
export interface BlogReleasePost {
  version: string
  title: string
  date: string
  markdown: string
  url: string
}
⋮----
interface CachedDoc {
  path: string
  content: string
}
⋮----
function formatBlogRelease(release: BlogReleasePost): string
⋮----
async function fetchBlogPost(entry: BlogRelease): Promise<BlogReleasePost | null>
⋮----
/**
 * Filter blog releases by installed version
 * Only includes releases where version <= installedVersion
 * Returns all releases if version parsing fails (fail-safe)
 */
function filterBlogsByVersion(entries: BlogRelease[], installedVersion: string): BlogRelease[]
⋮----
return entries // Fail-safe: include all if version parsing fails
⋮----
// Include only releases where version <= installed version
⋮----
/**
 * Fetch blog release notes from package presets
 * Filters to only releases matching or older than the installed version
 * Returns CachedDoc[] with releases/blog-{version}.md files
 */
export async function fetchBlogReleases(
  packageName: string,
  installedVersion: string,
): Promise<CachedDoc[]>
⋮----
// Fetch all blog posts with controlled concurrency
⋮----
// Sort by version descending (newest first)
````

## File: src/sources/crawl.ts
````typescript
import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { crawlAndGenerate } from '@mdream/crawl'
import { join } from 'pathe'
⋮----
export async function fetchCrawledDocs(
  url: string,
  onProgress?: (message: string) => void,
  maxPages = 200,
): Promise<Array<
⋮----
const doCrawl = () => crawlAndGenerate(
⋮----
function extractHtmlLang(html: string): string | undefined
⋮----
function isForeignPathPrefix(segment: string | undefined, userLang: string): boolean
⋮----
function getUserLang(): string
⋮----
export function toCrawlPattern(docsUrl: string): string
````

## File: src/sources/discussions.ts
````typescript
import { spawnSync } from 'node:child_process'
import { mapInsert } from '../core/shared.ts'
import { BOT_USERS, buildFrontmatter, COMMENT_NOISE_RE, hasCodeBlock, isoDate, truncateBody } from './github-common.ts'
import { isGhAvailable } from './issues.ts'
⋮----
export interface DiscussionComment {
  body: string
  author: string
  reactions: number
  isMaintainer?: boolean
}
⋮----
export interface GitHubDiscussion {
  number: number
  title: string
  body: string
  category: string
  createdAt: string
  url: string
  upvoteCount: number
  comments: number
  isMaintainer?: boolean
  answer?: string
  topComments: DiscussionComment[]
}
⋮----
function scoreComment(c:
⋮----
export function scoreDiscussion(d: GitHubDiscussion): number
⋮----
export async function fetchGitHubDiscussions(
  owner: string,
  repo: string,
  limit = 20,
  releasedAt?: string,
  fromDate?: string,
): Promise<GitHubDiscussion[]>
⋮----
// Process answer — tag maintainer status
⋮----
// Process comments — filter noise, score for quality, take best 3
⋮----
export function formatDiscussionAsMarkdown(d: GitHubDiscussion): string
⋮----
// No accepted answer — include top comments as context
⋮----
export function generateDiscussionIndex(discussions: GitHubDiscussion[]): string
⋮----
// Sort categories: high-value first
````

## File: src/sources/docs.ts
````typescript
import { extractDescription, extractTitle } from '../core/markdown.ts'
⋮----
export function generateDocsIndex(docs: Array<
⋮----
// Group by directory, root-level files first
⋮----
// Root-level files first (no directory header)
⋮----
// Then grouped directories
````

## File: src/sources/entries.ts
````typescript
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'pathe'
import { glob } from 'tinyglobby'
⋮----
export interface EntryFile {
  path: string
  content: string
  type: 'types' | 'source'
}
⋮----
export async function resolveEntryFiles(packageDir: string): Promise<EntryFile[]>
````

## File: src/sources/git-skills.ts
````typescript
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { downloadTemplate } from 'giget'
import { join, resolve } from 'pathe'
import { parseFrontmatter } from '../core/markdown.ts'
import { getGitHubToken } from './github-common.ts'
import { $fetch, fetchGitHubRaw, normalizeRepoUrl, parseGitHubUrl } from './utils.ts'
⋮----
export interface GitSkillSource {
  type: 'github' | 'gitlab' | 'git-ssh' | 'local'
  owner?: string
  repo?: string
  skillPath?: string
  ref?: string
  localPath?: string
}
⋮----
export interface RemoteSkill {
  name: string
  description: string
  path: string
  content: string
  files: Array<{ path: string, content: string }>
}
⋮----
export function parseGitSkillInput(input: string): GitSkillSource | null
⋮----
function parseGitUrl(url: string): GitSkillSource | null
⋮----
// Handle /tree/ref/path URLs → extract specific skill path
⋮----
export function parseSkillFrontmatterName(content: string):
⋮----
function collectFiles(dir: string, prefix = ''): Array<
⋮----
export async function fetchGitSkills(
  source: GitSkillSource,
  onProgress?: (msg: string) => void,
): Promise<
⋮----
function fetchLocalSkills(source: GitSkillSource):
⋮----
function readLocalSkill(dir: string, repoPath: string): RemoteSkill | null
⋮----
// ── GitHub ──
⋮----
async function fetchGitHubSkills(
  source: GitSkillSource,
  onProgress?: (msg: string) => void,
): Promise<
⋮----
async function downloadGitHubSkills(
  owner: string,
  repo: string,
  ref: string,
  skillPath?: string,
  onProgress?: (msg: string) => void,
): Promise<RemoteSkill[]>
⋮----
// ── GitLab ──
⋮----
async function fetchGitLabSkills(
  source: GitSkillSource,
  onProgress?: (msg: string) => void,
): Promise<
````

## File: src/sources/github-common.ts
````typescript
import { spawnSync } from 'node:child_process'
import { ofetch } from 'ofetch'
import { yamlEscape } from '../core/yaml.ts'
⋮----
export const isoDate = (iso: string)
⋮----
export function buildFrontmatter(fields: Record<string, string | number | boolean | undefined>): string
⋮----
export function hasCodeBlock(text: string): boolean
⋮----
/** Noise patterns in comments — filter these out */
⋮----
/**
 * Smart body truncation — preserves code blocks and error messages.
 * Instead of slicing at a char limit, finds a safe break point.
 */
export function truncateBody(body: string, limit: number): string
⋮----
// Find code block boundaries so we don't cut mid-block
⋮----
// eslint-disable-next-line no-cond-assign
⋮----
// If the limit falls inside a code block, move limit to after the block
// (if not too far) or before the block
⋮----
// Block ends reasonably close — include it
⋮----
// Block is too long — cut before it
⋮----
// Try to break at a paragraph boundary
⋮----
// ── GitHub Auth ──
⋮----
/**
 * Get GitHub auth token from gh CLI (cached).
 * Returns null if gh CLI is not available or not authenticated.
 */
export function getGitHubToken(): string | null
⋮----
// ── Private Repo Tracking ──
⋮----
/** Repos where ungh.cc failed but gh api succeeded (likely private) */
⋮----
/** Mark a repo as needing authenticated access */
export function markRepoPrivate(owner: string, repo: string): void
⋮----
/** Check if a repo is known to need authenticated access */
export function isKnownPrivateRepo(owner: string, repo: string): boolean
⋮----
// ── GitHub API (async, no process spawn) ──
⋮----
/** Parse GitHub Link header for next page URL */
function parseLinkNext(header: string | null): string | null
⋮----
/**
 * Authenticated fetch against api.github.com. Returns null if no token or request fails.
 * Endpoint should be relative, e.g. `repos/owner/repo/releases`.
 */
export async function ghApi<T>(endpoint: string): Promise<T | null>
⋮----
export async function ghApiPaginated<T>(endpoint: string): Promise<T[]>
````

## File: src/sources/github.ts
````typescript
import type { LlmsLink, ResolvedPackage } from './types.ts'
import { spawnSync } from 'node:child_process'
import { existsSync as fsExistsSync, readFileSync as fsReadFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { mapInsert } from '../core/shared.ts'
import { getGitHubToken, ghApi, ghApiPaginated, isKnownPrivateRepo, markRepoPrivate } from './github-common.ts'
import { isGhAvailable } from './issues.ts'
import { fetchLlmsUrl } from './llms.ts'
import { getDocOverride } from './package-registry.ts'
import { $fetch, extractBranchHint, fetchGitHubRaw, fetchText, parseGitHubUrl } from './utils.ts'
⋮----
export const isShallowGitDocs = (n: number)
⋮----
export interface GitDocsResult {
  baseUrl: string
  ref: string
  files: string[]
  docsPrefix?: string
  allFiles?: string[]
  fallback?: boolean
}
⋮----
interface UnghFilesResponse {
  meta: { sha: string }
  files: Array<{ path: string, mode: string, sha: string, size: number }>
}
⋮----
async function listFilesAtRef(owner: string, repo: string, ref: string): Promise<string[]>
⋮----
interface TagResult {
  ref: string
  files: string[]
  fallback?: boolean
}
⋮----
async function findGitTag(owner: string, repo: string, version: string, packageName?: string, branchHint?: string): Promise<TagResult | null>
⋮----
interface GitHubApiRelease {
  tag_name: string
  published_at?: string
}
⋮----
async function fetchUnghReleases(owner: string, repo: string): Promise<Array<
⋮----
async function findLatestReleaseTag(owner: string, repo: string, packageName: string): Promise<string | null>
⋮----
function filterDocFiles(files: string[], pathPrefix: string): string[]
⋮----
export function filterFrameworkDocs(files: string[], packageName?: string): string[]
⋮----
/** Known noise paths to exclude from doc discovery */
⋮----
/** Directories to exclude from "best directory" heuristic */
⋮----
interface DiscoveredDocs {
  files: string[]
  prefix: string
}
⋮----
function hasExcludedDir(path: string): boolean
⋮----
function getPathDepth(path: string): number
⋮----
function hasDocDirBonus(path: string): boolean
⋮----
function scoreDocDir(dir: string, fileCount: number): number
⋮----
function discoverDocFiles(allFiles: string[], packageName?: string): DiscoveredDocs | null
⋮----
// Strategy 2: Find best directory by file count (for non-standard structures)
⋮----
// Group by immediate parent directory
⋮----
// Score and sort directories
⋮----
.filter(d => d.files.length >= 5) // Minimum threshold
⋮----
// For non-docs paths, the prefix is everything up to (but not including) the final dir
// e.g. 'website/pages/' -> prefix is 'website/' so files normalize to 'pages/...'
// But actually we want the full prefix so downstream can strip it
⋮----
/**
 * List markdown files in a folder at a specific git ref
 */
async function listDocsAtRef(owner: string, repo: string, ref: string, pathPrefix = 'docs/'): Promise<string[]>
⋮----
/**
 * Fetch versioned docs from GitHub repo's docs/ folder.
 * Pass packageName to check doc overrides (e.g. vue -> vuejs/docs).
 */
export async function fetchGitDocs(owner: string, repo: string, version: string, packageName?: string, repoUrl?: string): Promise<GitDocsResult | null>
⋮----
function normalizePath(p: string): string
⋮----
/**
 * Validate that discovered git docs are relevant by cross-referencing llms.txt links
 * against the repo file tree. Uses extensionless suffix matching to handle monorepo nesting.
 *
 * Returns { isValid, matchRatio } where isValid = matchRatio >= 0.3
 */
export function validateGitDocsWithLlms(
  llmsLinks: LlmsLink[],
  repoFiles: string[],
):
⋮----
// Sample up to 10 links
⋮----
// Normalize llms link paths
⋮----
// Strip absolute URL to pathname
⋮----
async function verifyNpmRepo(owner: string, repo: string, packageName: string): Promise<boolean>
⋮----
export async function searchGitHubRepo(packageName: string): Promise<string | null>
⋮----
// Only try if it looks like owner/repo
⋮----
// Try common patterns: {name}/{name}
⋮----
// Try gh CLI — strip @ to avoid GitHub search syntax issues
⋮----
export async function fetchGitHubRepoMeta(owner: string, repo: string, packageName?: string): Promise<
⋮----
export async function fetchReadme(owner: string, repo: string, subdir?: string, ref?: string): Promise<string | null>
⋮----
/**
 * Fetch README content from ungh:// pseudo-URL, file:// URL, or regular URL
 */
export interface GitSourceResult {
  /** URL pattern for fetching source */
  baseUrl: string
  /** Git ref (tag) used */
  ref: string
  /** List of source file paths relative to repo root */
  files: string[]
}
⋮----
/** URL pattern for fetching source */
⋮----
/** Git ref (tag) used */
⋮----
/** List of source file paths relative to repo root */
⋮----
/** Source file extensions to include */
⋮----
function filterSourceFiles(files: string[]): string[]
⋮----
export async function fetchGitSource(owner: string, repo: string, version: string, packageName?: string, repoUrl?: string): Promise<GitSourceResult | null>
⋮----
export async function fetchReadmeContent(url: string): Promise<string | null>
⋮----
export async function resolveGitHubRepo(
  owner: string,
  repo: string,
  onProgress?: (msg: string) => void,
): Promise<ResolvedPackage | null>
⋮----
// Fetch git docs
````

## File: src/sources/index.ts
````typescript

````

## File: src/sources/issues.ts
````typescript
import { spawnSync } from 'node:child_process'
⋮----
import { mapInsert } from '../core/shared.ts'
import { BOT_USERS, buildFrontmatter, COMMENT_NOISE_RE, hasCodeBlock, isoDate, truncateBody } from './github-common.ts'
⋮----
export type IssueType = 'bug' | 'question' | 'docs' | 'feature' | 'other'
⋮----
export interface IssueComment {
  body: string
  author: string
  reactions: number
  isMaintainer?: boolean
}
⋮----
export interface GitHubIssue {
  number: number
  title: string
  state: string
  labels: string[]
  body: string
  createdAt: string
  url: string
  reactions: number
  comments: number
  type: IssueType
  topComments: IssueComment[]
  score: number
  resolvedIn?: string
}
⋮----
export function isGhAvailable(): boolean
⋮----
function getLabelRegex(keywords: Set<string>): RegExp
⋮----
export function labelMatchesAny(label: string, keywords: Set<string>): boolean
⋮----
export function classifyIssue(labels: string[]): IssueType
⋮----
function isNoiseIssue(issue:
⋮----
export function isNonTechnical(issue:
⋮----
// Very short body with no code — probably sentiment/meta
⋮----
// Sentiment patterns (love letters, fan mail)
⋮----
/**
 * Freshness-weighted score: reactions * decay(age_in_years)
 * Steep decay so recent issues dominate over old high-reaction ones.
 * At 0.6: 1yr=0.63x, 2yr=0.45x, 4yr=0.29x, 6yr=0.22x
 */
export function freshnessScore(reactions: number, createdAt: string): number
⋮----
/**
 * Type quotas — guarantee a mix of issue types.
 * Bugs and questions get priority; feature requests are hard-capped.
 */
function applyTypeQuotas(issues: GitHubIssue[], limit: number): GitHubIssue[]
⋮----
// Sort each group by score
⋮----
// Allocate slots: bugs 40%, questions 30%, docs 15%, features 10%, other 5%
⋮----
function bodyLimit(reactions: number): number
⋮----
function fetchIssuesByState(
  owner: string,
  repo: string,
  state: 'open' | 'closed',
  count: number,
  releasedAt?: string,
  fromDate?: string,
): GitHubIssue[]
⋮----
// Explicit lower bound: only issues from this date onward
⋮----
function oneYearAgo(): string
⋮----
function enrichWithComments(owner: string, repo: string, issues: GitHubIssue[], topN = 15): void
⋮----
// Score: maintainers get 3x, code blocks get 2x, reactions add linearly
⋮----
// Take top 3 quality comments
⋮----
// For closed issues: try to detect fix version from maintainer comments
⋮----
function detectResolvedVersion(comments: IssueComment[]): string | undefined
⋮----
export async function fetchGitHubIssues(
  owner: string,
  repo: string,
  limit = 30,
  releasedAt?: string,
  fromDate?: string,
): Promise<GitHubIssue[]>
⋮----
export function formatIssueAsMarkdown(issue: GitHubIssue): string
⋮----
export function generateIssueIndex(issues: GitHubIssue[]): string
````

## File: src/sources/llms.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { extractSections, normalizeLlmsLinks, parseMarkdownLinks } from './llms.ts'
````

## File: src/sources/llms.ts
````typescript
import type { FetchedDoc, LlmsContent, LlmsLink } from './types.ts'
import pLimit from 'p-limit'
import { extractLinks } from '../core/markdown.ts'
import { fetchText, verifyUrl } from './utils.ts'
⋮----
export async function fetchLlmsUrl(docsUrl: string): Promise<string | null>
⋮----
export async function fetchLlmsTxt(url: string): Promise<LlmsContent | null>
⋮----
export function parseMarkdownLinks(content: string): LlmsLink[]
⋮----
export function isSafeUrl(url: string): boolean
⋮----
export async function downloadLlmsDocs(
  llmsContent: LlmsContent,
  baseUrl: string,
  onProgress?: (url: string, index: number, total: number) => void,
): Promise<FetchedDoc[]>
⋮----
export function normalizeLlmsLinks(content: string, baseUrl?: string): string
⋮----
export function extractSections(content: string, patterns: string[]): string | null
````

## File: src/sources/npm.ts
````typescript
import type { LocalDependency, NpmPackageInfo, ResolveAttempt, ResolvedPackage, ResolveResult } from './types.ts'
import { spawnSync } from 'node:child_process'
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { Writable } from 'node:stream'
import { pathToFileURL } from 'node:url'
import { resolvePathSync } from 'mlly'
import { basename, dirname, join, resolve } from 'pathe'
import { getCacheDir } from '../cache/version.ts'
import { readPackageJsonSafe } from '../core/package-json.ts'
import { fetchGitDocs, fetchGitHubRepoMeta, fetchReadme, searchGitHubRepo, validateGitDocsWithLlms } from './github.ts'
import { fetchLlmsTxt, fetchLlmsUrl } from './llms.ts'
import { getCrawlUrl } from './package-registry.ts'
import { $fetch, isGitHubRepoUrl, isUselessDocsUrl, normalizeRepoUrl, parseGitHubUrl, parsePackageSpec } from './utils.ts'
⋮----
export async function searchNpmPackages(query: string, size = 5): Promise<Array<
⋮----
export async function fetchNpmPackage(packageName: string): Promise<NpmPackageInfo | null>
⋮----
export interface DistTagInfo {
  version: string
  releasedAt?: string
}
⋮----
export interface NpmRegistryMeta {
  releasedAt?: string
  distTags?: Record<string, DistTagInfo>
}
⋮----
export async function fetchNpmRegistryMeta(packageName: string, version: string): Promise<NpmRegistryMeta>
⋮----
export type ResolveStep = 'npm' | 'github-docs' | 'github-meta' | 'github-search' | 'readme' | 'llms.txt' | 'crawl' | 'local'
⋮----
export interface ResolveOptions {
  version?: string
  cwd?: string
  onProgress?: (step: ResolveStep) => void
}
⋮----
async function resolveGitHub(
  gh: { owner: string, repo: string },
  targetVersion: string | undefined,
  pkg: { name: string },
  result: ResolvedPackage,
  attempts: ResolveAttempt[],
  onProgress?: (step: ResolveStep) => void,
  opts?: { rawRepoUrl?: string, subdir?: string },
): Promise<string[] | undefined>
⋮----
export async function resolvePackageDocs(packageName: string, options: ResolveOptions =
⋮----
export async function resolvePackageDocsWithAttempts(packageName: string, options: ResolveOptions =
⋮----
// Use npm homepage early (skip GitHub repo URLs)
⋮----
// GitHub repo handling - try versioned git docs first
⋮----
export function parseVersionSpecifier(
  name: string,
  version: string,
  cwd: string,
): LocalDependency | null
⋮----
// catalog: and workspace: specifiers - include with wildcard version
// so the dep isn't silently dropped from state.deps
⋮----
export function resolveInstalledVersion(name: string, cwd: string): string | null
⋮----
export async function readLocalDependencies(cwd: string): Promise<LocalDependency[]>
⋮----
export interface LocalPackageInfo {
  name: string
  version: string
  description?: string
  repoUrl?: string
  localPath: string
}
⋮----
export function readLocalPackageInfo(localPath: string): LocalPackageInfo | null
⋮----
export async function resolveLocalPackageDocs(localPath: string): Promise<ResolvedPackage | null>
⋮----
export async function fetchPkgDist(name: string, version: string): Promise<string | null>
⋮----
write(chunk, _encoding, callback)
⋮----
function pump()
⋮----
export async function fetchLatestVersion(packageName: string): Promise<string | null>
⋮----
export function getInstalledSkillVersion(skillDir: string): string | null
````

## File: src/sources/package-registry.ts
````typescript
export interface BlogRelease {
  version: string
  url: string
  date: string
  title?: string
}
⋮----
export interface PackageEntry {
  filePatterns?: string[]
  primary?: boolean
  rules?: string[]
}
⋮----
export interface RepoEntry {
  owner: string
  repo: string
  docsRepo?: string
  docsPath?: string
  docsRef?: string
  homepage?: string
  crawlUrl?: string
  prereleaseChangelogRef?: string
  packages: Record<string, PackageEntry>
  blogReleases?: BlogRelease[]
}
⋮----
export interface DocOverride {
  owner: string
  repo: string
  path: string
  ref?: string
  homepage?: string
}
⋮----
export interface BlogPreset {
  packageName: string
  releases: BlogRelease[]
}
⋮----
export function getDocOverride(packageName: string): DocOverride | undefined
⋮----
export function getBlogPreset(packageName: string): BlogPreset | undefined
⋮----
export function getFilePatterns(packageName: string): string[] | undefined
⋮----
export function getRepoEntry(repoKey: string): RepoEntry | undefined
⋮----
export function getRepoKeyForPackage(packageName: string): string | undefined
⋮----
export function getPackageRules(packageName: string): string[]
⋮----
export function getPrereleaseChangelogRef(packageName: string): string | undefined
⋮----
export function getCrawlUrl(packageName: string): string | undefined
⋮----
export function getRelatedPackages(packageName: string): string[]
````

## File: src/sources/releases.ts
````typescript
import { yamlEscape } from '../core/yaml.ts'
import { ghApiPaginated, isoDate } from './github-common.ts'
import { $fetch, fetchGitHubRaw } from './utils.ts'
⋮----
export interface GitHubRelease {
  id: number
  tag: string
  name: string
  prerelease: boolean
  createdAt: string
  publishedAt: string
  markdown: string
}
⋮----
interface UnghReleasesResponse {
  releases: GitHubRelease[]
}
⋮----
interface CachedDoc {
  path: string
  content: string
}
⋮----
export interface SemVer {
  major: number
  minor: number
  patch: number
  raw: string
}
⋮----
export function parseSemver(version: string): SemVer | null
⋮----
/**
 * Extract version from a release tag, handling monorepo formats:
 * - `pkg@1.2.3` → `1.2.3`
 * - `pkg-v1.2.3` → `1.2.3`
 * - `v1.2.3` → `1.2.3`
 * - `1.2.3` → `1.2.3`
 */
function extractVersion(tag: string, packageName?: string): string | null
⋮----
// Monorepo: pkg@version or pkg-vversion
⋮----
// Standard: v1.2.3 or 1.2.3
⋮----
function escapeRegex(str: string): string
⋮----
/**
 * Check if a release tag belongs to a specific package
 */
function tagMatchesPackage(tag: string, packageName: string): boolean
⋮----
// Exact match: pkg@version or pkg-vversion
⋮----
/**
 * Check if a version string contains a prerelease suffix (e.g. 6.0.0-beta, 1.2.3-rc.1)
 */
export function isPrerelease(version: string): boolean
⋮----
export function compareSemver(a: SemVer, b: SemVer): number
⋮----
interface GitHubApiRelease {
  id: number
  tag_name: string
  name: string
  prerelease: boolean
  created_at: string
  published_at: string
  body: string
}
⋮----
/** Map GitHub API release to our GitHubRelease shape */
function mapApiRelease(r: GitHubApiRelease): GitHubRelease
⋮----
/**
 * Fetch all releases — GitHub API first (authenticated, async), ungh.cc fallback
 */
async function fetchAllReleases(owner: string, repo: string): Promise<GitHubRelease[]>
⋮----
// Try authenticated GitHub API first (no rate limits, works for private repos)
⋮----
// Fallback: ungh.cc (fast, no auth needed for public repos)
⋮----
/**
 * Select last 20 stable releases for a package, sorted newest first.
 * For monorepos, filters to package-specific tags (pkg@version).
 * Falls back to generic tags (v1.2.3) only if no package-specific found.
 * If installedVersion is provided, filters out releases newer than it.
 */
export function selectReleases(releases: GitHubRelease[], packageName?: string, installedVersion?: string, fromDate?: string): GitHubRelease[]
⋮----
// Check if this looks like a monorepo (has package-prefixed tags)
⋮----
// Monorepo: only include tags for this package
⋮----
// Date lower bound: skip releases published before fromDate
⋮----
// Prerelease handling: include only when installed is also prerelease and same major.minor
⋮----
// Filter out stable releases newer than installed version
⋮----
// No cap when fromDate is set — include all matching releases
⋮----
/**
 * Format a release as markdown with YAML frontmatter
 */
function formatRelease(release: GitHubRelease, packageName?: string): string
⋮----
export interface ReleaseIndexOptions {
  releases: GitHubRelease[]
  packageName?: string
  blogReleases?: Array<{ version: string, title: string, date: string }>
  hasChangelog?: boolean
}
⋮----
/**
 * Generate a unified summary index of all releases for quick LLM scanning.
 * Includes GitHub releases, blog release posts, and CHANGELOG link.
 */
export function generateReleaseIndex(releasesOrOpts: GitHubRelease[] | ReleaseIndexOptions, packageName?: string): string
⋮----
// Support both old signature and new options object
⋮----
// Blog release posts (major version announcements)
⋮----
// GitHub release notes
⋮----
// CHANGELOG link
⋮----
/**
 * Check if a single release is a stub redirecting to CHANGELOG.md.
 * Short body (<500 chars) that mentions CHANGELOG indicates no real content.
 */
export function isStubRelease(release: GitHubRelease): boolean
⋮----
/**
 * Detect if releases are just short stubs redirecting to CHANGELOG.md.
 * Samples up to 3 releases — if all are stubs, it's a redirect pattern.
 */
export function isChangelogRedirectPattern(releases: GitHubRelease[]): boolean
⋮----
/**
 * Fetch CHANGELOG.md from a GitHub repo at a specific ref as fallback.
 * For monorepos, also checks packages/{shortName}/CHANGELOG.md.
 */
async function fetchChangelog(owner: string, repo: string, ref: string, packageName?: string): Promise<string | null>
⋮----
// Monorepo: try package-specific paths first (e.g. packages/pinia/CHANGELOG.md)
⋮----
export async function fetchReleaseNotes(
  owner: string,
  repo: string,
  installedVersion: string,
  gitRef?: string,
  packageName?: string,
  fromDate?: string,
  changelogRef?: string,
): Promise<CachedDoc[]>
````

## File: src/sources/types.ts
````typescript
export interface NpmPackageInfo {
  name: string
  version?: string
  description?: string
  homepage?: string
  repository?: string | {
    type: string
    url: string
    directory?: string
  }
  readme?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}
⋮----
export interface ResolvedPackage {
  name: string
  version?: string
  releasedAt?: string
  description?: string
  dependencies?: Record<string, string>
  distTags?: Record<string, { version: string, releasedAt?: string }>
  docsUrl?: string
  llmsUrl?: string
  readmeUrl?: string
  repoUrl?: string
  gitDocsUrl?: string
  gitRef?: string
  gitDocsFallback?: boolean
  crawlUrl?: string
}
⋮----
export interface LocalDependency {
  name: string
  version: string
}
⋮----
export interface LlmsContent {
  raw: string
  links: LlmsLink[]
}
⋮----
export interface LlmsLink {
  title: string
  url: string
}
⋮----
export interface FetchedDoc {
  url: string
  title: string
  content: string
}
⋮----
export interface ResolveAttempt {
  source: 'npm' | 'github-docs' | 'github-meta' | 'github-search' | 'llms.txt' | 'readme'
  url?: string
  status: 'success' | 'not-found' | 'error'
  message?: string
}
⋮----
export interface ResolveResult {
  package: ResolvedPackage | null
  attempts: ResolveAttempt[]
  registryVersion?: string
}
````

## File: src/sources/utils.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { isGitHubRepoUrl, normalizeRepoUrl, parseGitHubUrl } from './utils.ts'
````

## File: src/sources/utils.ts
````typescript
import { ofetch } from 'ofetch'
import { getGitHubToken, isKnownPrivateRepo, markRepoPrivate } from './github-common.ts'
⋮----
export async function fetchText(url: string): Promise<string | null>
⋮----
function extractGitHubRepo(url: string):
⋮----
export async function fetchGitHubRaw(url: string): Promise<string | null>
⋮----
export async function verifyUrl(url: string): Promise<boolean>
⋮----
export function isUselessDocsUrl(url: string): boolean
⋮----
export function isGitHubRepoUrl(url: string): boolean
⋮----
export function parseGitHubUrl(url: string):
````

## File: src/cli-entry.ts
````typescript

````

## File: src/cli-helpers.ts
````typescript
import type { AgentType, OptimizeModel } from './agent/index.ts'
import type { ProjectState } from './core/skills.ts'
⋮----
import { parseTree } from 'jsonc-parser'
import { join } from 'pathe'
import { detectCurrentAgent } from 'unagent/env'
import { agents, detectInstalledAgents, detectProjectAgents, detectTargetAgent, getAgentVersion, getModelName } from './agent/index.ts'
import { readConfig, updateConfig } from './core/config.ts'
import { editJsonProperty, patchPackageJson, readPackageJsonSafe } from './core/package-json.ts'
import { version } from './version.ts'
⋮----
export interface IntroOptions {
  state: ProjectState
  generators?: Array<{ name: string, version: string }>
  modelId?: string
  agentId?: string
}
⋮----
export class MenuCancel extends Error
⋮----
export function guard<T>(value: T | symbol): T
⋮----
export interface MenuOption {
  label: string
  value: string
  hint?: string
}
⋮----
export async function menuLoop(opts: {
  message: string
  options: () => MenuOption[] | Promise<MenuOption[]>
  onSelect: (value: string) => Promise<boolean | void>
  initialValue?: string | (() => string | undefined)
  searchable?: boolean
}): Promise<void>
⋮----
export function isRunningInsideAgent(): boolean
⋮----
export function isInteractive(): boolean
⋮----
export function requireInteractive(command: string): void
⋮----
export function resolveAgent(agentFlag?: string): AgentType | 'none' | null
⋮----
function warnNoAgent(): void
⋮----
export async function promptForAgent(): Promise<AgentType | 'none' | null>
⋮----
export function getInstalledGenerators(): Array<
⋮----
export function relativeTime(date: Date): string
⋮----
export function getLastSynced(state: ProjectState): string | null
⋮----
export function introLine(
⋮----
// Status line: enhancement model → target agent
⋮----
export function formatStatus(synced: number, outdated: number): string
⋮----
// ── Shared UI constants ───────────────────────────────────────────────
⋮----
export function groupModelsByProvider<T extends
⋮----
export interface ModelPickerOptions {
  before?: Array<{ label: string, value: string, hint?: string }>
  after?: Array<{ label: string, value: string, hint?: string }>
}
⋮----
export async function pickModel<T extends { provider: string, providerName: string, name: string, id: string, hint: string, recommended?: boolean }>(
  models: T[],
  opts: ModelPickerOptions = {},
): Promise<string | null>
⋮----
export function hasPrepareHook(cwd: string = process.cwd()): boolean
⋮----
export async function suggestPrepareHook(cwd: string = process.cwd()): Promise<boolean>
⋮----
export function buildPrepareScript(existing: string | undefined, cwd: string = process.cwd()): string
⋮----
/**
 * Detect if the current process was launched via npx, pnpm dlx, or similar one-shot runners.
 */
function isNpxExecution(): boolean
⋮----
// npm/pnpm set npm_command=exec when running via npx/dlx
⋮----
/**
 * Check if skilld is listed as a dependency (dev or regular) in the project's package.json.
 */
function isSkilldDep(cwd: string): boolean
⋮----
export function getRepoHint(name: string, cwd: string): string | undefined
````

## File: src/cli.ts
````typescript
import type { PackageUsage } from './agent/detect-imports.ts'
import type { AgentType } from './agent/index.ts'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
⋮----
import { defineCommand, runMain } from 'citty'
import pLimit from 'p-limit'
import { join, resolve } from 'pathe'
import { agents, detectImportedPackages, detectInstalledAgents } from './agent/index.ts'
import { formatStatus, getRepoHint, guard, hasPrepareHook, isInteractive, isRunningInsideAgent, menuLoop, promptForAgent, relativeTime, resolveAgent, sharedArgs, suggestPrepareHook } from './cli-helpers.ts'
import { configCommand, configCommandDef } from './commands/config.ts'
import { removeCommand, removeCommandDef } from './commands/remove.ts'
import { infoCommandDef, statusCommand } from './commands/status.ts'
import { runWizard } from './commands/wizard.ts'
import { timedSpinner } from './core/formatting.ts'
import { getProjectState, hasCompletedWizard, isOutdated, readConfig, semverGt } from './core/index.ts'
import { readPackageJsonSafe } from './core/package-json.ts'
import { iterateSkills } from './core/skills.ts'
import { fetchLatestVersion, fetchNpmRegistryMeta } from './sources/index.ts'
⋮----
import { version } from './version.ts'
⋮----
function djb2(s: string): number
⋮----
function hueToChannel(p: number, q: number, t: number): number
⋮----
function hsl(h: number, s: number, l: number): [number, number, number]
⋮----
function noiseChar(brightness: number, density = 0): string
⋮----
function noiseLine(len: number, brightnessFn: (x: number) => number, density = 0): string
⋮----
function brandFrame(t: number, floor = 0, density = 0): string
⋮----
const brightness = (x: number, y: number) =>
⋮----
async function brandLoader<T>(work: () => Promise<T>, minMs = 1500): Promise<T>
⋮----
const sub = (raw: string)
⋮----
async run(
⋮----
// First-run guidance with agent-specific verification tips
⋮----
// Build a "try it" suggestion that tests skill-specific knowledge
⋮----
// Team advice: suggest prepare hook + lockfile
⋮----
// Has skills - show status + interactive menu
⋮----
const refreshState = async () =>
⋮----
// Main menu — Escape in sub-actions returns to menu via guard()
````

## File: src/index.ts
````typescript

````

## File: src/prepare.ts
````typescript
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { readLock } from './core/lockfile.ts'
import { getShippedSkills, linkShippedSkill, restorePkgSymlink } from './core/prepare.ts'
⋮----
function findSkillsDir(cwd: string): string | null
````

## File: src/telemetry.ts
````typescript
import { isCI } from 'std-env'
⋮----
interface InstallTelemetryData {
  event: 'install'
  source: string
  skills: string
  agents: string
  global?: '1'
  skillFiles?: string
  sourceType?: string
}
⋮----
interface RemoveTelemetryData {
  event: 'remove'
  source?: string
  skills: string
  agents: string
  global?: '1'
  sourceType?: string
}
⋮----
type TelemetryData
  = | InstallTelemetryData
    | RemoveTelemetryData
⋮----
function isEnabled(): boolean
⋮----
export function track(data: TelemetryData): void
````

## File: src/types.ts
````typescript

````

## File: src/version.ts
````typescript
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
⋮----
function findPackageJson(): string
````

## File: test/e2e/crosscheck-resolve.ts
````typescript
import type { ResolveAttempt } from '../../src/sources/types'
import pLimit from 'p-limit'
import { resolvePackageDocsWithAttempts } from '../../src/sources/npm'
import { isUselessDocsUrl } from '../../src/sources/utils'
import { TOP_PACKAGES } from './top-packages'
⋮----
export type ResolveTier = 'git-docs' | 'llms-txt' | 'readme' | 'no-docs' | 'error'
⋮----
export interface ResolveRow {
  name: string
  status: 'ok' | 'error'
  error?: string
  version: string | null
  repoUrl: string | null
  docsUrl: string | null
  gitDocsUrl: string | null
  gitRef: string | null
  gitDocsFiles: number
  llmsUrl: string | null
  readmeUrl: string | null
  tier: ResolveTier
  issues: string[]
}
⋮----
function parseGitDocsCount(attempts: ResolveAttempt[]): number
⋮----
function classifyTier(row: ResolveRow): ResolveTier
⋮----
function detectIssues(row: ResolveRow, attempts: ResolveAttempt[]): string[]
⋮----
async function collectRow(name: string): Promise<ResolveRow>
⋮----
export async function crosscheckResolve(packages: string[]): Promise<ResolveRow[]>
⋮----
function formatSummary(rows: ResolveRow[]): string
⋮----
function formatIssuesSummary(rows: ResolveRow[]): string
⋮----
function formatActionable(rows: ResolveRow[]): string
⋮----
export function formatTable(rows: ResolveRow[]): string
⋮----
const B = (v: string | null)
⋮----
const pad = (s: string, w: number)
⋮----
export function formatMarkdown(rows: ResolveRow[]): string
⋮----
const row = (cells: string[]) => `| $
⋮----
export function formatJson(rows: ResolveRow[]): string
⋮----
async function main()
````

## File: test/e2e/crosscheck.ts
````typescript
import type { PackageSpec } from './matrix'
import type { PipelineResult } from './pipeline'
import { existsSync } from 'node:fs'
import { getPackageDbPath, getShippedSkills } from '../../src/cache'
import { search } from '../../src/retriv'
import { PACKAGES } from './matrix'
import { parseFrontmatter, runPipeline } from './pipeline'
⋮----
export interface CrosscheckRow {
  name: string
  status: 'ok' | 'error'
  error?: string
  npm: boolean
  repo: boolean
  docsUrl: boolean
  gitDocs: boolean
  llmsTxt: boolean
  readme: boolean
  shipped: boolean
  docsType: string | null
  cachedDocs: number
  searchDb: boolean
  searchHits: number | null
  skillValid: boolean
  globs: string | null
  version: string | null
  releasedAt: string | null
}
⋮----
async function collectRow(spec: PackageSpec): Promise<CrosscheckRow>
⋮----
export async function crosscheck(packages: PackageSpec[] = PACKAGES): Promise<CrosscheckRow[]>
⋮----
const B = (v: boolean)
const N = (v: number | null)
⋮----
export function formatTable(rows: CrosscheckRow[]): string
⋮----
const pad = (s: string, w: number)
⋮----
export function formatMarkdown(rows: CrosscheckRow[]): string
⋮----
const row = (cells: string[]) => `| $
⋮----
export function formatJson(rows: CrosscheckRow[]): string
⋮----
async function main()
````

## File: test/e2e/matrix.ts
````typescript
export type Preset = 'nuxt' | 'next' | 'vue' | 'react' | 'svelte' | 'vite' | 'astro' | 'cross-framework' | 'general'
⋮----
export interface PackageSpec {
  name: string
  preset: Preset
  expectRepoUrl: string
  expectDocsUrl: string | null
  expectSources: {
    npm: true
    gitDocs: boolean
    llmsTxt: boolean
    readme: boolean
  }
  expectDocsType: 'docs' | 'llms.txt' | 'readme'
  expectCacheFiles: string[]
  minCacheDocs: number
  expectDescriptionContains: string
  searchQuery?: { query: string, minHits: number }
  expectShipped?: boolean
  expectShippedSkills?: string[]
}
````

## File: test/e2e/pipeline.ts
````typescript
import type { ResolveAttempt, ResolvedPackage } from '../../src/sources'
import { existsSync, readdirSync, statSync } from 'node:fs'
import pLimit from 'p-limit'
import { join } from 'pathe'
import { computeSkillDirName } from '../../src/agent'
import {
  ensureCacheDir,
  getCacheDir,
  getPackageDbPath,
  isCached,
  writeToCache,
} from '../../src/cache'
import { createIndexDirect } from '../../src/retriv'
import {
  downloadLlmsDocs,
  fetchGitDocs,
  fetchLlmsTxt,
  fetchReadmeContent,
  isShallowGitDocs,
  normalizeLlmsLinks,
  parseGitHubUrl,
  resolvePackageDocsWithAttempts,
} from '../../src/sources'
⋮----
export interface PipelineResult {
  resolved: ResolvedPackage
  attempts: ResolveAttempt[]
  version: string
  docsType: 'llms.txt' | 'readme' | 'docs'
  cachedDocsCount: number
  cachedFiles: string[]
  skillMd: string
}
⋮----
export function listDocFiles(dir: string): string[]
⋮----
function walk(d: string, prefix = '')
⋮----
export function parseFrontmatter(content: string): Record<string, string>
⋮----
// Serialize indexing: concurrent ONNX model loads cause silent failures
⋮----
/** Empty search.db (schema only, no docs) is exactly 61440 bytes */
export function hasValidSearchDb(dbPath: string): boolean
⋮----
// ── Pipeline ────────────────────────────────────────────────────────
⋮----
/**
 * Run the full sync pipeline for a package (minus LLM).
 * Uses real cache — idempotent across runs.
 */
export async function runPipeline(name: string): Promise<PipelineResult>
⋮----
// Consider cached if we have docs (not just changelogs)
// Cache valid when docs use normalized docs/ prefix or llms.txt-only.
// Stale caches (src/, packages/, www/ prefixes) need refetch.
⋮----
// Search index for cached docs was built during the original sync run.
// Don't rebuild here — too slow for large doc sets (nuxt 708, astro 394).
// Search tests use skip guards when no valid index exists.
⋮----
// Try git docs
⋮----
// Normalize paths same as sync-shared.ts: strip docsPrefix, ensure docs/ prefix
⋮----
// Shallow git-docs: if < threshold and llms.txt exists, discard and fall through
⋮----
// Always cache llms.txt alongside good git-docs as supplementary reference
⋮----
// Try llms.txt
⋮----
// Fallback README
⋮----
// Generate SKILL.md frontmatter (pure, same as sync command)
````

## File: test/e2e/preset-astro.test.ts
````typescript
import { describePreset } from './run-preset'
````

## File: test/e2e/preset-cross-framework.test.ts
````typescript
import { describePreset } from './run-preset'
````

## File: test/e2e/preset-general.test.ts
````typescript
import { describePreset } from './run-preset'
````

## File: test/e2e/preset-next.test.ts
````typescript
import { describePreset } from './run-preset'
````

## File: test/e2e/preset-nuxt.test.ts
````typescript
import { describePreset } from './run-preset'
````

## File: test/e2e/preset-react.test.ts
````typescript
import { describePreset } from './run-preset'
````

## File: test/e2e/preset-svelte.test.ts
````typescript
import { describePreset } from './run-preset'
````

## File: test/e2e/preset-vite.test.ts
````typescript
import { describePreset } from './run-preset'
````

## File: test/e2e/preset-vue.test.ts
````typescript
import { describePreset } from './run-preset'
````

## File: test/e2e/prompt-assemble.test.ts
````typescript
import { execFileSync } from 'node:child_process'
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'pathe'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
⋮----
function run(args: string[], cwd = WORK_DIR): string
⋮----
// ── assemble command ────────────────────────────────────────────
⋮----
// Copy SKILL.md from prompt output
⋮----
// Simulate pasting LLM output as _BEST_PRACTICES.md
⋮----
// Simulate _API_CHANGES.md
````

## File: test/e2e/run-preset.ts
````typescript
import type { Preset } from './matrix'
import type { PipelineResult } from './pipeline'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'pathe'
import { beforeAll, describe, expect, it } from 'vitest'
import { computeSkillDirName } from '../../src/agent'
import {
  ensureCacheDir,
  getCacheDir,
  getPackageDbPath,
  getShippedSkills,
} from '../../src/cache'
import { search } from '../../src/retriv'
import { PACKAGES } from './matrix'
import { hasValidSearchDb, parseFrontmatter, runPipeline } from './pipeline'
⋮----
function writeArtifact(preset: string, name: string, result: PipelineResult)
⋮----
function writeError(preset: string, name: string, error: Error)
⋮----
export function describePreset(presetName: Preset)
⋮----
function get(): PipelineResult
````

## File: test/e2e/sync.test.ts
````typescript
import type { PipelineResult } from './pipeline'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'pathe'
import { beforeAll, describe, expect, it } from 'vitest'
import { computeSkillDirName } from '../../src/agent'
import {
  ensureCacheDir,
  getCacheDir,
  getPackageDbPath,
  getShippedSkills,
} from '../../src/cache'
import { search } from '../../src/retriv'
import { PACKAGES } from './matrix'
import { hasValidSearchDb, parseFrontmatter, runPipeline } from './pipeline'
⋮----
function writeArtifact(name: string, result: PipelineResult)
⋮----
function get(): PipelineResult
````

## File: test/e2e/top-packages.ts
````typescript

````

## File: test/e2e-agents/generate-matrix.ts
````typescript
import type { OptimizeModel } from '../../src/agent/clis'
import type { AgentType } from '../../src/agent/types'
⋮----
export interface GenerateSpec {
  package: string
  generator: OptimizeModel
  targetAgent: AgentType
}
````

## File: test/e2e-agents/generate-pipeline.ts
````typescript
import type { OptimizeModel, SkillSection } from '../../src/agent/clis'
import type { AgentType } from '../../src/agent/types'
import type { PipelineResult } from '../e2e/pipeline'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { generateSkillMd, getModelLabel, optimizeDocs, sanitizeName } from '../../src/agent'
import { agents } from '../../src/agent/registry'
import {
  ensureCacheDir,
  getCacheDir,
  getPkgKeyFiles,
  hasShippedDocs,
  listReferenceFiles,
  resolvePkgDir,
} from '../../src/cache'
import { detectChangelog, linkAllReferences } from '../../src/commands/sync-shared'
import { runPipeline } from '../e2e/pipeline'
import { GENERATE_SECTIONS } from './generate-matrix'
⋮----
export interface GenerateResult {
  package: string
  generator: OptimizeModel
  sync: PipelineResult
  skillMd: string
  wasOptimized: boolean
  optimizedBody?: string
  usage?: { inputTokens: number, outputTokens: number, totalTokens: number }
  cost?: number
  error?: string
  warnings?: string[]
}
⋮----
export interface InstallResult {
  targetAgent: AgentType
  skillDir: string
  skillMdPath: string
  exists: boolean
}
⋮----
export function isGeneratorAvailable(model: OptimizeModel): boolean
⋮----
export async function ensureDocs(packageName: string): Promise<PipelineResult>
⋮----
export async function runGenerate(
  packageName: string,
  generator: OptimizeModel,
  syncResult: PipelineResult,
): Promise<GenerateResult>
⋮----
export function installToAgent(
  skillMd: string,
  packageName: string,
  targetAgent: AgentType,
  generator: OptimizeModel,
): InstallResult
⋮----
export function writeGenerateArtifact(result: GenerateResult): void
⋮----
export function writeInstallArtifact(
  result: GenerateResult,
  install: InstallResult,
): void
````

## File: test/e2e-agents/generate.test.ts
````typescript
import type { PipelineResult } from '../e2e/pipeline'
import type { GenerateResult, InstallResult } from './generate-pipeline'
import { readFileSync } from 'node:fs'
import { beforeAll, describe, expect, it } from 'vitest'
import { sanitizeName } from '../../src/agent'
import { agents } from '../../src/agent/registry'
import { parseFrontmatter } from '../e2e/pipeline'
import {
  GENERATOR_MODELS,
  TARGET_AGENTS,
  TEST_PACKAGES,
} from './generate-matrix'
import {
  ensureDocs,
  installToAgent,
  isGeneratorAvailable,
  runGenerate,
  writeGenerateArtifact,
  writeInstallArtifact,
} from './generate-pipeline'
````

## File: test/fixtures/detect-imports/src/app.ts
````typescript
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import something from './local-module'
````

## File: test/fixtures/detect-imports/src/builtins.ts
````typescript
import { AsyncLocalStorage } from 'node:async_hooks'
import { channel } from 'node:diagnostics_channel'
import { connect } from 'node:http2'
import { Session } from 'node:inspector'
import { describe, it } from 'node:test'
import { createTracing } from 'node:trace_events'
````

## File: test/fixtures/detect-imports/src/component.vue
````vue
<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
const title = computed(() => 'hello')
useHead({ title })
</script>
````

## File: test/fixtures/detect-imports/src/scoped.ts
````typescript
import { z } from '@hono/zod-validator'
import { Hono } from 'hono'
````

## File: test/fixtures/detect-imports/src/utils.mjs
````javascript

````

## File: test/fixtures/mock-skills-repo/skills/another-skill/SKILL.md
````markdown
---
name: another-skill
description: Second test skill
---

# Another Skill

Second mock skill.
````

## File: test/fixtures/mock-skills-repo/skills/test-skill/SKILL.md
````markdown
---
name: test-skill
description: A test skill for unit tests
---

# Test Skill

This is a mock skill for testing local path support.
````

## File: test/fixtures/no-nuxt/package.json
````json
{ "name": "no-nuxt-project" }
````

## File: test/fixtures/nuxt/nuxt.config.ts
````typescript
import { defineNuxtConfig } from 'nuxt/config'
````

## File: test/unit/agent-detect.test.ts
````typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { detectTargetAgent } from '../../src/agent/detect'
````

## File: test/unit/agent-install.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { sanitizeName } from '../../src/agent/install'
````

## File: test/unit/agent-registry.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { agents } from '../../src/agent/registry'
````

## File: test/unit/agent-skill.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { computeSkillDirName, generateSkillMd } from '../../src/agent'
````

## File: test/unit/author.test.ts
````typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
````

## File: test/unit/cache-clean.test.ts
````typescript
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cacheCleanCommand, cacheStatsCommand } from '../../src/commands/cache.ts'
````

## File: test/unit/cache-storage.test.ts
````typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
````

## File: test/unit/cache.test.ts
````typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getCacheKey, getVersionKey } from '../../src/cache'
````

## File: test/unit/clean-section-output.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { cleanSectionOutput } from '../../src/agent/clis/index'
⋮----
// 200+ chars of real content
````

## File: test/unit/cli-flags.test.ts
````typescript
import { parseArgs } from 'citty'
import { describe, expect, it } from 'vitest'
````

## File: test/unit/detect-imports.test.ts
````typescript
import { join } from 'pathe'
import { describe, expect, it } from 'vitest'
import { detectImportedPackages } from '../../src/agent/detect-imports'
````

## File: test/unit/detect-presets.test.ts
````typescript
import { parseSync } from 'oxc-parser'
import { join } from 'pathe'
import { describe, expect, it } from 'vitest'
import { detectNuxtModules, extractModuleStrings } from '../../src/agent/detect-presets'
⋮----
function parseModules(code: string): string[]
````

## File: test/unit/discussions.test.ts
````typescript
import type { GitHubDiscussion } from '../../src/sources/discussions'
import { describe, expect, it } from 'vitest'
import { scoreDiscussion } from '../../src/sources/discussions'
⋮----
function makeDiscussion(overrides: Partial<GitHubDiscussion> =
````

## File: test/unit/docs-index.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { generateDocsIndex } from '../../src/sources/docs.ts'
````

## File: test/unit/embedding-cache.test.ts
````typescript
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'pathe'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
⋮----
function fakeEmbeddingConfig(dims = 4, embedder?: (texts: string[]) => Promise<Float32Array[]>)
⋮----
const defaultEmbedder = async (texts: string[]) =>
````

## File: test/unit/git-skills.test.ts
````typescript
import { join } from 'pathe'
import { describe, expect, it } from 'vitest'
import { fetchGitSkills, parseGitSkillInput, parseSkillFrontmatterName } from '../../src/sources/git-skills'
````

## File: test/unit/github-common-api.test.ts
````typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
⋮----
// Re-import to reset _ghToken cache
⋮----
// Re-mock after resetModules
````

## File: test/unit/issues.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { classifyIssue, labelMatchesAny } from '../../src/sources/issues.ts'
````

## File: test/unit/list.test.ts
````typescript
import { describe, expect, it, vi } from 'vitest'
````

## File: test/unit/llms.test.ts
````typescript
import { describe, expect, it, vi } from 'vitest'
import { extractSections, isSafeUrl, normalizeLlmsLinks, parseMarkdownLinks } from '../../src/sources/llms'
````

## File: test/unit/lockfile.test.ts
````typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
````

## File: test/unit/markdown.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import {
  extractDescription,
  extractHeadings,
  extractLinks,
  extractTitle,
  parseFrontmatter,
  parseMd,
  stripFrontmatter,
} from '../../src/core/markdown.ts'
````

## File: test/unit/package-json.test.ts
````typescript
import { readFileSync, writeFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { appendToJsonArray, editJsonProperty, patchPackageJson, removeJsonProperty } from '../../src/core/package-json.ts'
````

## File: test/unit/portabilize-prompt.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { portabilizePrompt } from '../../src/agent/prompts/prompt'
````

## File: test/unit/prepare-hook.test.ts
````typescript
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { buildPrepareScript } from '../../src/cli-helpers.ts'
import { editJsonProperty } from '../../src/core/package-json.ts'
⋮----
function makeTempCwd(hasSkilld: boolean): string
⋮----
function simulateNpx()
⋮----
function clearNpxEnv()
````

## File: test/unit/prepare-restore.test.ts
````typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
````

## File: test/unit/releases.test.ts
````typescript
import type { GitHubRelease } from '../../src/sources/releases'
import { describe, expect, it } from 'vitest'
import { generateReleaseIndex, isChangelogRedirectPattern, isPrerelease, isStubRelease, selectReleases } from '../../src/sources/releases'
⋮----
function makeRelease(tag: string, markdown: string, prerelease = false): GitHubRelease
⋮----
// Empty body doesn't mention changelog
````

## File: test/unit/sanitize.test.ts
````typescript
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'pathe'
import { describe, expect, it } from 'vitest'
import { processOutsideCodeBlocks, repairMarkdown, sanitizeMarkdown } from '../../src/core/sanitize'
⋮----
// Nested parens leave a trailing ) — the dangerous part is still defanged
⋮----
// Layer 7: Directive lines
⋮----
// Code block closed before emoji, orphaned ``` removed as empty block
⋮----
// Should not have an empty code block
⋮----
// The ```md should start a new properly-closed code block
⋮----
// Both code blocks should be closed
⋮----
expect(backtickOnly).toBe(2) // auto-close + explicit close
⋮----
// Should appear only once
⋮----
// Text between resets dedup, so both should survive
````

## File: test/unit/search.test.ts
````typescript
import type { SearchSnippet } from '../../src/retriv/types'
import { describe, expect, it } from 'vitest'
import { generateSearchGuide, parseFilterPrefix, parseJsonFilter } from '../../src/commands/search'
import { normalizeScores, scoreLabel } from '../../src/core/formatting'
⋮----
function snippet(overrides: Partial<SearchSnippet> =
````

## File: test/unit/shared.test.ts
````typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
````

## File: test/unit/skills.test.ts
````typescript
import type { SkillEntry } from '../../src/core/skills.ts'
import { describe, expect, it } from 'vitest'
import { isOutdated } from '../../src/core/skills.ts'
⋮----
function makeSkill(version: string | undefined): SkillEntry
````

## File: test/unit/sources-github.test.ts
````typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
⋮----
function createMockFetch()
⋮----
async function $fetch(url: string, opts?: any): Promise<any>
````

## File: test/unit/sources-npm.test.ts
````typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
⋮----
function createMockFetch()
⋮----
async function $fetch(url: string, opts?: any): Promise<any>
````

## File: test/unit/sources-utils-auth.test.ts
````typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
````

## File: test/unit/sources-utils.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { isGitHubRepoUrl, normalizeRepoUrl, parseGitHubUrl, parsePackageSpec } from '../../src/sources/utils'
````

## File: test/unit/sync-shared.test.ts
````typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
````

## File: test/unit/validate-section.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { getSectionValidator } from '../../src/agent/prompts/prompt'
````

## File: test/unit/version-resolution.test.ts
````typescript
import type { SkillEntry } from '../../src/core/skills.ts'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isOutdated } from '../../src/core/skills.ts'
⋮----
function createMockFetch()
⋮----
async function $fetch(url: string, opts?: any): Promise<any>
⋮----
function makeSkill(version: string | undefined): SkillEntry
````

## File: test/unit/yaml.test.ts
````typescript
import { describe, expect, it } from 'vitest'
import { yamlEscape, yamlParseKV, yamlUnescape } from '../../src/core/yaml'
````

## File: .editorconfig
````
root = true

[*]
indent_size = 2
indent_style = space
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
````

## File: .gitignore
````
node_modules
dist
.DS_Store
*.log
.idea
.vscode
*.local
.nuxt
.output
coverage

# Local
.env
.env.*
!.env.example

.retriv
.skilld-temp
# Skilld references symlinks (recreated by `skilld install`)
.claude/skills/*/references

# Skilld references (recreated by `skilld install`)
.skilld

# E2E test artifacts
.artifacts
````

## File: .npmrc
````
shamefully-hoist=true
strict-peer-dependencies=false
ignore-workspace-root-check=true
````

## File: build.config.ts
````typescript
import { defineBuildConfig } from 'obuild/config'
````

## File: CLAUDE.md
````markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm build          # Build with obuild
pnpm dev:prepare    # Stub for development (obuild --stub)
pnpm typecheck      # TypeScript check (tsc --noEmit)
pnpm lint           # ESLint (@antfu/eslint-config)
pnpm lint:fix       # ESLint with auto-fix
pnpm test           # Run vitest in watch mode
pnpm test:run       # Run vitest once (CI-style)
pnpm test -- test/unit/cache.test.ts     # Single test file
pnpm test -- --project unit              # Unit tests only
pnpm test -- --project e2e               # E2E tests only
```

### CLI Commands

```bash
skilld                # Interactive menu
skilld add vue nuxt   # Add skills for packages
skilld update         # Update all outdated skills
skilld update vue     # Update specific package
skilld remove         # Remove installed skills
skilld list           # List installed skills (one per line)
skilld list --json    # List as JSON
skilld info           # Show config, agents, features, per-package detail
skilld config         # Change settings
skilld install        # Restore references from lockfile
skilld prepare        # Hook for package.json "prepare" (restore refs, sync shipped, report outdated)
skilld uninstall      # Remove skilld data
skilld search "query" # Search indexed docs
skilld search "query" -p nuxt  # Search filtered by package
skilld cache --clean     # Clean expired LLM cache entries
skilld cache --stats     # Show cache disk usage breakdown
skilld add owner/repo    # Add pre-authored skills from git repo
skilld eject vue                    # Eject skill (portable, no symlinks)
skilld eject vue --name vue         # Eject with custom skill dir name
skilld eject vue --out ./dir/       # Eject to custom path
skilld eject vue --from 2025-07-01  # Only releases/issues since date
skilld author                       # Generate skill for npm publishing (monorepo-aware)
skilld author -m haiku              # Author with specific LLM model
skilld author -o ./custom/          # Author to custom output directory
```

## Architecture

CLI tool that generates AI agent skills from NPM package documentation. Requires Node >= 22.6.0. Flow: `package name → resolve docs → cache references → generate SKILL.md → install to agent dirs`.

**Key directories:**
- `~/.skilld/` - Global cache: `references/<pkg>@<version>/`, `llm-cache/`, `config.yaml`
- `.claude/skills/<pkg>/SKILL.md` - Generated skill files (project-level)
- `src/commands/` - CLI subcommands routed via citty `subCommands` in cli.ts
- `src/agent/` - Agent registry, detection, LLM spawning, skill generation
  - `clis/` - LLM CLI integrations (claude, codex, gemini)
  - `prompts/` - Skill generation prompt templates; `optional/` for toggleable sections (api-changes, best-practices, types, etc.)
  - `targets/` - Per-agent target definitions
- `src/sources/` - Doc fetching (npm registry, llms.txt, GitHub via ungh.cc)
- `src/cache/` - Reference caching with symlinks to `~/.skilld/references/`
- `src/retriv/` - Vector search with sqlite-vec + @huggingface/transformers embeddings
- `src/core/` - Config (custom YAML parser), skills iteration, formatting, lockfile

**Doc resolution cascade (src/commands/sync.ts):**
1. Package ships `skills/` directory → symlink directly (skills-npm convention)
2. Git-hosted versioned docs → fetch from GitHub tags via ungh.cc
3. Registry `crawlUrl` → crawl specific URL pattern via `@mdream/crawl` (e.g. motion-v)
4. `llms.txt` at package homepage → parse and download linked .md files
5. Website crawl → crawl `docsUrl/**` via sitemap when no docs found above
6. GitHub README via ungh proxy → fallback

Resolution tracked via `ResolveAttempt[]` array for debugging failures. Blog release posts (curated in `src/sources/blog-presets.ts`) supplement docs for major version announcements.

**Git skills (`src/sources/git-skills.ts`, `src/commands/sync-git.ts`):**
Installs pre-authored skills from git repos. Accepts `owner/repo`, full URLs, SSH, or local paths. Clones/pulls into `~/.skilld/git-skills/`, copies `skills/` directory contents. Part of skills-npm ecosystem compatibility.

**LLM integration (NO AI SDK):**
Spawns CLI processes directly (`claude`, `gemini`) with `--add-dir` for references. Custom stream-json parsing for progress. Results cached at `~/.skilld/llm-cache/<sha256>.json` with 7-day TTL.

**Agent detection (`src/agent/detect.ts`):**
Checks env vars (`CLAUDE_CODE`, `CURSOR_SESSION`) and project dirs (`.claude/`, `.cursor/`) to auto-detect target. Registry in `src/agent/registry.ts` defines per-agent skill dirs and detection. Supports 11 agents: claude-code, cursor, windsurf, cline, codex, github-copilot, gemini-cli, goose, amp, opencode, roo.

**Import scanning (`src/agent/detect-imports.ts`):**
AST-based import detection via oxc-parser. `FILE_PATTERN_MAP` in `src/agent/types.ts` maps ~98 packages to file glob patterns (e.g., `vue` → `*.vue`) for efficient scanning. `detect-presets.ts` handles framework-specific package discovery (e.g., Nuxt modules).

**Cache structure:**
```
~/.skilld/references/<pkg>@<version>/
  docs/          # Fetched external docs
  issues/        # Individual issue files (issue-123.md)
  discussions/   # Individual discussion files (discussion-42.md)
  pkg/           # Symlink → node_modules/<pkg>
```
References are global/static; SKILL.md is per-project (different conventions). Cache key is exact `name@version`. Symlinks are created in `.claude/skills/<pkg>/.skilld/` (gitignored, recreated by `skilld install`).

## Conventions

- **Functional only** — no classes, pure functions throughout
- **Custom YAML** — `src/core/yaml.ts` hand-rolled parser (no yaml library). `yamlEscape()` double-quotes values with special chars, `yamlParseKV()` splits on first colon. Used for config.yaml and skilld-lock.yaml
- **Markdown sanitization** — `src/core/sanitize.ts` strips prompt injection vectors (zero-width chars, HTML comments, agent directive tags, external images/links, base64 blobs, directive patterns). Code-fence-aware via state machine
- **Let errors propagate** — fetch errors return `null`, resolution tracks attempts in `ResolveAttempt[]`
- **Parallelization** — `p-limit` for concurrency, batch downloads (20 at a time), `sync-parallel.ts` for multi-package
- **Package registry** — `src/sources/package-registry.ts` unified registry keyed by `owner/repo`, consolidates doc overrides, blog presets, and file patterns for packages with broken/missing npm metadata
- **Version comparison** — `isOutdated()` compares exact versions
- **Tests** — vitest projects (unit + e2e), `globals: true`, tests in `test/unit/` and `test/e2e/`, fs mocked via `vi.mock('node:fs')`. E2E tests include preset workflows (nuxt, vue, react, svelte, etc.) in `test/e2e/preset-*.test.ts`
- **Build** — `obuild` bundles multiple entry points (cli, index, types, cache, retriv, agent, sources) as subpath exports
- **CLI modes** — `skilld update -b` for pnpm prepare hooks (background, non-interactive, auto-uses configured model). `skilld eject` exports portable skills with references as real files. `--debug` saves raw LLM output to `logs/`
- **First-run wizard** — `src/commands/wizard.ts` handles agent/model config and package selection on first run
- **E2E agent tests** — `test/e2e-agents/` validates skill generation across multiple agents via `generate-matrix.ts` and `generate-pipeline.ts`

<!-- skilld -->
Before modifying code, evaluate each installed skill against the current task.
For each skill, determine YES/NO relevance and invoke all YES skills before proceeding.
<!-- /skilld -->
````

## File: eslint.config.mjs
````javascript

````

## File: LICENSE
````
MIT License

Copyright (c) 2026-present Harlan Wilton

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: package.json
````json
{
  "name": "skilld",
  "type": "module",
  "version": "1.6.0",
  "packageManager": "pnpm@10.33.0",
  "description": "Generate AI agent skills from npm package documentation",
  "author": {
    "name": "Harlan Wilton",
    "email": "harlan@harlanzw.com",
    "url": "https://harlanzw.com/"
  },
  "contributors": [
    {
      "name": "Ori",
      "url": "https://github.com/oritwoen"
    }
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/harlan-zw/skilld"
  },
  "keywords": [
    "ai",
    "agent",
    "skills",
    "npm",
    "documentation",
    "claude",
    "llm",
    "cursor",
    "codex"
  ],
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs"
    }
  },
  "main": "./dist/index.mjs",
  "types": "./dist/index.d.mts",
  "bin": {
    "skilld": "./dist/cli-entry.mjs"
  },
  "files": [
    "dist",
    "skills"
  ],
  "engines": {
    "node": ">=22.6.0"
  },
  "scripts": {
    "build": "obuild",
    "dev:prepare": "obuild --stub",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "release": "pnpm build && bumpp -x \"npx changelogen --output=CHANGELOG.md\"",
    "prepack": "pnpm run build",
    "prepare": "test -z \"$CI\" && skilld prepare || true"
  },
  "dependencies": {
    "@clack/prompts": "catalog:deps",
    "@huggingface/transformers": "catalog:deps",
    "@mariozechner/pi-ai": "catalog:",
    "@mdream/crawl": "catalog:",
    "citty": "catalog:deps",
    "consola": "catalog:deps",
    "giget": "catalog:",
    "jsonc-parser": "catalog:",
    "log-update": "catalog:deps",
    "mdast-util-from-markdown": "catalog:deps",
    "mdast-util-frontmatter": "catalog:deps",
    "mdast-util-to-string": "catalog:deps",
    "mdream": "catalog:",
    "micromark-extension-frontmatter": "catalog:deps",
    "mlly": "catalog:deps",
    "ofetch": "catalog:",
    "oxc-parser": "catalog:deps",
    "p-limit": "catalog:deps",
    "pathe": "catalog:",
    "retriv": "catalog:",
    "semver": "catalog:",
    "sqlite-vec": "catalog:deps",
    "std-env": "catalog:",
    "tinyglobby": "catalog:deps",
    "typescript": "catalog:",
    "unagent": "catalog:",
    "unist-util-visit": "catalog:deps"
  },
  "devDependencies": {
    "@antfu/eslint-config": "catalog:dev-lint",
    "@types/node": "catalog:dev-build",
    "@types/semver": "catalog:",
    "@vitest/coverage-v8": "catalog:dev-test",
    "bumpp": "catalog:",
    "evalite": "catalog:dev-test",
    "obuild": "catalog:dev-build",
    "tsx": "catalog:",
    "vitest": "catalog:dev-test"
  }
}
````

## File: pnpm-workspace.yaml
````yaml
catalogMode: prefer
shellEmulator: true
trustPolicy: no-downgrade
packages:
  - playground
overrides:
  global-agent: ^4.1.3
catalog:
  '@mariozechner/pi-ai': ^0.63.1
  '@mdream/crawl': ^1.0.3
  '@types/semver': ^7.7.1
  bumpp: ^11.0.1
  giget: ^3.2.0
  jsonc-parser: ^3.3.1
  mdream: ^1.0.3
  ofetch: ^1.5.1
  pathe: ^2.0.3
  retriv: ^0.13.0
  semver: ^7.7.4
  std-env: ^4.0.0
  tsx: ^4.21.0
  typescript: 6.0.2
  unagent: ^0.0.8
catalogs:
  deps:
    '@clack/prompts': ^1.1.0
    '@huggingface/transformers': ^3.8.1
    citty: ^0.2.1
    consola: ^3.4.2
    log-update: ^7.2.0
    mdast-util-from-markdown: ^2.0.3
    mdast-util-frontmatter: ^2.0.1
    mdast-util-to-string: ^4.0.0
    micromark-extension-frontmatter: ^2.0.0
    mlly: ^1.8.2
    oxc-parser: ^0.121.0
    p-limit: ^7.3.0
    sqlite-vec: ^0.1.7
    tinyglobby: ^0.2.15
    unist-util-visit: ^5.1.0
  dev-build:
    '@types/node': ^25.5.0
    obuild: ^0.4.32
  dev-lint:
    '@antfu/eslint-config': ^7.7.3
  dev-test:
    '@vitest/coverage-v8': ^4.1.2
    evalite: ^0.19.0
    vitest: ^4.1.2
onlyBuiltDependencies:
  - esbuild
````

## File: README.md
````markdown
<h1>skilld</h1>

[![npm version](https://img.shields.io/npm/v/skilld?color=yellow)](https://npmjs.com/package/skilld)
[![npm downloads](https://img.shields.io/npm/dm/skilld?color=yellow)](https://npm.chart.dev/skilld)
[![license](https://img.shields.io/npm/l/skilld?color=yellow)](https://github.com/harlan-zw/skilld/blob/main/LICENSE)

> Generate AI agent skills from your NPM dependencies.

## Why?

When using new packages or migrating to new versions, agents often struggle to use the appropriate best practices. This is because
agents have [knowledge cutoffs](https://platform.claude.com/docs/en/about-claude/models/overview#latest-models-comparison) and
predict based on existing patterns.

Methods of getting the right context to your agent require either manual curation, author opt-in, external servers or vendor lock-in. See [the landscape](#the-landscape)
for more details.

Skilld generates [agent skills](https://agentskills.io/home) from the references maintainers already create: docs, release notes and GitHub issues. With these we can create version-aware, local-first, and optimized skills.

<p align="center">
<table>
<tbody>
<td align="center">
<sub>Made possible by my <a href="https://github.com/sponsors/harlan-zw">Sponsor Program 💖</a><br> Follow me <a href="https://twitter.com/harlan_zw">@harlan_zw</a> 🐦 - Join <a href="https://discord.gg/275MBUBvgP">Discord</a> for help</sub><br>
</td>
</tbody>
</table>
</p>

## Features

- 🌍 **Any Source: Opt-in** - Any NPM dependency or GitHub source, docs auto-resolved
- 📦 **Bleeding Edge Context** - Latest issues, discussions, and releases. Always use the latest best practices and avoid deprecated patterns.
- 📚 **Opt-in LLM Sections** - Enhance skills with LLM-generated `Best Practices`, `API Changes`, or your own custom prompts
- 🧩 **Use Any Agent** - Choose your agent: CLI , [pi](https://github.com/badlogic/pi-mono/tree/main/packages/ai) agents or no agent at all.
- 🔍 **Semantic Search** - Query indexed docs across all skills via [retriv](https://github.com/harlan-zw/retriv) embeddings
- 🧠 **Context-Aware** - Follows [Claude Code skill best practices](https://code.claude.com/docs/en/skills#add-supporting-files): SKILL.md stays under 500 lines, references are separate files the agent discovers on-demand - not inlined into context
- 🎯 **Safe & Versioned** - Prompt injection sanitization, version-aware caching, auto-updates on new releases
- 🤝 **Ecosystem** - Compatible with [`npx skills`](https://skills.sh/) and [skills-npm](https://github.com/antfu/skills-npm). Skilld auto-detects and uses skills-npm packages when available.

## Quick Start

Run skilld in a project to generate skills for your dependencies through a simple interactive wizard:

```bash
npx -y skilld
```

__Requires Node 22.6.0 or higher.__

Or add a specific package directly:

```bash
npx -y skilld add vue
```

If you need to re-configure skilld, just run `npx -y skilld config` to update your agent, model, or preferences.

**No agent CLI?** No problem - choose "No agent" when prompted. You get a base skill immediately, plus portable prompts you can run in any LLM:

```bash
npx -y skilld add vue
# Choose "No agent" -> base skill + prompts exported
# Paste prompts into ChatGPT/Claude web, save outputs, then:
npx -y skilld assemble
```

### Tips

- **Be selective** - Only add skills for packages your agent struggles with. Not every dependency needs one.
- **LLM is optional** - Skills work without any LLM, but enhancing with one makes them significantly better.
- **Multi-agent** - Run `skilld install --agent gemini-cli` to sync skills to another agent. The doc cache is shared.

## Installation

### Global

Install globally to use `skilld` across all projects without `npx`:

```bash
npm install -g skilld
# or
pnpm add -g skilld
```

Then run `skilld` in any project directory.

### Per-Project

If you'd like to install skilld and track the lock file references, add it as a dev dependency:

```bash
npm install -D skilld
# or
yarn add -D skilld
# or
pnpm add -D skilld
```

### Automatic Updates

Add to `package.json` to restore references and sync shipped skills on install:

```json
{
  "scripts": {
    "prepare": "skilld prepare"
  }
}
```

This restores symlinks, auto-installs shipped skills from your deps, and notifies you when packages have new features or breaking changes. Run `skilld update` to regenerate LLM enhancements.

## FAQ

### Why don't the skills run?

Try this in your project/user prompt:

```md
Before modifying code, evaluate each installed skill against the current task.
For each skill, determine YES/NO relevance and invoke all YES skills before proceeding.
```

### How is this different from Context7?

Context7 is an MCP that fetches raw doc chunks at query time. You get different results each prompt, no curation, and it requires their server. Skilld is local-first: it generates a SKILL.md that lives in your project, tied to your actual package versions. No MCP dependency, no per-prompt latency, and it goes further with LLM-enhanced sections, prompt injection sanitization, and semantic search.

### Will I be prompt injected?

Skilld pulls issues from GitHub which could be abused for potential prompt injection.

Skilld treats all data as untrusted, running in permissioned environments and using best practices to avoid injections.
However, always be cautious when using skills from untrusted sources.

### Do skills update when my deps update?

Yes. Add `skilld prepare` to your prepare script. It restores references, auto-installs shipped skills, and tells you when packages are outdated. Run `skilld update` to regenerate LLM enhancements.

## CLI Usage

```bash
# Interactive mode - auto-discover from package.json
skilld

# Add skills for specific package(s)
skilld add vue nuxt pinia

# Update outdated skills
skilld update
skilld update tailwindcss

# Search docs across installed skills
skilld search "useFetch options" -p nuxt
skilld search "error" -p nuxt --filter '{"type":"issue"}'
skilld search --guide -p nuxt

# Target a specific agent
skilld add react --agent cursor

# Install globally to ~/.claude/skills
skilld add zod --global

# Skip prompts
skilld add drizzle-orm --yes

# Check skill info
skilld info

# List installed skills
skilld list
skilld list --json

# Manage settings
skilld config
```

### Commands

| Command | Description |
|---------|-------------|
| `skilld` | Interactive wizard (first run) or status menu (existing skills) |
| `skilld add <pkg...>` | Add skills for package(s), space or comma-separated |
| `skilld update [pkg]` | Update outdated skills (all or specific) |
| `skilld search [query]` | Search indexed docs (`-p` package, `--filter` JSON, `--limit`, `--guide`) |
| `skilld list`           | List installed skills (`--json` for machine-readable output) |
| `skilld info`           | Show skill info and config |
| `skilld config`         | Configure agent, model, preferences |
| `skilld install`        | Restore references from lockfile |
| `skilld remove`         | Remove installed skills |
| `skilld uninstall`      | Remove all skilld data |
| `skilld cache`          | Cache management (clean expired LLM cache entries) |
| `skilld eject <pkg>`    | Eject skill as portable directory (no symlinks) |
| `skilld assemble [dir]` | Merge LLM output files back into SKILL.md (auto-discovers) |

### Works Without an Agent CLI

No Claude, Gemini, or Codex CLI? Choose "No agent" when prompted. You get a base skill immediately, plus portable prompts you can run in any LLM to enhance it:

```bash
skilld add vue
# Choose "No agent" -> installs to .claude/skills/vue-skilld/

# What you get:
#   SKILL.md           <- base skill (works immediately)
#   PROMPT_*.md        <- prompts to enhance it with any LLM
#   references/        <- docs, issues, releases as real files

# Run each PROMPT_*.md in ChatGPT/Claude web/any LLM
# Save outputs as _BEST_PRACTICES.md, _API_CHANGES.md, then:
skilld assemble
```

`skilld assemble` auto-discovers skills with pending output files. `skilld update` re-exports prompts for outdated packages.

### Eject

Export a skill as a portable, self-contained directory for sharing via git repos:

```bash
skilld eject vue                    # Default skill directory
skilld eject vue --name vue         # Custom directory name
skilld eject vue --out ./skills/    # Custom path
skilld eject vue --from 2025-07-01  # Only recent releases/issues
```

Share via `skilld add owner/repo` - consumers get fully functional skills with no LLM cost.

### CLI Options

| Option | Alias | Default | Description |
|--------|-------|---------|-------------|
| `--global` | `-g` | `false` | Install globally to `~/<agent>/skills` |
| `--agent` | `-a` | auto-detect | Target specific agent (claude-code, cursor, etc.) |
| `--yes` | `-y` | `false` | Skip prompts, use defaults |
| `--force` | `-f` | `false` | Ignore all caches, re-fetch docs and regenerate |
| `--model`      | `-m` | config default | LLM model for skill generation (sonnet, haiku, opus, etc.) |
| `--name`       | `-n` |                | Custom skill directory name (eject only) |
| `--out`        | `-o` |                | Output directory path override (eject only) |
| `--from`       |      |                | Collect releases/issues/discussions from this date (YYYY-MM-DD, eject only) |
| `--debug`      |      | `false`        | Save raw LLM output to logs/ for each section |

## For Maintainers

Ship skills with your npm package so consumers get them automatically. No LLM needed on their end.

### Generate a skill

From your package root (or monorepo root):

```bash
npx skilld author
```

In a monorepo, skilld auto-detects workspaces and prompts which packages to generate for. Docs are resolved from: package `docs/`, monorepo `docs/content/`, `llms.txt`, or `README.md`.

This creates a `skills/<your-package>/` directory with a `SKILL.md` and ejected reference files. It also adds `"skills"` to your `package.json` `files` array.

### How consumers get it

Once published, consumers run:

```bash
npx skilld prepare
```

Or add it to their `package.json` so it runs on every install:

```json
{
  "scripts": {
    "prepare": "skilld prepare"
  }
}
```

`skilld prepare` auto-detects shipped skills in `node_modules` and symlinks them into the agent's skill directory. Compatible with [skills-npm](https://github.com/antfu/skills-npm).

### Options

| Flag      | Alias | Default | Description |
|:----------|:-----:|:-------:|:------------|
| `--model` | `-m`  |         | LLM model for enhancement |
| `--out`   | `-o`  |         | Output directory (single package only) |
| `--force` | `-f`  | `false` | Clear cache and regenerate |
| `--yes`   | `-y`  | `false` | Skip prompts, use defaults |
| `--debug` |       | `false` | Save raw LLM output to logs/ |

## The Landscape

Several approaches exist for steering agent knowledge. Each fills a different niche:

| Approach | Versioned | Curated | No Opt-in | Local | Any LLM |
|:---------|:---------:|:-------:|:---------:|:-----:|:-------:|
| **Manual rules** | - | yes | yes | yes | yes |
| **llms.txt** | ~ | - | - | - | yes |
| **MCP servers** | yes | - | - | - | - |
| **skills.sh** | - | ~ | yes | - | - |
| **skills-npm** | yes | yes | - | yes | - |
| **skilld** | yes | yes | yes | yes | yes |

> **Versioned** - tied to your installed package version. **Curated** - distilled best practices, not raw docs. **No Opt-in** - works without the package author doing anything. **Local** - runs on your machine, no external service dependency. **Any LLM** - works with any LLM, not just agent CLIs.

- **Manual rules** (CLAUDE.md, .cursorrules): full control, but you need to already know the best practices and maintain them across every dep.
- **[llms.txt](https://llmstxt.org/)**: standard convention for exposing docs to LLMs, but it's full docs not curated guidance and requires author adoption.
- **MCP servers** (Context7, etc.): live, version-aware responses, but adds per-request latency and the maintainer has to build and maintain a server.
- **[skills.sh](https://skills.sh/)**: easy skill sharing with a growing ecosystem, but community-sourced without version-awareness or author oversight.
- **[skills-npm](https://github.com/antfu/skills-npm)**: the ideal end-state: zero-token skills shipped by the package author, but requires every maintainer to opt in. Skilld auto-detects and uses skills-npm packages when available.
- **skilld**: generates version-aware skills from existing docs, changelogs, issues, and discussions. Works for any package without author opt-in.

## Telemetry

Skilld sends anonymous install events to [skills.sh](https://skills.sh/) so skills can be discovered and ranked. No personal information is collected.

Telemetry is automatically disabled in CI environments.

To opt out, set either environment variable:

```bash
DISABLE_TELEMETRY=1
DO_NOT_TRACK=1
```

## Related

- [skills-npm](https://github.com/antfu/skills-npm) - Convention for shipping agent skills in npm packages
- [agentskills.io](https://agentskills.io) - Agent skills specification
- [mdream](https://github.com/harlan-zw/mdream) - HTML to Markdown converter
- [retriv](https://github.com/harlan-zw/retriv) - Vector search with sqlite-vec

## License

Licensed under the [MIT license](https://github.com/harlan-zw/skilld/blob/main/LICENSE).
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ESNext",
    "moduleDetection": "force",
    "rootDir": "src",
    "module": "Preserve",
    "moduleResolution": "bundler",
    "types": ["node"],
    "allowImportingTsExtensions": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUncheckedSideEffectImports": true,
    "declaration": true,
    "declarationMap": true,
    "noEmit": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
````

## File: vitest.config.ts
````typescript
import { defineConfig } from 'vitest/config'
````
