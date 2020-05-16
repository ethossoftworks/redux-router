import { RouteType, Route, createRouteForRouteType, createRouteForPath, Uninitialized } from "./route"
import { withRouterContext } from "./context"

export enum RouterActionTypes {
    NAVIGATE = "@@ROUTER/NAVIGATE",
    BACK = "@@ROUTER/BACK",
    FORWARD = "@@ROUTER/FORWARD",
    URL_CHANGED = "@@ROUTER/URL_CHANGED",
}

type ReduxActionCreator<T extends Record<string, (...args: any) => any>> = ReturnType<T[keyof T]>
export type RouterActions = ReduxActionCreator<typeof RouterActions>
export const RouterActions = {
    urlChanged: (url: string) => ({ type: RouterActionTypes.URL_CHANGED, url } as const),
    navigate: withRouterContext((context) => (route: RouteType | string, replace: boolean = false) => {
        return {
            type: RouterActionTypes.NAVIGATE,
            replace,
            route:
                route instanceof RouteType
                    ? createRouteForRouteType(context.location, context.routes, route)
                    : createRouteForPath(context.location, context.routes, route),
        } as const
    }),
    back: () => ({ type: RouterActionTypes.BACK } as const),
    forward: () => ({ type: RouterActionTypes.FORWARD } as const),
}

export type RouterState = Omit<Route, "type">
const initialState: RouterState = { id: Uninitialized.id, url: "", data: new Uninitialized() }

export const routerReducer = withRouterContext(
    (context) => (state: RouterState = initialState, action: RouterActions): RouterState => {
        switch (action.type) {
            case RouterActionTypes.URL_CHANGED:
                const route = createRouteForPath(context.location, context.routes, action.url)
                return { id: route.id, url: route.url, data: route.data }
            case RouterActionTypes.NAVIGATE:
                return { id: action.route.id, url: action.route.url, data: action.route.data }
            default:
                return state
        }
    }
)
