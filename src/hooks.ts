import { useSelector } from "react-redux"
import { RouterState } from "./reducer"
import { Route, PageNotFound, isRouteMatch, RouteTypeConstructor } from "./route"
import { withRouterContext } from "./context"

export const useRoute = withRouterContext((context) => (): Route => {
    const state = useSelector((state) => (state as any)[context.reducerKey] as RouterState)

    return {
        id: state.id,
        data: state.data,
        url: state.url,
        type: state.id === PageNotFound.id ? PageNotFound : context.routes[state.id],
    }
})

export function useRouteMatch(matches: RouteTypeConstructor | RouteTypeConstructor[]): boolean {
    return isRouteMatch(useRoute().type, matches)
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
