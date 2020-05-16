import { RouteMap, RouteType } from "@ethossoftworks/redux-router"

export const Routes: RouteMap = {
    Home: class extends RouteType {
        static path = "/"
    },
}
