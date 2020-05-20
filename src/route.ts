import { Location } from "./location"
import { withRouterContext } from "./context"
import { RouterState } from "./reducer"

export type RouteMap = Record<string, RouteItem>
export type RouteItem<T extends any[] = any[]> = ((...args: T) => RouteItemData) & { path: string; id: string }
export type RouteItemData = RouteData & { id: string }

export type Route = {
    id: string
    url: string
    type: RouteItem
    data: RouteData
}

export type RouteData = {
    params: Record<string, string>
    query: Record<string, string>
    hash: string
}

export const Uninitialized = route({ path: "@Uninitialized" })
export const PageNotFound = route({ path: "@PageNotFound", creator: (path: string) => ({ params: { path } }) })

export const createRouteForRouterState = withRouterContext((context) => (state: RouterState) => ({
    ...state,
    type: state.id === PageNotFound.id ? PageNotFound : context.routes[state.id],
}))

export function createRouteForData(location: Location, routes: RouteMap, route: RouteItemData): Route {
    for (const [key, type] of Object.entries(routes)) {
        if (!(route.id === type.id)) {
            continue
        }

        const data = { params: route.params, query: route.query, hash: route.hash }
        const url = createPathForRoute(location, { id: key, type, data, url: "" })

        return { id: key, type, url, data }
    }
    return { id: PageNotFound.id, url: "", type: PageNotFound, data: PageNotFound("") }
}

export function createRouteForPath(location: Location, routes: RouteMap, path: string): Route {
    const url = new URL(path, location.origin())
    const pathSegments = url.pathname.split("/").filter((segment) => segment !== "")
    const query = buildQueryDataObject(url)

    routeTypeLoop: for (const [key, type] of Object.entries(routes)) {
        if (type.path === path) {
            return { id: key, type, url: path, data: { params: {}, query, hash: url.hash } }
        }

        const typePathSegments = type.path.split("/").filter((segment) => segment !== "")
        if (pathSegments.length !== typePathSegments.length) {
            continue
        }

        const params: Record<string, string> = {}
        for (let i = 0, l = pathSegments.length; i < l; i++) {
            if (typePathSegments[i][0] === ":") {
                params[typePathSegments[i].substring(1)] = decodeURIComponent(pathSegments[i])
            } else if (typePathSegments[i] !== pathSegments[i]) {
                continue routeTypeLoop
            }
        }

        return { id: key, type, url: path, data: { params, query, hash: url.hash } }
    }

    return { id: PageNotFound.id, url: path, type: PageNotFound, data: PageNotFound(path) }
}

function buildQueryDataObject(url: URL): Record<string, string> {
    const query: Record<string, string> = {}

    if (url.search === "") {
        return query
    }

    for (const [key, value] of url.searchParams.entries()) {
        query[key] = value
    }

    return query
}

export function createPathForRoute(location: Location, route: Route): string {
    let path = replacePathSegments(route.type.path, route.data.params)

    const url = new URL(path, location.origin())
    for (const [key, value] of Object.entries(route.data.query)) {
        url.searchParams.append(key, value)
    }

    url.hash = route.data.hash

    return `${url.pathname}${url.search}${url.hash}`
}

function replacePathSegments(path: string, params: Record<string, string>): string {
    for (const [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, encodeURIComponent(value))
    }
    return path
}

export function route<T extends (() => Partial<RouteData>) | ((...args: any) => Partial<RouteData>)>({
    path,
    creator,
}: {
    path: string
    creator?: T
}): T extends () => Partial<RouteData> ? RouteItem<[]> : RouteItem<Parameters<T>> {
    const _creator = creator || (() => ({ query: {}, params: {}, hash: "" }))

    const routeCreator: RouteItem<Parameters<T>> = (...args: Parameters<T>) => {
        const data = _creator(args)
        return {
            id: path,
            params: data.params || {},
            query: data.query || {},
            hash: data.hash || "",
        }
    }

    routeCreator.path = path
    routeCreator.id = path

    return routeCreator as T extends () => Partial<RouteData> ? RouteItem<[]> : RouteItem<Parameters<T>>
}

export function isRouteMatch(value: RouteItem, other: RouteItem | RouteItem[]): boolean {
    if (Array.isArray(other)) {
        for (let i = 0, l = other.length; i < l; i++) {
            if (value === other[i]) {
                return true
            }
        }
        return false
    }
    return other === value
}
