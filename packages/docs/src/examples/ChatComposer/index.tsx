// ChatComposer example configs: one ComponentExample per facet, keyed by prop name. Every preview is a
// live composer: type, press Enter to send, Shift+Enter for a new line.
import { useState } from "react"
import Button from "@niceprototypes/button"
import Flex from "@niceprototypes/flex"
import Ink from "@niceprototypes/ink"
import { ChatComposer } from "@niceprototypes/chat"
import type { ChatComposerProps } from "@niceprototypes/chat"
import type { ComponentExample } from "../../dataTables/components/demos/Components"
import { chatWidth } from "../Chat/samples"

/**
 * A controlled composer that reports what it sends and stops. `busy` and `disabled` come from the
 * example; `busyAfterSend` turns busy on each send, so the stop button and Escape can be tried.
 */
const DemoComposer = ({ initial = "", busyAfterSend = false, ...props }: Partial<ChatComposerProps> & { initial?: string; busyAfterSend?: boolean }) => {
  const [value, setValue] = useState(initial)
  const [busy, setBusy] = useState(props.busy ?? false)
  const [last, setLast] = useState<string | null>(null)
  return (
    <Flex direction="column" gap="small" style={chatWidth}>
      <ChatComposer
        aria-label="Message"
        placeholder="Ask about this scene"
        {...props}
        value={value}
        busy={busy}
        onChange={next => setValue(next)}
        onSubmit={text => {
          setLast(`onSubmit("${text.replace(/\n/g, "\\n")}")`)
          setValue("")
          if (busyAfterSend) setBusy(true)
        }}
        onStop={() => {
          setLast("onStop()")
          setBusy(false)
        }}
      />
      <Ink code>{last ?? "–"}</Ink>
    </Flex>
  )
}

const CONTROLLED = `const [draft, setDraft] = useState("")

<ChatComposer
  aria-label="Message"
  value={draft}
  onChange={setDraft}
  onSubmit={send}
/>`

export const chatComposerValue = {
  name: "value",
  description: "The message being written. The composer is controlled: keep the draft in state and set it from onChange.",
  variants: ["empty", "draft"],
  default: "empty",
  preview: (variant: string) => <DemoComposer initial={variant === "draft" ? "Why does the slide feel stiff?" : ""} />,
  code: (variant: string) => (variant === "draft" ? CONTROLLED.replace('useState("")', 'useState("Why does the slide feel stiff?")') : CONTROLLED),
} satisfies ComponentExample

export const chatComposerOnChange = {
  name: "onChange",
  description: "Called with the new text on every edit (and the change event). Set the draft from it.",
  variants: ["handler"],
  default: "handler",
  preview: () => <DemoComposer />,
  code: () => `<ChatComposer aria-label="Message" value={draft} onChange={next => setDraft(next)} onSubmit={send} />`,
} satisfies ComponentExample

export const chatComposerOnSubmit = {
  name: "onSubmit",
  description: "Called with the text on Enter or the send button. Shift+Enter adds a new line instead. Clear the draft after sending.",
  variants: ["handler"],
  default: "handler",
  preview: () => <DemoComposer />,
  code: () => `<ChatComposer
  aria-label="Message"
  value={draft}
  onChange={setDraft}
  onSubmit={text => {
    send(text)
    setDraft("")
  }}
/>`,
} satisfies ComponentExample

export const chatComposerOnStop = {
  name: "onStop",
  description: "Called by the stop button or Escape while busy. Here each send turns busy on; stop it with the button or Escape.",
  variants: ["handler"],
  default: "handler",
  preview: () => <DemoComposer busyAfterSend />,
  code: () => `<ChatComposer aria-label="Message" value={draft} onChange={setDraft} onSubmit={send} onStop={stop} busy={busy} />`,
} satisfies ComponentExample

export const chatComposerBusy = {
  name: "busy",
  description: "A reply is in progress: the send button becomes a stop button, and it and Escape call onStop.",
  variants: ["false", "true"],
  default: "false",
  preview: (variant: string) => <DemoComposer key={variant} busy={variant === "true"} />,
  code: (variant: string) =>
    `<ChatComposer aria-label="Message" value={draft} onChange={setDraft} onSubmit={send} onStop={stop} busy={${variant}} />`,
} satisfies ComponentExample

export const chatComposerDisabled = {
  name: "disabled",
  description: "Disables the text field and the button.",
  variants: ["false", "true"],
  default: "false",
  preview: (variant: string) => <DemoComposer initial="Hi" disabled={variant === "true"} />,
  code: (variant: string) => `<ChatComposer aria-label="Message" value={draft} onChange={setDraft} onSubmit={send}${variant === "true" ? " disabled" : ""} />`,
} satisfies ComponentExample

export const chatComposerPlaceholder = {
  name: "placeholder",
  description: "Placeholder text, shown while the draft is empty.",
  variants: ["Ask about this scene", "Message the assistant"],
  default: "Ask about this scene",
  preview: (variant: string) => <DemoComposer placeholder={variant} />,
  code: (variant: string) => `<ChatComposer aria-label="Message" placeholder="${variant}" value={draft} onChange={setDraft} onSubmit={send} />`,
} satisfies ComponentExample

export const chatComposerActions = {
  name: "actions",
  description: "Extra controls before the send button, such as an attach button.",
  variants: ["none", "attach"],
  default: "none",
  preview: (variant: string) => (
    <DemoComposer actions={variant === "attach" ? <Button iconLeft="file" size="small" ghost aria-label="Attach" /> : undefined} />
  ),
  code: (variant: string) =>
    variant === "attach"
      ? `<ChatComposer
  aria-label="Message"
  value={draft}
  onChange={setDraft}
  onSubmit={send}
  actions={<Button iconLeft="file" size="small" ghost aria-label="Attach" onClick={attach} />}
/>`
      : `<ChatComposer aria-label="Message" value={draft} onChange={setDraft} onSubmit={send} />`,
} satisfies ComponentExample

export const chatComposerMaxRows = {
  name: "maxRows",
  description: "The field grows with its text up to this many lines, then scrolls. Type several lines with Shift+Enter.",
  variants: ["unset", "3"],
  default: "unset",
  preview: (variant: string) => (
    <DemoComposer
      maxRows={variant === "unset" ? undefined : Number(variant)}
      initial={"One\nTwo\nThree\nFour\nFive"}
    />
  ),
  code: (variant: string) =>
    `<ChatComposer aria-label="Message" value={draft} onChange={setDraft} onSubmit={send}${variant === "unset" ? "" : ` maxRows={${variant}}`} />`,
} satisfies ComponentExample

export const chatComposerAriaLabel = {
  name: "aria-label",
  description: "Accessible name of the text field.",
  variants: ["Message"],
  default: "Message",
  preview: (variant: string) => <DemoComposer aria-label={variant} />,
  code: (variant: string) => `<ChatComposer aria-label="${variant}" value={draft} onChange={setDraft} onSubmit={send} />`,
} satisfies ComponentExample

/** Every ChatComposer example facet, each one a section of the ChatComposer docs page. */
export const chatComposerExamples = {
  value: chatComposerValue,
  onChange: chatComposerOnChange,
  onSubmit: chatComposerOnSubmit,
  onStop: chatComposerOnStop,
  busy: chatComposerBusy,
  disabled: chatComposerDisabled,
  placeholder: chatComposerPlaceholder,
  actions: chatComposerActions,
  maxRows: chatComposerMaxRows,
  "aria-label": chatComposerAriaLabel,
} satisfies Record<string, ComponentExample>
