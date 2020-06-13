import React from "react"
import { setLoggedIn, isLoggedIn } from "../util"
import { useDispatch } from "react-redux"
import { RouterActions } from "@ethossoftworks/redux-router"
import { Routes } from "../Routes"
import { useRoute } from "@ethossoftworks/redux-router"

export function Header() {
    const dispatch = useDispatch()
    useRoute() // Force re-render on RouterAction because I'm too lazy to implement a true redux store for isLoggedIn() check

    return (
        <div className="header">
            <div className="header-title" onClick={() => dispatch(RouterActions.navigate(Routes.Home()))}>
                Redux Router Example
            </div>
            {isLoggedIn() && (
                <div
                    className="logout-button"
                    onClick={() => {
                        setLoggedIn(false)
                        dispatch(RouterActions.navigate(Routes.Home()))
                    }}
                >
                    Logout
                </div>
            )}
        </div>
    )
}
