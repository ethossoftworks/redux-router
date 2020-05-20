import { Middleware, MiddlewareAPI, Dispatch, Reducer } from "redux"
import { RouterActions, RouterActionTypes, routerReducer, RouterState } from "./reducer"
import { RouteMap, Route, createPathForRoute, PageNotFound } from "./route"
import { withRouterContext } from "./context"
import { Location, browserLocation } from "./location"

type ReduxActionCreator<T extends Record<string, (...args: any) => any>> = ReturnType<T[keyof T]>

export const createRouterMiddleware = withRouterContext(
    (context) => <S>(
        routes: RouteMap,
        reducerKey: keyof S,
        location: Location = browserLocation
    ): {
        middleware: Middleware
        reducer: Reducer<RouterState, RouterActions>
        init: () => void
    } => {
        context.routes = routes
        context.reducerKey = reducerKey as string
        context.location = location

        const middleware = (store: MiddlewareAPI) => {
            window.addEventListener("popstate", (ev) => {
                store.dispatch(RouterActions.urlChanged(`${location.path()}${location.query()}${location.hash()}`))
            })

            returnWrapper.init = () =>
                store.dispatch(RouterActions.urlChanged(`${location.path()}${location.query()}${location.hash()}`))

            return (next: Dispatch) => (action: ReduxActionCreator<typeof RouterActions>) => {
                switch (action.type) {
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
                return next(action)
            }
        }

        const returnWrapper = { reducer: routerReducer, middleware, init: () => {} }
        return returnWrapper
    }
)

function navigate(location: Location, route: Route, replace: boolean = false) {
    const path =
        route.item === PageNotFound && route.data.params.path !== undefined
            ? route.data.params.path
            : createPathForRoute(location, route)

    if (path === `${location.path()}${location.query()}${location.hash()}`) {
        return
    }

    if (replace) {
        location.replace(path, "")
    } else {
        location.push(path, "")
    }
}
