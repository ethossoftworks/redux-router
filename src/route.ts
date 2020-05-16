import { Location } from "./location"

export type RouteMap = Record<string, RouteTypeConstructor>

export type Route = {
    id: string
    url: string
    type: RouteTypeConstructor
    data: RouteData
}

export type RouteTypeConstructor = (new (...args: any) => RouteType) & { path: string }

export class RouteType implements RouteData {
    params: Record<string, string> = {}
    query: Record<string, string> = {}
    hash: string = ""

    constructor(data?: { params?: Record<string, string>; query?: Record<string, string>; hash?: string }) {
        this.params = data?.params || {}
        this.query = data?.query || {}
        this.hash = data?.hash || ""
    }
}

export type RouteData = {
    params: Record<string, string>
    query: Record<string, string>
    hash: string
}

export class PageNotFound extends RouteType {
    static path = ""
    static id = "@PageNotFound"

    constructor(path: string) {
        super({ params: { path } })
    }
}

export class Uninitialized extends RouteType {
    static path = ""
    static id = "@Uninitialized"
}

export function createRouteForRouteType(location: Location, routes: RouteMap, route: RouteType): Route {
    for (const [key, type] of Object.entries(routes)) {
        if (!(route instanceof type)) {
            continue
        }

        const data = { params: route.params, query: route.query, hash: route.hash }
        const url = createPathForRoute(location, { id: key, type, data, url: "" })

        return { id: key, type, url, data }
    }
    return { id: PageNotFound.id, url: "", type: PageNotFound, data: new PageNotFound("") }
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

    return { id: PageNotFound.id, url: path, type: PageNotFound, data: new PageNotFound(path) }
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

export function isRouteMatch(
    value: RouteTypeConstructor,
    other: RouteTypeConstructor | RouteTypeConstructor[]
): boolean {
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
