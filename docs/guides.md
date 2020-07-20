# Guides
- [Core Concepts](#core-concepts)
- [Route Parameters](#route-parameters)
- [Route Matching](#route-matching)
- [Redirecting](#redirecting)
- [Handling 404s](#handling-404s)
- [Page Titles](#page-titles)
- [Links/Anchor Tags](#linksanchor-tags)
- [Animations](#animations)


# Core Concepts
There are a few primary types used by Redux Router: `Route`, `RouteItem`, and `RouteData`. They are all closely related but serve different purposes.

## Route
`Route` is the primary data type used when consuming the route in a component. You can think of `Route` as the fully realized location in your app. It contains a reference to the `RouteItem` that created it, the URL that the route responded to, the parsed data contained in the path, the key identifying the `Route` in the `RouteMap` provided to the middleware, and the generated page title for the route (if provided). In practice, you don't need to worry about these types. They exist only to satisfy type constraints and the desired API syntax.

## Route Item
`RouteItem` represents a member of the `RouteMap` provided to the middleware. A `RouteItem` is responsible for defining the path the route will respond to, the route data creator, the route title creator, and any additional metadata you wish to use. The two main purposes of a `RouteItem` is to:
1. Provide a type-safe, simple route creator (with typed parameters) for use in `RouterActions` or Redux Router components
2. Provide a type-safe, simple route identifier for use throughout the app

Every `RouteItem` is a function that also has properties assigned to it. This allows you to call the `RouteItem` as a function for use as a route while also allowing you to use it as a route identifier.

## Route Data
`RouteData` is the parsed data contained in the URL. This includes any path segment parameters, query parameters, or provided hashes.

## Router State
`RouterState` is the same as `Route` type without the `item` property. The `item` property is not serializable so I omitted it from the state.

## Route Item Data
`RouteItemData` is the same as `RouteData` with an additional `id` property so it can be mapped back to a `RouteItem`. All `RouteItem` functions return `RouteItemData`.

&nbsp;
# Route Parameters
You may use route parameters/variables in your routes for dynamic URLs. For example, the route path `/users/:userId` would match both `/users/bob` and `users/jan` and a `userId` parameter would be included in the `params` property of the route's route data. You may use as many parameters as you would like, just be careful of having static (non-paramaterized) routes that would also match your dynamic routes. Here are some examples:

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

***Note: The parameter placeholder name is specifically used to parse a URL and populate the RouteData `params` object; so make sure that the `data()` function in your RouteItem generates the same name parameter that will be parsed by a URL. For example:***

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

In this example, both `GoodArticle` and `BadArticle` will allow you to route to them with components and actions and also have the `articleId` property in the params object. However, if you manually change the URL in your browser to be `https://example.com/bad-articles/this-is-one-bad-article`, the `params` property in your router state will contain an `articleName` property. **It is up to you to make sure your generated `RouteData` properties match your `RouteItem's` path parameter names.**

### Special Characters
An important feature of route parameters is that all parameters are automatically encoded and decoded for you. You may pass any string into your Routes `params` object or in the browser location bar. Redux Router will encode and decode each instance appropriately.

&nbsp;
# Route Matching
You may match a route 3 main ways:
1. If/else conditions
2. The `<Route>` component
3. The `<RouteSwitch>` component

## Matching with if/else
While possible, this is probably the clunkiest way to match routes. But sometimes, the it might be simpler to implement logic using basic control structures.

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
Using the `<RouteSwitch>` component probably the main way you will want to handle routing in your app. `<RouteSwitch>` is identical to `<Route>` with the exception that **`<RouteSwitch>` will only render the first route match**. All other routes will be ignored. There is also a slight performance enhancement using `<RouteSwitch>` because only one subscription is made to the redux store.

`<RouteSwitch>` will only pay attention to components that have a `matches` property passed to them. This allows you to extend the `<Route>` component if you need to.

```tsx
import { RouteSwitch, Route } from "@ethossoftworks/redux-router/components"

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

&nbsp;
# Redirecting
Redirecting can be achieved in one of two ways:
1. Calling `RouterActions.navigate()`
2. Using the `<Redirect />` Component

## Redirecting with `RouterActions.navigate()`
You may use `RouterActions.navigate()` from anywhere to immediately navigate/redirect to another route. If you would like the current page to be replaced (i.e. a transparent redirect) you may pass `true` for the `replace` option in `RouterActions.navigate()`. The `replace` option will prevent the original page from being added to the history stack.

## Redirecting with `<Redirect />`
Sometimes it's easier to use a component to redirect. Redux Router comes with the `<Redirect />` component for this purpose. The `<Redirect />` component dispatches the `RouterActions.navigate()` action for you when it is rendered. There are optional parameters for a `condition` and for `replace`. The `condition` parameter is a parameter that will prevent the component from rendering unless it is true.

&nbsp;
# Handling 404s
Redux Router handles 404 errors with the special constant `RouteItem` `PageNotFound`. If you want to handle 404s in your app you can match with the `PageNotFound` constant.

```tsx
import { RouteSwitch, Route } from "@ethossoftworks/redux-router/components"
import { PageNotFound } from "@ethossoftworks/redux-router"

function MyApp() {
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
            <Route matches={PageNotFound}>
                <MyPageNotFound />
            </Route>
        </RouteSwitch>
    )
}
```

&nbsp;
# Page Titles
Redux Router supports automatic setting of page titles for your routes. If you provide the `title` parameter in your `RouteItem` the title will be automatically set when that route is rendered. The `title` parameter is a lambda that passes the current `RouteData` as a parameter. If you wish to handle page titles manually, you may ignore the `title` parameter completely.

```tsx
import { route } from "@ethossoftworks/redux-router"


export const Routes = {
    Home: route({
        path: "/",
        title: () => "Home",
    }),
    Articles: route({
        path: "/articles",
        title: () => "Articles",
    }),
    Article: route({
        path: "/articles/:articleId",
        data: (articleId: string) => ({ params: { articleId } }),
        title: (data) => `Article - ${data.params.articleId}`,
    })
}

```

&nbsp;
# Links/Anchor Tags
There are a few ways may generate links to routes in your app.
1. The `<Link />` component
2. The `createRouteForData()` function
3. Use standard HTML anchor tags

## Using the `<Link />` Component
Using the provided `<Link />` component is simple. You may pass either a string or `RouteItemData`. Using `RouteItemData` is preferred as it is type safe and allows you to change your routes easily in the future. The `<Link />` component creates a valid anchor tag and hijacks the click listener to use `RouterActions.navigate()`.

```tsx
import { Link } from "@ethossoftworks/redux-router/components"

function MyComponent() {
    return (
        <div>Click <Link to={Routes.Articles()}>Here</Link>
    )
}
```

## Using `createRouteForData()`
`createRouteForData()` is a convenience function that creates a `Route` for a given `RouteItemData`. You can then use the route's `url` property. The `<Link />` component uses `createRouteForData()` under-the-hood to generate anchor tags.

```tsx
import { createRouteForData } from "@ethossoftworks/redux-router"

function MyComponent() {
    return (
        <div>Click <a href={createRouteForData(Routes.Articles()).url}>Here</a>
    )
}
```

## Standard HTML Anchor Tag
Redux Router supports standard anchor tags as well. Although this method is not as easily refactored, it works exactly like typing a URL into your browser.

```tsx
import { createRouteForData } from "@ethossoftworks/redux-router"

function MyComponent() {
    return (
        <div>Click <a href="/articles">Here</a>
    )
}
```

&nbsp;
# Animations
Redux Router supports animations. For a complete example you can view the [Example Project](../example/). A simple example is provided below:

___App.tsx___
```tsx
import { RouteSwitch } from "@ethossoftworks/redux-router/components"
import { route } from "@ethossoftworks/redux-router"

function MyApp() {
    const route = useRoute()

    return (
        <TransitionGroup className="page-cont">
            <CSSTransition
                classNames="page-wrapper"
                timeout={250}
                appear={true}
                key={route.key}
            >
                <RouteSwitch route={route}>
                    <Route matches={Routes.Home}>
                        <Home />
                    </Route>
                    <Route matches={Routes.Articles}>
                        <Articles />
                    </Route>
                    <Route matches={PageNotFound}>
                        <NotFound />
                    </Route>
                </RouteSwitch>
            </CSSTransition>
        </TransitionGroup>
    )
}
```

___main.css___
```css
.page-cont {
    display: grid;
}
.page-wrapper {
    grid-row: 1;
    grid-column: 1;
    position: relative;
    min-height: 100vh;
    background: var(--bg-color);
}
.page-wrapper-enter, .page-wrapper-appear {
    opacity: 0;
    transform: translate3d(0, -10px, 0);
}
.page-wrapper-enter-active, .page-wrapper-appear-active, .page-wrapper-enter-done, .page-wrapper-appear-done {
    transform: translate3d(0, 0px, 0);
    opacity: 1;
    position: relative;
    z-index: 1;
    transition: opacity ease 250ms, transform ease 250ms;
}
```

Here's a breakdown of the core components:
1. Use `const route = useRoute()` to be able to force the `RouteSwitch` component to render for a specific route. This is because there will be two different routes visible at the same time; one animating out and one animating in. They each need to render with their own `route` property. The `TransitionGroup` and `CSSTransition` components maintains the original `route` property that was set during the initial render.
2. Set the `appear` property to `true` on the `CSSTransition` component so that the enter animation plays when the page is refreshed. This is optional.
3. Set the `key` property to the route's unique key. **The `CSSTransition` must have a unique key in order to work.**
4. Set the `route` property on the `RouteSwitch` component as discussed in point `1`.

Once those elements are in place, your page animations should be working smoothly.

## Gotchas with animations
### State Access
Multiple routes will render at the same time with different route parameters passed in. If you are using hooks in your page components, make sure that the data you access will still exist for both page components under transition.
### Redirecting
* When using the `<Redirect />` component, make sure it’s the only component returned otherwise the rest of the component will be rendered for a short time (this may be acceptable in certain circumstances)
* Redirection should only happen once. This can be achieved by using the `<Redirect />` component or by using hooks
* Redirecting on page enter needs to happen at the `TransitionGroup` level

Here are a few common redirection attempts with animations and why they don't work:
### Component Redirection
```tsx
function MyComponent() {
    if (isLoggedIn()) {
        return <Redirect to={Routes.Home()} />
    }

    // ...
}
```
__Problems__:
* Will override another redirect within the same page when the condition is met because the redirect component will mount for the first time when the condition is true.

&nbsp;
```tsx
function MyComponent() {
    return (
        <div>
            <Redirect to={Routes.Home()} condition={isLoggedIn()} />
            {/* .... */}
        </div>
    )
}
```
__Problems__:
* Will override another redirect within the same page when the condition is met because the redirect component will mount for the first time when the condition is true.

&nbsp;
```tsx
function MyComponent() {
    const [hasRedirected, setHasRedirected] = useState(false)

    if (isLoggedIn() && !hasRedirected) {
        setHasRedirected(true)
        return <Redirect to={Routes.Home()} />
    } else if (isLoggedIn() && hasRedirected) {
        return null
    }
}
```

__Problems__
* No exit animation
* Does not work when reloading the page

### Hook Redirection
```tsx
function MyComponent() {
    useEffect(() => {
        if (isLoggedIn()) {
            dispatch(RouterActions.navigate(Routes.Home(), true))
        }
    }, [])

    if (isLoggedIn()) {
        return null
    }
}
```
__Problems__
* No exit animation
