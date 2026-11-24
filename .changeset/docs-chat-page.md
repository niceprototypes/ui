---
"@niceprototypes/docs": minor
---

Chat's parts (ChatComposer, ChatCopyAction, ChatMessage, ChatSuggestions, ChatThinking, ChatToolCall) are sections of one Chat page (ChatLog's page, named Chat) instead of pages of their own, with every prop and example kept; old `/docs/components/chat/{part}` addresses and `components-chat-*` ids open the Chat page at the part's section. A conversation demo on it: send a message, the assistant thinks (ChatThinking), then replies with one of a few fixed answers. A catalog entry can carry a page `title`; subcomponents' examples that are not one prop show as subsections of their section.
