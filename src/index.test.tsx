import { runTests, TestGroup } from "@ethossoftworks/knock-on-wood"
import { createRouterMiddleware } from "./middleware"
import {
    createRouteForRouterState,
    PageNotFound,
    Route,
    createRouteForData,
    route,
    RouteItem,
    Uninitialized,
} from "./route"
import { testLocation, RouterLocation, browserLocation } from "./location"
import { createStore, combineReducers, applyMiddleware, Store } from "redux"
import { RouterState, RouterActions } from "./reducer"
import ReactDOM from "react-dom"
import React from "react"
import { Link } from "./components"
import { Provider } from "react-redux"

const ORIGIN = "https://example.com"

const Routes = {
    Home: route({ path: "/" }),
    Static: route({
        path: "/one/two/three",
    }),
    Param: route({
        path: "/items/:id",
        data: (id: string) => ({ params: { id } }),
    }),
    StaticMutliParamMatch: route({
        path: "/items/test/notes/test2",
    }),
    MultiParam: route({
        path: "/items/:itemId/notes/:noteId",
        data: (itemId: string, noteId: string) => ({ params: { itemId, noteId } }),
    }),
    Query: route({
        path: "/query",
        data: (test: string, test2: string) => ({ query: { test, test2 } }),
    }),
    Hash: route({
        path: "/hash",
        data: (test: string) => ({ hash: test }),
    }),
    ParamAndQueryAndHash: route({
        path: "/items/:itemId/notes/:noteId",
        data: (itemId: string, noteId: string, query1: string, query2: string, hash: string) => ({
            params: { itemId, noteId },
            query: { query1, query2 },
            hash,
        }),
    }),
}

export type TestState = {
    router: RouterState
}

function configureStore(startPath: string, location: RouterLocation = testLocation(new URL(startPath, ORIGIN))) {
    const router = createRouterMiddleware<TestState>(Routes, "router", location)
    const store = createStore(combineReducers({ router: router.reducer }), applyMiddleware(router.middleware))
    router.init()
    return store
}

const defaultLocation = testLocation(new URL("/", ORIGIN))

