# Api
* [Core API](#Core-API)
    * [route](#route)
    * [createRouterMiddleware](#createRouterMiddleware)
    * [isRouteMatch](#isRouteMatch)
* [Utility Functions](#Utility-Functions)
    * [createPathForRoute](#createPathForRoute)
    * [createRouteForData](#createRouteForData)
    * [createRouteForPath](#createRouteForPath)
    * [createRouteForRouterState](#createRouteForRouterState)
* [Route Constants](#Route-Constants)
    * [PageNotFound](#PageNotFound)
    * [Uninitialized](#Uninitialized)
* [RouterActions](#RouterActions)
    * [back](#back)
    * [forward](#forward)
    * [navigate](#navigate)
* [Components](#Components)
    * [Link](#Link)
    * [Redirect](#Redirect)
    * [Route](#route-component)
    * [RouteSwitch](#RouteSwitch)
* [Hooks](#Hooks)
    * [useRoute](#useRoute)
    * [useRouteHash](#useRouteHash)
    * [useRouteMatch](#useRouteMatch)
    * [useRouteParams](#useRouteParams)
    * [useRouteQuery](#useRouteQuery)
* [Types](#Types)
    * [RouterLocation](#RouterLocation)
    * [RouterState](#RouterState)
    * [Route](#route-type)
    * [RouteMap](#RouteMap)
    * [RouteItem](#RouteItem)
    * [RouteData](#RouteData)
    * [RouteItemData](#RouteItemData)
* [Router Locations](#Router-Locations)
    * [browserLocation](#browserLocation)
    * [testLocation](#testLocation)

## Core API
### `route()`
```typescript
function route<T extends (...args: any) => Partial<RouteData>>(
    path: string,
    data?: T,
    meta?: Record<string, any>,
    title?: (data: RouteData) => string
): RouteItemCreatorReturn<T>

type RouteItemCreatorReturn<T extends (...args: any) => Partial<RouteData>> = T extends ([]) => Partial<RouteData>
    ? RouteItem<[]>
    : RouteItem<Parameters<T>>
```
Creates a route for use in a `RouteMap`. This is the function used to define your routes. See [Usage](/README.md).

&nbsp;
### `createRouterMiddleware()`
```typescript
function createRouterMiddleware<S>(routes: RouteMap, reducerKey: keyof S, location: RouterLocation = browserLocation): {
    middleware: Middleware
    reducer: Reducer<RouterState, RouterActions>
    init: () => void
}
```
Creates the router middleware object. See [Usage](/README.md).

&nbsp;
### `isRouteMatch()`
```typescript
function isRouteMatch(value: RouteItem, other: RouteItem | RouteItem[]): boolean
```
Compares two routes to check if the given `value` is of the same Route type as `other`.

#### Example
```typescript
isRouteMatch(Routes.Home, Routes.Home2 // false
```

&nbsp;
## Utility Functions
### `createPathForRoute()`
```typescript
function createPathForRoute(location: RouterLocation, route: Route): string
```
Creates a path string for a given route.

&nbsp;
### `createRouteForData()`
```typescript
function createRouteForData(location: RouterLocation, routes: RouteMap, itemData: RouteItemData): Route
```
Creates a route for a given `RouteData`

#### Example
```typescript
const route = createRouteForData(browserLocation, routes, Routes.Home())
```

&nbsp;
### `createRouteForPath()`
```typescript
function createRouteForPath(location: RouterLocation, routes: RouteMap, path: string): Route
```
Creates a routes for a given path.

&nbsp;
### `createRouteForRouterState()`
```typescript
function createRouteForRouterState(state: RouterState): Route
```
Creates a route for a given router state.


&nbsp;
## Route Constants
### `PageNotFound`
```typescript
const PageNotFound: Route
```
Route for a 404 Page Not Found error.

&nbsp;
### `Uninitialized`
```typescript
const Uninitialized: Route
```
The initial Route for the Router State before initialization.

&nbsp;
## RouterActions
### `back()`
```typescript
function back(): { type: RouterActionTypes.BACK }
```
Navigates to the previous route.

&nbsp;
### `forward()`
```typescript
function forward(): { type: RouterActionTypes.BACK }
```
Navigates to the next route if you have previously navigated back.

&nbsp;
### `navigate()`
```typescript
function navigate(route: RouteItemData | string, replace: boolean = false): {
    type: RouterActionTypes.NAVIGATE,
    replace: boolean
    route: Route
}
```
Navigate to a new route.
* `replace`: If true, the current route will be replaced and not pushed onto the history stack.


&nbsp;
## Components
### `Link`
```typescript
function Link(props: LinkProps): JSX.Element

type LinkProps = { to: RouteItemData | string } & React.AnchorHTMLAttributes<HTMLAnchorElement>
```
A component for generating links easily. See [Links/Anchor Tags](guides.md#linksanchor-tags).

&nbsp;
### `Redirect`
```typescript
function Redirect(props: RedirectProps): JSX.Element | null

export type RedirectProps = {
    to: RouteItemData | string
    condition?: boolean
    replace?: boolean
}
```
A component for redirecting declaratively. See [Redirecting](guides.md#redirecting).

&nbsp;
### `Route` {#route-component}
```typescript
function Route(props: RouteProps): JSX.Element | null

export type RouteProps = {
    children?: React.ReactNode
    matches: RouteItem | RouteItem[]
    route?: Route
}
```
The core component for rendering routes. See [Route Matching](#guides.md#route-matching).

&nbsp;
### `RouteSwitch`
```typescript
function RouteSwitch({ children, route: routeProp }: RouteSwitchProps): JSX.Element | null

export type RouteSwitchProps = {
    children?: React.ReactNode
    route?: Route
}
```
The component for exclusive route match rendering. See [Route Matching](#guides.md#route-matching).

&nbsp;
## Hooks
### `useRoute()`
```typescript
function useRoute(): Route
```
Get the current route.

&nbsp;
### `useRouteHash()`
```typescript
function useRouteHash(): String
```
Get the current route hash.

&nbsp;
### `useRouteMatch()`
```typescript
function useRouteMatch(matches: RouteItem | RouteItem[]): Route | null
```
Test if the current route matches a given route item or list of route items.

&nbsp;
### `useRouteParams()`
```typescript
function useRouteParams(): Record<string, string>
```
Get the parameters for the current route.

&nbsp;
### `useRouteQuery()`
```typescript
function useRouteQuery(): Record<string, string>
```
Get the query for the current route.

&nbsp;
## Types
### `RouterLocation`
```typescript
interface RouterLocation {
    push(path: string, title?: string): void // Push a new location onto the history stack
    replace(path: string, title?: string): void // Replace the current location onto the history stack
    back(): void // Go back in history
    forward(): void // Go forward in history

    origin(): string // Protocol + Host + Port
    path(): string // Full path beginning with "/"
    query(): string // Full query beginning with "?"
    hash(): string // Hash beginning with "#"
}
```
Provides the middleware the ability to know and change it's current location in history within the application. There are two inbuilt `RouterLocations`:
1. `browserLocation`: The default router location that uses the browser history API.
2. `testLocation`: A helper router location useful for testing.

&nbsp;
### `RouterState`
```typescript
type RouterState = {
    key: string
    url: string
    data: RouteData
    title: string | null
}
```
Represents the current state of the router middleware.
* `key`: The key defined in the `RoutMap` provided in `createRouterMiddleware()`
* `url`: The URL for the current route
* `data`: The `RouteData` for the current route
* `title`: The provided title for the current route

&nbsp;
### `Route` {#route-type}
```typescript
type Route = {
    key: string
    url: string
    item: RouteItem
    data: RouteData
    title: string | null
}
```
A fully realized route
* `key`: The key defined in the `RoutMap` provided in `createRouterMiddleware()`
* `item`: A reference to the RouteItem defined in the `RoutMap` provided in `createRouterMiddleware()`
* `url`: The URL for the current route
* `data`: The `RouteData` for the current route
* `title`: The provided title for the current route


&nbsp;
### `RouteMap`
```typescript
type RouteMap = Record<string, RouteItem>
```
A map of routes for the application.

&nbsp;
### `RouteItem`
```typescript
type RouteItem<T extends any[] = any[]> = ((...args: T) => RouteItemData) & {
    path: string
    id: Symbol
    meta: Record<string, any>
    title?: (data: RouteData) => string
}
```
An item of a `RouteMap`. Used to create instances of `RouteItemData`.

&nbsp;
### `RouteData`
```typescript
type RouteData = {
    params: Record<string, string>
    query: Record<string, string>
    hash: string
}
```
An object containing all of the variable data for a route.

&nbsp;
### `RouteItemData`
```typescript
type RouteItemData = RouteData & { id: Symbol }
```
The data generated from a `RouteItem`. It contains an `id` property that links it to the `RouteItem` it came from the RouteMap.

&nbsp;
## Router Locations
### `browserLocation`
```typescript
const browserLocation: RouterLocation
```
The default router location that uses the browser history API.

&nbsp;
### `testLocation`
```typescript
function testLocation(url: URL): RouterLocation
```
A helper router location useful for testing.