import React from "react"
import { isLoggedIn, setLoggedIn } from "../util"
import { useDispatch } from "react-redux"
import { RouterActions } from "@ethossoftworks/redux-router"
import { Routes } from "../Routes"

export function Header() {
    const dispatch = useDispatch()

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
