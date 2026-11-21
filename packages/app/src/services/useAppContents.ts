import { useAppContext } from "../utilities/AppContext"

/**
 * The current page's report to the nav: `setItems` replaces its in-page sections (the rows its
 * Contents column shows once rendered, over App's `contents`), `setActiveId` names the section in
 * view (the Contents scroll-spy), which the nav marks active. Both reset when the page changes.
 *
 * @example
 * const { setItems, setActiveId } = useAppContents()
 * React.useEffect(() => setItems(items), [items, setItems])
 * <Contents items={items} onActiveChange={setActiveId} />
 */
export const useAppContents = () => useAppContext().contents
