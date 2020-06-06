import { useSelector } from "react-redux"
import { RouterState } from "./reducer"
import { Route, isRouteMatch, createRouteForRouterState, RouteItem } from "./route"
import { withRouterContext } from "./context"

export const useRoute = withRouterContext((context) => (): Route => {
    const state = useSelector((state) => (state as any)[context.reducerKey] as RouterState)
    return createRouteForRouterState(state)
})

export function useRouteMatch(matches: RouteItem | RouteItem[]): Route | null {
    const route = useRoute()
    return isRouteMatch(route.item, matches) ? route : null
}

export function useRouteParams(): Record<string, string> {
    return useRoute().data.params
}

export function useRouteQuery(): Record<string, string> {
    return useRoute().data.query
}

export function useRouteHash(): string {
    return useRoute().data.hash
}
