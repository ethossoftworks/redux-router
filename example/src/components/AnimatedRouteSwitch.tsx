import React from "react"
import { useRoute } from "@ethossoftworks/redux-router"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { RouteSwitch } from "@ethossoftworks/redux-router/components"

type AnimatedRouteSwitchProps = {
    transitionDuration: number | { appear?: number; enter?: number; exit?: number }
    containerClassName: string
    transitionClassNames: string
    children: React.ReactNode
}

export function AnimatedRouteSwitch({
    containerClassName,
    transitionDuration,
    transitionClassNames,
    children,
}: AnimatedRouteSwitchProps) {
    const route = useRoute()

    return (
        <TransitionGroup className={containerClassName}>
            <CSSTransition
                classNames={transitionClassNames}
                timeout={transitionDuration}
                appear={true}
                key={route.item.meta.transitionId || route.key}
            >
                <RouteSwitch route={route}>{children}</RouteSwitch>
            </CSSTransition>
        </TransitionGroup>
    )
}
