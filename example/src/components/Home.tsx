import React from "react"
import { Link } from "@ethossoftworks/redux-router/components"
import { Routes } from "../Routes"
import { Page } from "./Page"
import { TransitionStatus } from "react-transition-group/Transition"

export function Home({ transition }: { transition: TransitionStatus }) {
    return (
        <Page className="page--home">
            <h1>Home</h1>
            <Link to={Routes.Articles()}>Articles</Link>
        </Page>
    )
}
