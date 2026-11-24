---
"@niceprototypes/docs": patch
---

The docs nav's Forms folder is flattened: Button, Calendar, Checkbox, DateField, Field (with Fieldset), Form, Input, Listbox, RadioGroup, Select and Toggle sit directly under Components in its alphabetical order. URLs move from `/docs/components/forms/{name}` to `/docs/components/{name}` (Fieldset: `/docs/components/field/fieldset`); old addresses and `components-forms-…` Storybook ids redirect, keeping their `#section`.
