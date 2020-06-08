import { Middleware, MiddlewareAPI, Dispatch, Reducer } from "redux"
import { RouterActions, RouterActionTypes, routerReducer, RouterState } from "./reducer"
import { RouteMap, Route, createPathForRoute, PageNotFound, createRouteForRouterState } from "./route"
import { withRouterContext } from "./context"
import { RouterLocation, browserLocation } from "./location"

type ReduxActionCreator<T extends Record<string, (...args: any) => any>> = ReturnType<T[keyof T]>

export const createRouterMiddleware = withRouterContext(
    (context) => <S>(
        routes: RouteMap,
        reducerKey: keyof S,
        location: RouterLocation = browserLocation
    ): {
        middleware: Middleware
        reducer: Reducer<RouterState, RouterActions>
        init: () => void
    } => {
        context.routes = routes
        context.reducerKey = reducerKey as string
        context.location = location

        const middleware = (store: MiddlewareAPI) => {
            if (store.getState()[reducerKey] === undefined) {
                throw "Redux Router initialized with incorrect reducer key. RouterState cannot be found in state."
            }

            window.addEventListener("popstate", (ev) => {
                store.dispatch(RouterActions.urlChanged(`${location.path()}${location.query()}${location.hash()}`))
            })

            returnWrapper.init = () =>
                store.dispatch(RouterActions.urlChanged(`${location.path()}${location.query()}${location.hash()}`))

            return (next: Dispatch) => (action: ReduxActionCreator<typeof RouterActions>) => {
                const result = next(action)
                switch (action.type) {
                    case RouterActionTypes.URL_CHANGED:
                        const route = createRouteForRouterState(store.getState()[reducerKey])
                        setTitleForRoute(route)
                        break
                    case RouterActionTypes.NAVIGATE:
                        navigate(location, action.route, action.replace)
                        break
                    case RouterActionTypes.BACK:
                        location.back()
                        break
                    case RouterActionTypes.FORWARD:
                        location.forward()
                        break
                }
                return result
            }
        }

        const returnWrapper = { reducer: routerReducer, middleware, init: () => {} }
        return returnWrapper
    }
)

function navigate(location: RouterLocation, route: Route, replace: boolean = false) {
    const path =
        route.item === PageNotFound && route.data.params.path !== undefined
            ? route.data.params.path
            : createPathForRoute(location, route)

    if (path === `${location.path()}${location.query()}${location.hash()}`) {
        return
    }

    setTitleForRoute(route)

    if (replace) {
        location.replace(path, "")
    } else {
        location.push(path, "")
    }
}

function setTitleForRoute(route: Route) {
    if (route.title === null) {
        return
    }

    document.title = route.title
}
