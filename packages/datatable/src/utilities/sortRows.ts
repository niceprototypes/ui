import type { DataTableColumnType, DataTableSortType } from "../components/DataTable/DataTable.types"

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" })

/**
 * The rows sorted within each set of siblings by `sort`, so children stay under their parent:
 * the sorted top-level rows and a lookup of each row's sorted children. Unsorted (no `sort`, or a
 * column without `sortValue`), the input order and `getChildren` as given.
 */
export const sortRows = <Row>(
  rows: ReadonlyArray<Row>,
  getChildren: ((row: Row) => ReadonlyArray<Row> | undefined) | undefined,
  columns: ReadonlyArray<DataTableColumnType<Row>>,
  sort: DataTableSortType | undefined,
): { rows: ReadonlyArray<Row>; getChildren?: (row: Row) => ReadonlyArray<Row> | undefined } => {
  const sortValue = sort ? columns.find(column => column.id === sort.columnId)?.sortValue : undefined
  if (!sort || !sortValue) return { rows, getChildren }
  const sign = sort.direction === "ascending" ? 1 : -1
  const compare = (a: Row, b: Row) => {
    const left = sortValue(a)
    const right = sortValue(b)
    const order =
      typeof left === "number" && typeof right === "number" ? left - right : collator.compare(String(left), String(right))
    return order * sign
  }
  const children = new Map<Row, ReadonlyArray<Row>>()
  const sortLevel = (level: ReadonlyArray<Row>): Row[] => {
    const sorted = [...level].sort(compare)
    for (const row of sorted) {
      const nested = getChildren?.(row)
      if (nested?.length) children.set(row, sortLevel(nested))
    }
    return sorted
  }
  return { rows: sortLevel(rows), getChildren: row => children.get(row) }
}
