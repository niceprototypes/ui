// ChatSuggestions example configs: one ComponentExample per facet, keyed by prop name. Every preview is
// live: pick a suggestion and the item it reports shows under it.
import { useState } from "react"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import { ChatSuggestions } from "@niceprototypes/chat"
import type { ChatSuggestionsItemsType } from "@niceprototypes/chat"
import type { ComponentExample } from "../../dataTables/components/demos/Components"
import { chatWidth } from "../Chat/samples"

/** The `items` variants. */
const ITEMS: Record<string, ChatSuggestionsItemsType> = {
  three: [
    { id: "stiff", label: "Why does the slide feel stiff?" },
    { id: "fade", label: "Add a fade" },
    { id: "spring", label: "Try a spring curve" },
  ],
  one: [{ id: "explain", label: "Explain this scene" }],
}

/** Suggestions that report the picked item. */
const DemoSuggestions = ({ items }: { items: ChatSuggestionsItemsType }) => {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <Flex direction="column" gap="small" style={chatWidth}>
      <ChatSuggestions items={items} onPick={item => setPicked(item.id)} />
      <Ink code>{picked === null ? "–" : `onPick({ id: "${picked}", … })`}</Ink>
    </Flex>
  )
}

const itemsCode = (items: ChatSuggestionsItemsType) => `const suggestions = [
${items.map(item => `  { id: "${item.id}", label: "${item.label}" },`).join("\n")}
]

<ChatSuggestions items={suggestions} onPick={item => send(item.label)} />`

export const chatSuggestionsItems = {
  name: "items",
  description: "The suggestions, in order: each a stable id and the label its rounded button shows. The buttons wrap onto new lines.",
  variants: Object.keys(ITEMS),
  default: "three",
  preview: (variant: string) => <DemoSuggestions items={ITEMS[variant]} />,
  code: (variant: string) => itemsCode(ITEMS[variant]),
} satisfies ComponentExample

export const chatSuggestionsOnPick = {
  name: "onPick",
  description: "Called with the picked suggestion, the whole item; send its label or act on its id.",
  variants: ["handler"],
  default: "handler",
  preview: () => <DemoSuggestions items={ITEMS.three} />,
  code: () => `<ChatSuggestions items={suggestions} onPick={item => send(item.label)} />`,
} satisfies ComponentExample

/** Every ChatSuggestions example facet, each one a section of the ChatSuggestions docs page. */
export const chatSuggestionsExamples = {
  items: chatSuggestionsItems,
  onPick: chatSuggestionsOnPick,
} satisfies Record<string, ComponentExample>
