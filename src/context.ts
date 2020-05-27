import { RouteMap } from "./route"
import { browserLocation, RouterLocation } from "./location"

type ReduxRouterContext = {
    reducerKey: string
    routes: RouteMap
    location: RouterLocation
}

export const withRouterContext = (() => {
    const context: ReduxRouterContext = {
        reducerKey: "",
        routes: {},
        location: browserLocation,
    }

    return <T extends (context: ReduxRouterContext) => any>(callback: T): ReturnType<T> => callback(context)
})()
