import { runTests, TestGroup } from "@ethossoftworks/knock-on-wood"
import { createRouterMiddleware } from "./middleware"
import { createRouteForRouterState, PageNotFound, Route, createRouteForData, route, RouteItem } from "./route"
import { testLocation } from "./location"
import { createStore, combineReducers, applyMiddleware, Store } from "redux"
import { RouterState, RouterActions } from "./reducer"
;(global as any).window = {
    addEventListener: () => {},
}

const ORIGIN = "https://example.com"

const Routes = {
    Static: route("/one/two/three"),
    Param: route("/items/:id", (id: string) => ({ params: { id } })),
    StaticMutliParamMatch: route("/items/test/notes/test2"),
    MultiParam: route("/items/:itemId/notes/:noteId", (itemId: string, noteId: string) => ({
        params: { itemId, noteId },
    })),
}

export type TestState = {
    router: RouterState
}

function configureStore(startPath: string) {
    const router = createRouterMiddleware<TestState>(Routes, "router", testLocation(new URL(startPath, ORIGIN)))
    const store = createStore(combineReducers({ router: router.reducer }), applyMiddleware(router.middleware))
    router.init()
    return store
}

const defaultLocation = testLocation(new URL("/", ORIGIN))

const Tests: TestGroup<void> = {
    context: undefined,
    tests: {
        testRouteParsing: async ({ assert }) => {
            let store: Store
            let route: Route

            store = configureStore("/one/two/three")
            assertRoute(store, Routes.Static, "Static match failed")

            store = configureStore("/items/456")
            assertRoute(store, Routes.Param, "Param match failed")

            store = configureStore("/items")
            assertRoute(store, PageNotFound, "Page not found failed")

            store = configureStore("/items/")
            assertRoute(store, PageNotFound, 'Trailing "/" failed')

            store = configureStore("/items/24/notes/45")
            assertRoute(store, Routes.MultiParam, "Multi param match failed")
            route = createRouteForRouterState(store.getState().router)
            assert(route.data.params.itemId === "24", "Item id parameter was incorrectly parsed")
            assert(route.data.params.noteId === "45", "Note id parameter was incorrectly parsed")

            store = configureStore("/items/test/notes/test2")
            assertRoute(store, Routes.StaticMutliParamMatch, "Route precedence failed")

            store = configureStore("/one/two/three?test=45&test2=46#testHash")
            route = createRouteForRouterState(store.getState().router)
            assertRoute(store, Routes.Static, "Route parsing failed with query and hash")
            assert(route.data.query.test === "45" && route.data.query.test2 === "46", "Query parsing failed")
            assert(route.data.hash === "#testHash", "Hash parsing failed")
        },
        testRouteCreation: async ({ assert }) => {
            let route: Route

            route = createRouteForData(defaultLocation, Routes, Routes.Static())
            assert(route.type === Routes.Static)
        },
        testRouterActions: async ({ assert }) => {},
        testReducer: async ({ assert }) => {},
    },
}

function assertRoute(store: Store, type: RouteItem, message: string) {
    const route = createRouteForRouterState(store.getState().router)
    if (route.type !== type) {
        throw message
    }
}

runTests(Tests).catch((e) => {})
