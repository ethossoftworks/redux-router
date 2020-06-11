import React from "react"
import { Route, RouteItem, isRouteMatch } from "../route"
import { useRoute } from "../hooks"

export type RouteProps = {
    children?: React.ReactNode
    matches: RouteItem | RouteItem[]
}

export function Route({ children, matches }: RouteProps): JSX.Element | null {
    const route = useRoute()
    return isRouteMatch(route.item, matches) ? <>{children}</> : null
}
