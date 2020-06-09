import React from "react"
import { RouteSwitch, Route } from "@ethossoftworks/redux-router/components"
import { Routes } from "../Routes"
import { Home } from "./Home"
import { Articles } from "./Articles"
import { Login } from "./Login"

export function App() {
    return (
        <RouteSwitch>
            <Route matches={Routes.Home}>
                <Home />
            </Route>
            <Route matches={[Routes.Articles, Routes.Article]}>
                <Articles />
            </Route>
            <Route matches={Routes.Login}>
                <Login />
            </Route>
        </RouteSwitch>
    )
}
