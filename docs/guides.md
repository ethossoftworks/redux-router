# Guides
- [Core Concepts](#core-concepts)
- [Route Parameters](#route-parameters)
- [Route Matching](#route-matching)
- [Redirecting](#redirecting)
- [Handling 404s](#handling-404s)
- [Page Titles](#page-titles)
- [Components](#components)
- [Animations](#animations)


# Core Concepts
There are a few primary types used by Redux Router: `Route`, `RouteItem`, and `RouteData`. They are all closely related but serve different purposes.

## Route
`Route` is the primary data type used when consuming the route in a component. You can think of `Route` as the fully realized location in your app. It contains a reference to the `RouteItem` that created it, the URL that the route responded to, the parsed data contained in the path, the key identifying the `Route` in the `RouteMap` provided to the middleware, and the generated page title for the route.

## Route Item
`RouteItem` represents a member of the `RouteMap` provided to the middleware. A `RouteItem` is responsible for defining the path the route will respond to, the route data creator, the route title creator, and any additional meta data you wish to use. The two main purposes of a `RouteItem` is to:
1. Provide a type-safe, simple route creator for use in `RouterActions` or Redux Router components
2. Provide a type-safe, simple route identifier for use throughout the app

## Route Data
`RouteData` is simply the parsed data contained in the URL. This includes any path segment parameters, query parameters, or provided hashes.

## Router State
`RouterState` is the exact same as `Route` without the `item` property. The `item` property is not serializable so I removed it from the state.

## Route Item Data
`RouteItemData` is the exact same as `RouteData` with an additional `id` property so it can be mapped back to a `RouteItem`. All `RouteItem` functions return `RouteItemData`.


# Route Parameters
You may use route parameters/variables in your routes for dynamic URLs. For example, the route path `/users/:userId` would match both `/users/bob` and `users/jan` and a `userId` parameter would be included in the `params` property of the route's route data. You may use as many parameters as you would like, just be careful of having static routes that would also match your dynamic routes. Here are some examples:

```typescript
export const Routes = {
    Articles: route({
        path: "/articles",
    }),
    Article: route({
        path: "/articles/:articleId",
        data: (articleId: string) => ({ params: { articleId } }),
    }),
    ArticleComments: route({
        path: "/articles/:articleId/comments",
        data: (articleId: string) => ({ params: { articleId } }),
    }),
    ArticleComment: route({
        path: "/articles/:articleId/comments/:commentId",
        data: (articleId: string) => ({ params: { articleId, commentId } }),
    }),
}
```

It is important to note that the parameter placeholder name is specifically used to parse a URL and populate the RouteData `params` object; so make sure that the `data()` function in your RouteItem generates the same name parameter that will be parsed by a URL. For example:

```typescript
export const Routes = {
    GoodArticle: route({
        path: "/good-articles/:articleId",
        data: (articleId: string) => ({ params: { articleId }})
    }),
    BadArticle: route({
        path: "/bad-articles/:articleName",
        data: (articleId: string) => ({ params: { articleId }}) // Note how `articleId` does not match `:articleName`
    }),
}
```

In this example, both `GoodArticle` and `BadArticle` will allow you to route to them with components and actions and also have the `articleId` property in the params object. However, if you manually change the URL in your browser to be `https://example.com/bad-articles/this-is-one-bad-article`, the `params` property in your router state will contain an `articleName` property. It is up to you to make sure your generated `RouteData` properties match your `RouteItem's` path parameters.

### Special Characters
An important feature of route parameters is that all parameters are automatically encoded and decoded for you. You may pass any string into your Routes `params` object or in the browser location bar. Redux Router will encode and decode each instance appropriately.


# Route Matching
You may match a route 3 main ways:
1. If else conditions
2. The `<Route>` component
3. The `<RouteSwitch>` component

## Matching with if/else
While possible, this is probably the clunkiest way to match routes. But sometimes, the logic might be more simply implemented using basic control structures.

```tsx
import { isRouteMatch } from "@ethossoftworks/redux-router"
import { useRoute } from "@ethossoftworks/redux-router/components"

function MyComponent() {
    const route = useRoute()

    if (route.item === Routes.Home) {
        return <Home />
    } else if (route.item === Routes.Articles) {
        return <Articles />
    }
}
```

## Matching with `<Route>`
Using the `<Route>` component is perfect for one-off route matches. The example below is a bit contrived, but the point is that each route is individually tested and rendered. The `Route` component also can take an array of `Routes` to match, allowing you to render a component if the route is any of the routes provided in the array.

```tsx
import { Route } from "@ethossoftworks/redux-router/components"

function MyComponent() {
    return (
        <Route matches={Routes.Home}>
            <Home />
        </Route>
        <Route matches={[Routes.Articles, Routes.Article]}>
            <ArticleHeader />
        </Route>
        <Route matches={Routes.Articles}>
            <Articles />
        </Route>
        <Route matches={Routes.Article}>
            <Article />
        </Route>
    )
}
```

## Matching with `<RouteSwitch>`
Using the `<RouteSwitch>` component probably the main way you will want to handle routing in your app. `<RouteSwitch>` is identical to `<Route>` with the exception that **it will only render the first route match**. Everything else will be ignored. There is also a slight performance enhancement using `<RouteSwitch>` because only one subscription is made to the store.

`<RouteSwitch>` will only pay attention to components that have a `matches` property passed to them. This allows you to extend the `<Route>` component if you need to.

```tsx
import { RouteSwitch } from "@ethossoftworks/redux-router/components"
import { Route } from "@ethossoftworks/redux-router/components"

function MyComponent() {
    return (
        <RouteSwitch>
            <Route matches={Routes.Home}>
                <Home />
            </Route>
            <Route matches={Routes.Articles}>
                <Articles />
            </Route>
            <Route matches={Routes.Article}>
                <Article />
            </Route>
        </RouteSwitch>
    )
}
```


# Redirecting


# Handling 404s


# Page Titles


# Components


# Animations