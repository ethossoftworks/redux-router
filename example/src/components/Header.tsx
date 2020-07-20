import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RouterActions } from "@ethossoftworks/redux-router"
import { Routes } from "../Routes"
import { AppState } from "../redux/store"
import { LoggedInActions } from "../redux/user"

export function Header() {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector((state: AppState) => state.loggedIn)

    return (
        <div className="header">
            <div className="header-title" onClick={() => dispatch(RouterActions.navigate(Routes.Home()))}>
                Redux Router Example
            </div>
            {isLoggedIn && (
                <div
                    className="logout-button"
                    onClick={() => {
                        dispatch(LoggedInActions.loggedInChanged(false))
                        dispatch(RouterActions.navigate(Routes.Home()))
                    }}
                >
                    Logout
                </div>
            )}
        </div>
    )
}
