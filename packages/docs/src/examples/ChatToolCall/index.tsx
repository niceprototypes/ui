// ChatToolCall example configs: one ComponentExample per facet, keyed by prop name, plus the call's
// lifecycle. Pending previews are live: press Approve or Deny.
import { useState } from "react"
import { ChatToolCall } from "@niceprototypes/chat"
import type { ChatToolCallProps, ChatToolCallStatusType } from "@niceprototypes/chat"
import LifecycleStory, { type LifecycleStep } from "../../components/LifecycleStory"
import type { ComponentExample } from "../../dataTables/components/demos/Components"
import { chatWidth } from "../Chat/samples"

const SUMMARY = "nice/chat@1.0.0, into a new story"
const ERROR = "Asset nice/chat@9.9.9 not found"

/** A call in the chat column. */
const DemoCall = (props: Partial<ChatToolCallProps>) => (
  <div style={chatWidth}>
    <ChatToolCall title="Install asset" {...props}>
      {"children" in props ? props.children : SUMMARY}
    </ChatToolCall>
  </div>
)

/** A pending call that Approve runs (running, then done) and Deny declines. */
const ApprovableCall = () => {
  const [status, setStatus] = useState<ChatToolCallStatusType>("pending")
  const approve = () => {
    setStatus("running")
    setTimeout(() => setStatus("done"), 1200)
  }
  return <DemoCall status={status} onApprove={approve} onDeny={() => setStatus("denied")} />
}

const callCode = (props: string) => `<ChatToolCall title="Install asset"${props}>
  ${SUMMARY}
</ChatToolCall>`

export const chatToolCallTitle = {
  name: "title",
  description: "What the call does, in a few words. It also labels the call's group.",
  variants: ["Install asset", "Rename scene"],
  default: "Install asset",
  preview: (variant: string) => <DemoCall title={variant} status="done" />,
  code: (variant: string) => `<ChatToolCall title="${variant}" status="done">\n  ${SUMMARY}\n</ChatToolCall>`,
} satisfies ComponentExample

export const chatToolCallChildren = {
  name: "children",
  description: "The call's summary or details: what it will act on, such as its input as text.",
  variants: ["summary", "none"],
  default: "summary",
  preview: (variant: string) => <DemoCall status="done">{variant === "summary" ? SUMMARY : undefined}</DemoCall>,
  code: (variant: string) => (variant === "summary" ? callCode(' status="done"') : `<ChatToolCall title="Install asset" status="done" />`),
} satisfies ComponentExample

export const chatToolCallStatus = {
  name: "status",
  description:
    "Lifecycle status: pending waits for the user with Approve and Deny; running, approved and running; done, it succeeded; denied, the user declined and it did not run; failed, it ran or was refused with an error.",
  variants: ["pending", "running", "done", "denied", "failed"],
  default: "pending",
  preview: (variant: ChatToolCallStatusType) => <DemoCall status={variant} />,
  code: (variant: string) => callCode(` status="${variant}"`),
} satisfies ComponentExample

export const chatToolCallOutcome = {
  name: "outcome",
  description: "A resolved call's detail after its status, such as the error a failed call returned.",
  variants: ["none", "error"],
  default: "none",
  preview: (variant: string) => <DemoCall status="failed" outcome={variant === "error" ? ERROR : undefined} />,
  code: (variant: string) => callCode(variant === "error" ? ` status="failed" outcome="${ERROR}"` : ' status="failed"'),
} satisfies ComponentExample

export const chatToolCallOnApprove = {
  name: "onApprove",
  description: "Approve pressed. Set the status to running, then to done or failed when the call resolves.",
  variants: ["handler"],
  default: "handler",
  preview: () => <ApprovableCall />,
  code: () => callCode(` status={status} onApprove={run} onDeny={() => setStatus("denied")}`),
} satisfies ComponentExample

export const chatToolCallOnDeny = {
  name: "onDeny",
  description: "Deny pressed. Set the status to denied; the call does not run.",
  variants: ["handler"],
  default: "handler",
  preview: () => <ApprovableCall />,
  code: () => callCode(` status={status} onApprove={run} onDeny={() => setStatus("denied")}`),
} satisfies ComponentExample

type CallStepType = { status: ChatToolCallStatusType }

/** A call approved and run, then a call denied. */
const CALLS: ReadonlyArray<LifecycleStep<CallStepType>> = [
  { label: "pending", props: { status: "pending" }, duration: "long" },
  { label: "approved: running", props: { status: "running" } },
  { label: "done", props: { status: "done" }, duration: "long" },
  { label: "pending again", props: { status: "pending" }, duration: "long" },
  { label: "denied", props: { status: "denied" }, duration: "long" },
]

export const chatToolCallLifecycle = {
  name: "lifecycle",
  description: "The call on a loop: pending, approved and running, done; then pending again and denied.",
  variants: ["calls"],
  default: "calls",
  preview: () => <LifecycleStory steps={CALLS} render={({ status }) => <DemoCall status={status} />} />,
  code: () => callCode(" status={status} onApprove={run} onDeny={deny}"),
} satisfies ComponentExample

/** Every ChatToolCall example facet, each one a section of the ChatToolCall docs page. */
export const chatToolCallExamples = {
  title: chatToolCallTitle,
  children: chatToolCallChildren,
  status: chatToolCallStatus,
  outcome: chatToolCallOutcome,
  onApprove: chatToolCallOnApprove,
  onDeny: chatToolCallOnDeny,
  lifecycle: chatToolCallLifecycle,
} satisfies Record<string, ComponentExample>
