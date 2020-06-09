import React from "react"
import { Link } from "@ethossoftworks/redux-router/components"
import { Routes } from "../Routes"

export function Home() {
    return (
        <div>
            Home
            <br />
            <Link to={Routes.Articles()}>Articles</Link>
        </div>
    )
}
