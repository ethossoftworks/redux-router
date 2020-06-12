import React, { useMemo } from "react"
import { RouteSwitch, Route, Redirect, RouteProps } from "@ethossoftworks/redux-router/components"
import { Routes, AuthRoutes } from "../Routes"
import { Home } from "./Home"
import { Articles } from "./Articles"
import { Login } from "./Login"
import { PageNotFound, useRoute, isRouteMatch } from "@ethossoftworks/redux-router"
import { NotFound } from "./NotFound"
import { isLoggedIn } from "../util"
import { CSSTransition, TransitionGroup } from "react-transition-group"

export function App() {
    const route = useRoute()

    const transitionDuration = useMemo(() => {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--page-transition-duration"))
    }, [])

    // MAKE SURE TWO PAGES ARE TRANSITIONING AT THE SAME TIME
    // FIX LOGIN REDIRECTION TO ARTICLES
    // https://reactcommunity.org/react-transition-group/with-react-router

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
                    {/* <Route matches={[Routes.Articles, Routes.Article]}>
                            <Articles />
                        </Route> */}
                    <Route matches={Routes.Login}>
                        <Login />
                    </Route>
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

    const isAuthRoute = isRouteMatch(route.item, AuthRoutes)

    return (
        <Route {...rest}>{!isLoggedIn() && isAuthRoute ? <Redirect to={Routes.Login(route.url)} /> : children}</Route>
    )
}

// Gotchas with Animations
// 1. Multiple routes will render at the same time with different route parameters passed in. So one view will have stale data
//    - Using hooks with state will probably break
// 2. Redirecting can be tricky
