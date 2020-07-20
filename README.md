# Redux Router

Redux Router is a simple page router built for handling page navigation via Redux.

# Documentation
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](docs/api.md)
- [Guides](docs/guides.md)
- [Example Project](example/)
- [Example Project Demo](https://ethossoftworks.github.io/redux-router/example/index.html)
- [Release Notes](docs/release-notes.md)

# Features
- Typed routes
- Page title support
- Animation support

# Motivation
There are several popular routing libraries built for React and Redux that are great. However, two things commonly found in other routing libraries frustrated me:
1. String path matching for route rendering as opposed to strictly typed Route objects.
2. Externally stored location state
3. Lack of typed parameters for routes

Redux Router is my attempt to solve those problems and make page routing in an SPA as developer-friendly as possible.

# Installation
`redux-router` can be installed using NPM or Yarn. The scripts provided by the NPM package are UMD scripts and will also work as script tags.

## With Package Manager
```bash
yarn add @ethossoftworks/redux-router
```

## With Script Tags
You can find the scripts in either the NPM package or from [releases](https://github.com/ethossoftworks/redux-router/releases).
Only the `core` script is necessary. The `components` script adds components and hooks for usage with React.

***Note: If loading both scripts, the `core` script must be loaded before the `components` script. The `components` script depends on the `core` script.***
```html
<script src="redux-router.core.js"></script>
<script src="redux-router.components.js"></script>
<script>
    // ReduxRouter.core
    // ReduxRouter.components
</script>
```

# Usage

## 1. Create Some Routes
Routes are created with the `route()` function. The `route()` function specifies the path match (this is the only place you will have to use path matches), the data creator, and an optional title creator. Don't worry about specifying the type on your `Routes` object, TypeScript type inference works really well here.

```typescript
// Routes.ts
import { route } from "@ethossoftworks/redux-router"

export const Routes = {
    Home: route({
        path: "/",
    }),
    Articles: route({
        path: "/articles",
        title: () => `Articles`,
    }),
    Article: route({
        path: "/articles/:articleId",
        data: (articleId: number) => ({ params: { articleId: articleId.toString() } }),
        title: (data) => `Article ${data.params.articleId}`,
    }),
}
```

## 2. Initialize the Router Middleware and Add the Router Reducer
To use Redux Router you need to create the middleware using `createRouterMiddleware()` and run the `init()` method after `createStore()` has been called. The `init()` function initializes the router state with the current route.

You will also need to add the Router Reducer to your reducer. You may use any name for the router reducer in your application state as long as the proper key is passed into `createRouterMiddleware()`.

```typescript
// Store.ts
import { RouterState, createRouterMiddleware } from "@ethossoftworks/redux-router"
import { createStore, combineReducers, applyMiddleware } from "redux"
import { Routes } from "./Routes"

export type AppState = {
    router: RouterState
}

function configureStore() {
    const router = createRouterMiddleware<AppState>(Routes, "router")
    const store = createStore(
        combineReducers({ router: router.reducer }),
        applyMiddleware(router.middleware)
    )
    router.init()
    return store
}

export const store = configureStore()
```

## 3. Render a Page
All that's left is to render a page based on the current route! This can be done with a React components or more standard JS control structures.

### React Components
```tsx
// App.ts
import React from "react"
import { Routes } from "./Routes"
import { PageNotFound } from "@ethossoftworks/redux-router"
import { Route } from "@ethossoftworks/redux-router/components"

export function App() {
    return (
        <RouteSwitch>
            <Route matches={Routes.Home}>
                Home
            </Route>
            <Route matches={Routes.Articles}>
                Articles
            </Route>
            <Route matches={Routes.Article}>
                Article
            </Route>
            <Route matches={PageNotFound}>
                Page Not Found
            </Route>
        </RouteSwitch>
    )
}
```

### Vanilla JS
```typescript
// App.ts
import React from "react"
import { Routes } from "./Routes"
import { isRouteMatch, PageNotFound } from "@ethossoftworks/redux-router"

export function App() {
    const route = useRoute()

    if (isRouteMatch(route.item, Routes.Home)) {
        return "Home"
    } else if (isRouteMatch(route.item, Routes.Articles)) {
        return "Articles"
    } else if (isRouteMatch(route.item, Routes.Article)) {
        return "Article"
    } else if (isRouteMatch(route.item, PageNotFound)) {
        return "Page Not Found"
    }
}
```

## 4. Navigate To Another Page
Navigating to another page can be done by dispatching actions directly or by using the `Link` component

```tsx
import React from "react"
import { Routes } from "./Routes"
import { RouterActions } from "@ethossoftworks/redux-router"
import { Link } from "@ethossoftworks/redux-router/components"

function Home() {
    const dispatch = useDispatch()

    return (
        <>
            <Link to={Routes.Article(1)}></Link>
            <Button onClick={() => dispatch(RouterActions.navigate(Routes.Article(1)))}>
        </>
    )
}
```

# Additional Documentation
For addition documentation, please read the [guides](docs/guides.md) and [api](docs/api.md) documentation