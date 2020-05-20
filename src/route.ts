import { Location } from "./location"
import { withRouterContext } from "./context"
import { RouterState } from "./reducer"

export type RouteMap = Record<string, RouteItem>
export type RouteItem<T extends any[] = any[]> = ((...args: T) => RouteItemData) & { path: string; id: string }
export type RouteItemData = RouteData & { id: string }

export type Route = {
    key: string
    url: string
    item: RouteItem
    data: RouteData
}

export type RouteData = {
    params: Record<string, string>
    query: Record<string, string>
    hash: string
}

export const Uninitialized = route({ path: "@Uninitialized" })
export const PageNotFound = route({ path: "@PageNotFound", data: (path: string) => ({ params: { path } }) })

export const createRouteForRouterState = withRouterContext((context) => (state: RouterState) => ({
    ...state,
    item: state.key === PageNotFound.id ? PageNotFound : context.routes[state.key],
}))

export function createRouteForData(location: Location, routes: RouteMap, itemData: RouteItemData): Route {
    for (const [key, item] of Object.entries(routes)) {
        if (!(itemData.id === item.id)) {
            continue
        }

        const data = { params: itemData.params, query: itemData.query, hash: itemData.hash }
        const url = createPathForRoute(location, { key: key, item: item, data, url: "" })

        return { key: key, item: item, url, data }
    }
    return { key: PageNotFound.id, url: "", item: PageNotFound, data: PageNotFound("") }
}

export function createRouteForPath(location: Location, routes: RouteMap, path: string): Route {
    const url = new URL(path, location.origin())
    const pathSegments = url.pathname.split("/").filter((segment) => segment !== "")
    const query = buildQueryDataObject(url)

    routeItemLoop: for (const [key, item] of Object.entries(routes)) {
        if (item.path === path) {
            return { key: key, item: item, url: path, data: { params: {}, query, hash: url.hash } }
        }

        const itemPathSegments = item.path.split("/").filter((segment) => segment !== "")
        if (pathSegments.length !== itemPathSegments.length) {
            continue
        }

        const params: Record<string, string> = {}
        for (let i = 0, l = pathSegments.length; i < l; i++) {
            if (itemPathSegments[i][0] === ":") {
                params[itemPathSegments[i].substring(1)] = decodeURIComponent(pathSegments[i])
            } else if (itemPathSegments[i] !== pathSegments[i]) {
                continue routeItemLoop
            }
        }

        return { key: key, item: item, url: path, data: { params, query, hash: url.hash } }
    }

    return { key: PageNotFound.id, url: path, item: PageNotFound, data: PageNotFound(path) }
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
    let path = replacePathSegments(route.item.path, route.data.params)

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
    data,
}: {
    path: string
    data?: T
}): T extends () => Partial<RouteData> ? RouteItem<[]> : RouteItem<Parameters<T>> {
    const _data = data || (() => ({ query: {}, params: {}, hash: "" }))

    const routeItem = (...args: Parameters<T>) => {
        const data = _data(args)
        return {
            id: path,
            params: data.params || {},
            query: data.query || {},
            hash: data.hash || "",
        }
    }

    routeItem.path = path
    routeItem.id = path

    return routeItem as T extends () => Partial<RouteData> ? RouteItem<[]> : RouteItem<Parameters<T>>
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
