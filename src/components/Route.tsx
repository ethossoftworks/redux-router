import React from "react"
import { Route, RouteTypeConstructor, isRouteMatch } from "../route"
import { useRoute } from "../hooks"

export type RouteProps = {
    children?: React.ReactNode
    matches: RouteTypeConstructor | RouteTypeConstructor[]
}

export function Route({ children, matches }: RouteProps) {
    const route = useRoute()
    return isRouteMatch(route.type, matches) ? <>{children}</> : null
}