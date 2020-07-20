import React from "react"
import { RouterActions } from "@ethossoftworks/redux-router"
import { useRouteQuery } from "@ethossoftworks/redux-router/components"
import { useDispatch } from "react-redux"
import { Dispatch } from "redux"
import { Routes } from "../Routes"
import { Page } from "./Page"
import { LoggedInActions } from "../redux/user"

export function Login() {
    const redirectPage = useRouteQuery().r
    const dispatch = useDispatch()

    return (
        <>
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
        </>
    )
}

function handleLogin(dispatch: Dispatch, redirectPage?: string) {
    dispatch(LoggedInActions.loggedInChanged(true))
    dispatch(RouterActions.navigate(redirectPage ? redirectPage : Routes.Home()))
}
