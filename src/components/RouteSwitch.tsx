import React, { ReactElement } from "react"
import { Route, RouteProps } from "./Route"
import { useRoute } from "../hooks"
import { Uninitialized, isRouteMatch } from "../route"

export type SwitchProps = {
    children?: React.ReactNode
}

export function RouteSwitch({ children }: SwitchProps): JSX.Element | null {
    const route = useRoute()

    if (route.item === Uninitialized) {
        return null
    }

    let match: ReactElement | null = null

    React.Children.forEach(children, (child) => {
        if (match !== null || !React.isValidElement(child)) {
            return
        } else if (child.type !== Route) {
            return
        } else if (!isRouteMatch(route.item, (child.props as RouteProps).matches)) {
            return
        }
        match = child
    })

    return match
}
