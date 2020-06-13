import React, { useMemo } from "react"
import { Route, Redirect, RouteProps } from "@ethossoftworks/redux-router/components"
import { Routes } from "../Routes"
import { Home } from "./Home"
import { Articles } from "./Articles"
import { Login } from "./Login"
import { PageNotFound } from "@ethossoftworks/redux-router"
import { NotFound } from "./NotFound"
import { isLoggedIn } from "../util"
import { AnimatedRouteSwitch } from "./AnimatedRouteSwitch"

export function App() {
    const transitionDuration = useMemo(() => {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--page-transition-duration"))
    }, [])

    return (
        <AnimatedRouteSwitch
            containerClassName="page-cont"
            transitionClassNames="page-wrapper"
            transitionDuration={transitionDuration}
        >
            <Route matches={Routes.Home}>
                <Home />
            </Route>
            <AuthRoute matches={[Routes.Articles, Routes.Article]}>
                <Articles />
            </AuthRoute>
            <Route matches={Routes.Login}>{isLoggedIn() ? <Redirect to={Routes.Home()} /> : <Login />}</Route>
            <Route matches={PageNotFound}>
                <NotFound />
            </Route>
        </AnimatedRouteSwitch>
    )
}

function AuthRoute({ children, route, ...rest }: RouteProps) {
    if (!route) {
        return null
    }

    return <Route {...rest}>{!isLoggedIn() ? <Redirect to={Routes.Login(route.url)} /> : children}</Route>
}
