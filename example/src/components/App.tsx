import React, { useMemo } from "react"
import { RouteSwitch, Route, Redirect, RouteProps } from "@ethossoftworks/redux-router/components"
import { Routes } from "../Routes"
import { Home } from "./Home"
import { Articles } from "./Articles"
import { Login } from "./Login"
import { PageNotFound, useRoute } from "@ethossoftworks/redux-router"
import { NotFound } from "./NotFound"
import { isLoggedIn } from "../util"
import { CSSTransition, TransitionGroup } from "react-transition-group"

export function App() {
    const route = useRoute()

    const transitionDuration = useMemo(() => {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--page-transition-duration"))
    }, [])

    return (
        <TransitionGroup className="page-cont">
            <CSSTransition
                classNames="page-wrapper"
                timeout={transitionDuration}
                appear={true}
                key={route.item.groupId}
            >
                <RouteSwitch route={route}>
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
                </RouteSwitch>
            </CSSTransition>
        </TransitionGroup>
    )
}

function AuthRoute({ children, route, ...rest }: RouteProps) {
    if (!route) {
        return null
    }

    return <Route {...rest}>{!isLoggedIn() ? <Redirect to={Routes.Login(route.url)} /> : children}</Route>
}
