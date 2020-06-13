import { Action } from "redux"

export type ReduxActionCreator<T extends Record<string, (...args: any) => any>> = ReturnType<
    Extract<T[keyof T], (...args: any) => Action<string>>
>

export function isLoggedIn(): boolean {
    return localStorage.getItem("loggedIn") !== null
}

export function setLoggedIn(loggedIn: boolean) {
    loggedIn ? localStorage.setItem("loggedIn", "") : localStorage.removeItem("loggedIn")
}
