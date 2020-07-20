import React from "react"
import { useDispatch } from "react-redux"
import { RouterActions } from "../reducer"
import { createRouteForData, RouteItemData } from "../route"
import { withRouterContext } from "../context"

export type LinkProps = {
    to: RouteItemData | string
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const Link = withRouterContext((context) => ({ to, children, ...rest }: LinkProps): JSX.Element => {
    const dispatch = useDispatch()

    const href = typeof to === "string" ? to : createRouteForData(context.location, context.routes, to).url

    const handleClick = (ev: React.MouseEvent) => {
        ev.preventDefault()
        dispatch(RouterActions.navigate(to))
    }

    return (
        <a {...rest} href={href} onClick={rest.onClick || handleClick}>
            {children}
        </a>
    )
})
