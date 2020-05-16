import { createStore, combineReducers, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { createRouterMiddleware, RouterState } from "@ethossoftworks/redux-router"
import { Routes } from "../Routes"

export type AppState = {
    router: RouterState
}

function configureStore() {
    const router = createRouterMiddleware<AppState>(Routes, "router")
    const store = createStore(
        combineReducers({ router: router.reducer }),
        composeWithDevTools(applyMiddleware(router.middleware))
    )
    router.init()
    return store
}

export const store = configureStore()
