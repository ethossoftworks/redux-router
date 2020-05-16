import { RouteMap } from "./route"
import { browserLocation, Location } from "./location"

type ReduxRouterContext = {
    reducerKey: string
    routes: RouteMap
    location: Location
}

export const withRouterContext = (() => {
    const context: ReduxRouterContext = {
        reducerKey: "",
        routes: {},
        location: browserLocation,
    }

    return <T extends (context: ReduxRouterContext) => any>(callback: T): ReturnType<T> => callback(context)
})()
