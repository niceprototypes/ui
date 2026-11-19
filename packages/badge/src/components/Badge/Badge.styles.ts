import styled from "styled-components"
import { getToken } from "@niceprototypes/styles"

/**
 * The badge: a small rounded rectangle, tinted per status, with a leading dot and its label in the
 * status colour. Static rules keyed on `data-status`, one class for every badge.
 */
export const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${getToken("badge.gap")};
  padding: ${getToken("badge.paddingBlock")} ${getToken("badge.paddingInline")};
  border-radius: ${getToken("badge.borderRadius")};
  font-size: ${getToken("badge.fontSize")};
  font-weight: ${getToken("badge.fontWeight")};
  line-height: ${getToken("badge.lineHeight")};
  white-space: nowrap;
  background-color: ${getToken("badge.backgroundColor:base")};
  color: ${getToken("badge.color:base")};

  &::before {
    content: "";
    flex: none;
    width: ${getToken("badge.dot.size")};
    height: ${getToken("badge.dot.size")};
    border-radius: 50%;
    background-color: ${getToken("badge.dot.color:base")};
  }

  &[data-status="success"] {
    background-color: ${getToken("badge.backgroundColor:success")};
    color: ${getToken("badge.color:success")};
  }
  &[data-status="success"]::before {
    background-color: ${getToken("badge.dot.color:success")};
  }
  &[data-status="warning"] {
    background-color: ${getToken("badge.backgroundColor:warning")};
    color: ${getToken("badge.color:warning")};
  }
  &[data-status="warning"]::before {
    background-color: ${getToken("badge.dot.color:warning")};
  }
  &[data-status="error"] {
    background-color: ${getToken("badge.backgroundColor:error")};
    color: ${getToken("badge.color:error")};
  }
  &[data-status="error"]::before {
    background-color: ${getToken("badge.dot.color:error")};
  }
`
