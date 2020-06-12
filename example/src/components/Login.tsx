import React, { useState } from "react"
import { useRouteQuery, RouterActions } from "@ethossoftworks/redux-router"
import { Redirect } from "@ethossoftworks/redux-router/components"
import { useDispatch } from "react-redux"
import { setLoggedIn, isLoggedIn } from "../util"
import { Dispatch } from "redux"
import { Routes } from "../Routes"
import { Page } from "./Page"

export function Login() {
    const redirectPage = useRouteQuery().r
    const dispatch = useDispatch()
    const [hasRedirected, setHasRedirected] = useState(false)

    if (isLoggedIn() && !hasRedirected) {
        setHasRedirected(true)
        return <Redirect to={Routes.Home()} />
    } else if (isLoggedIn() && hasRedirected) {
        return null
    }

    return (
        <Page className="page--login">
            <h1>Login</h1>
            <div className="login-cont">
                Please Login
                <br />
                <div className="login-button" onClick={() => handleLogin(dispatch, redirectPage)}>
                    Login
                </div>
            </div>
        </Page>
    )
}

function handleLogin(dispatch: Dispatch, redirectPage?: string) {
    setLoggedIn(true)
    dispatch(RouterActions.navigate(redirectPage ? redirectPage : Routes.Home()))
}