const TestApp = (props: { store: Store; children: React.ReactNode }) => (
    <Provider store={props.store}>{props.children}</Provider>
)

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
            route = createRouteForRouterState(store.getState().router)
            assert(route.key === "@PageNotFound", "PageNotFound key not properly set")

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

            store = configureStore("/one/two/three?test=It%27s+a+test%25")
            route = createRouteForRouterState(store.getState().router)
            assert(route.data.query.test === "It's a test%", "Did not decode url parameters")
        },
        testRouteCreation: async ({ assert }) => {
            let route: Route

            route = createRouteForData(defaultLocation, Routes, Routes.Static())
            assert(route.item === Routes.Static, "Static RouteItem doesn't match")
            assert(route.item !== Routes.MultiParam, "Ids are not unique")
            assert(route.key === "Static", "Static route has incorrect key")
            assert(route.url === "/one/two/three", "Static Route url doesn't match")

            route = createRouteForData(defaultLocation, Routes, Routes.MultiParam("item1", "note2"))
            assert(route.item === Routes.MultiParam, "MultiParam RouteItem doesn't match")
            assert(route.key === "MultiParam", "MultiParam route has incorrect key")
            assert(route.url === "/items/item1/notes/note2", "MultiParam Route url doesn't match")
            assert(route.data.params.itemId === "item1", "Did not create route param object correctly")
            assert(route.data.params.noteId === "note2", "Did not create route param object correctly")

            route = createRouteForData(defaultLocation, Routes, Routes.Query("It's a test%", "yep"))
            assert(route.url === "/query?test=It%27s+a+test%25&test2=yep", "Did not properly encode query items")
            assert(route.data.query.test === "It's a test%", "Did not create route query object correctly")
            assert(route.data.query.test2 === "yep", "Did not create route query object correctly")

            route = createRouteForData(defaultLocation, Routes, Routes.Hash("this is another test"))
            assert(route.url === "/hash#this%20is%20another%20test")
            assert(route.data.hash === "this is another test")
        },
        testIncorrectReducerKey: async ({ fail }) => {
            try {
                const router = createRouterMiddleware(Routes, "blah", testLocation(new URL("/", ORIGIN)))
                createStore(combineReducers({ router: router.reducer }), applyMiddleware(router.middleware))
                router.init()
                fail("Reducer key check didn't fail")
            } catch (e) {
                if (e.indexOf("Redux Router") === -1) {
                    fail("Reducer key check didn't throw correct error")
                }
            }
        },
        testRouterActions: async ({ assert }) => {
            let store: Store
            let location: RouterLocation

            location = testLocation(new URL("/", ORIGIN))
            store = configureStore("/", location)
            store.dispatch(RouterActions.navigate(Routes.MultiParam("one", "two")))
            assert(location.path() === "/items/one/notes/two")
            store.dispatch(RouterActions.back())
            assert(location.path() === "/")
            store.dispatch(RouterActions.forward())
            assert(location.path() === "/items/one/notes/two")
            store.dispatch(RouterActions.navigate(Routes.Static(), true))
            store.dispatch(RouterActions.back())
            assert(location.path() === "/")
        },
        testReducer: async ({ assert }) => {
            let newState: RouterState = { key: Uninitialized.key, url: "", data: Uninitialized() }
            const router = createRouterMiddleware<TestState>(Routes, "router", testLocation(new URL("/", ORIGIN)))
            createStore(combineReducers({ router: router.reducer }), applyMiddleware(router.middleware))
            router.init()

            newState = router.reducer(
                { key: Uninitialized.key, url: "", data: Uninitialized() },
                RouterActions.navigate(Routes.Static())
            )
            assert(newState.key === "Static", "Incorrect key property in reducer state")
            assert(newState.url === "/one/two/three", "Incorrect path in reducer state")

            newState = router.reducer(
                { key: Uninitialized.key, url: "", data: Uninitialized() },
                RouterActions.navigate(Routes.MultiParam("itemOne", "noteTwo"))
            )
            assert(newState.key === "MultiParam", "Incorrect key property in reducer state")
            assert(newState.url === "/items/itemOne/notes/noteTwo", "Incorrect path in reducer state")
            assert(newState.data.params["itemId"] === "itemOne" && newState.data.params["noteId"] === "noteTwo")

            newState = router.reducer(
                { key: Uninitialized.key, url: "", data: Uninitialized() },
                RouterActions.navigate(Routes.Query("blah1", "blah2"))
            )
            assert(newState.key === "Query", "Incorrect key property in reducer state")
            assert(newState.url === "/query?test=blah1&test2=blah2", "Incorrect path in reducer state")
            assert(newState.data.query["test"] === "blah1" && newState.data.query["test2"] === "blah2")

            newState = router.reducer(
                { key: Uninitialized.key, url: "", data: Uninitialized() },
                RouterActions.urlChanged("/query?test=blah1&test2=blah2")
            )
            assert(newState.key === "Query", "Incorrect key property in reducer state")
            assert(newState.url === "/query?test=blah1&test2=blah2", "Incorrect path in reducer state")
            assert(newState.data.query["test"] === "blah1" && newState.data.query["test2"] === "blah2")
        },
        testLinkComponent: async ({ assert }) => {
            const store = configureStore("/", browserLocation)
            store.dispatch(RouterActions.navigate(Routes.Home()))

            ReactDOM.render(
                <TestApp store={store}>
                    <Link id="link" to={Routes.ParamAndQueryAndHash("item1", "note2", "%test", "test2", "hashTest")}>
                        Test Link
                    </Link>
                </TestApp>,
                document.getElementById("root")
            )
            ;(document.querySelector("#link") as HTMLElement).click()

            assert(
                (document.querySelector("#link") as HTMLAnchorElement).href ===
                    location.origin + "/items/item1/notes/note2?query1=%25test&query2=test2#hashTest",
                "Incorrect href for Link component"
            )
            assert(location.pathname === "/items/item1/notes/note2", "Incorrect pathname after clicking Link component")
            assertRoute(store, Routes.ParamAndQueryAndHash, "State did not update for Link component")
        },
        testRouteComponent: async ({ assert }) => {},
        testRedirectComponent: async ({ assert }) => {},
        testSwitchComponent: async ({ assert }) => {},
        testHooks: async ({ assert }) => {},
    },
}

function assertRoute(store: Store, item: RouteItem, message: string) {
    const route = createRouteForRouterState(store.getState().router)
    if (route.item !== item) {
        throw message
    }
}

runTests(Tests).catch((e) => {})
