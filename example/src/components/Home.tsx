import React from "react"
import { Link } from "@ethossoftworks/redux-router/components"
import { Routes } from "../Routes"
import { Page } from "./Page"

export function Home() {
    return (
        <Page className="page--home">
            <h1>Home</h1>
            <div>
                <Link to={Routes.Articles()}>Articles</Link>
            </div>
            <div>
                <Link to={Routes.Home()}>Login</Link>
            </div>
        </Page>
    )
}
