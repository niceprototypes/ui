import type * as React from "react"

/**
 * TableHeaderProps
 *
 * Complete prop definition for the TableHeader component: the header row.
 */
export interface TableHeaderProps {
  /** TableCell elements with `role="columnheader"` */
  children?: React.ReactNode
}

const TableHeaderTypes = {} as const

namespace TableHeaderTypes {
  export type Props = TableHeaderProps
}

export default TableHeaderTypes
