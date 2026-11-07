---
"@niceprototypes/calendar": major
---

DateField drops the text-entry Input props that do nothing on a picker (readOnly, maxLength, minLength, pattern, inputMode, enterKeyHint, spellCheck, dirName, passwordReveal) and leaves status unset, so an invalid Field shows the error status. Adds previousMonthLabel and nextMonthLabel to Calendar and DateField, triggerLabel to DateField, borderWidth, borderRadius and focusRing tokens, and honours DateField disabled.
