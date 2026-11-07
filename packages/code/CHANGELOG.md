# @niceprototypes/code

## 1.0.0

### Major Changes

- 92f9032: Removes the getCodeToken export; margin now defaults to none and fit to false. Adds a children live demo, maxHeight collapse with a drag bar, a copy icon and keyboard-focusable inline copy chips, the codeLanguages and copyToClipboard exports, and a named Code export.

### Patch Changes

- Updated dependencies [92f9032]
- Updated dependencies [92f9032]
- Updated dependencies [92f9032]
- Updated dependencies [92f9032]
- Updated dependencies [9e37bef]
- Updated dependencies [92f9032]
  - @niceprototypes/icon@9.0.0
  - @niceprototypes/ink@9.0.0
  - @niceprototypes/scroll@3.0.0
  - @niceprototypes/styles@18.0.0
  - @niceprototypes/tooltip@0.2.0

## 0.2.0

### Minor Changes

- 3547207: Add @niceprototypes/chat: ChatLog (a `<Scroll follow>` log, `aria-busy` while streaming, a "Scroll to latest" button while not at the end), ChatMessage (user bubble or full-width assistant reply, an actions row on hover, focus within and the last message), ChatComposer (send on Enter, stop on the stop button or Escape while busy, `maxRows`), ChatSuggestions and ChatCopyAction; its `chat.*` component tokens in styles; its re-export from @niceprototypes/ux. Code exports its `copyToClipboard` service.
- 20fc3f3: Code: the horizontal scroll of a card block is a Scroll, so it follows the project's scrollbar default.

### Patch Changes

- b35f5fa: Add @niceprototypes/contents (Contents: an in-page table of contents with a sticky heading, nested section links, scroll-spy and smooth scroll), its `contents.*` component tokens in styles, and its re-export from @niceprototypes/ux. Code reads its card max-width from the new `code.maxWidth` token (720px, unchanged). Icon hides its wrapper from assistive technology, so an inline SVG's `<style>` text no longer joins the accessible name of the control around it.
