import React, { useEffect } from "react"
import { useRouteQuery, RouterActions } from "@ethossoftworks/redux-router"
import { Redirect } from "@ethossoftworks/redux-router/components"
import { useDispatch } from "react-redux"
import { setLoggedIn, isLoggedIn } from "../util"
import { Dispatch } from "redux"
import { Routes } from "../Routes"
import { Page } from "./Page"
import { TransitionStatus, ENTERED, ENTERING } from "react-transition-group/Transition"

export function Login({ transition }: { transition: TransitionStatus }) {
    const redirectPage = useRouteQuery().r
    const dispatch = useDispatch()

    // TODO: This is a little gross and doesn't work well
    if (isLoggedIn() && (transition === ENTERED || transition === ENTERING)) {
        return <Redirect to={Routes.Home()} />
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
