# Guides
- [Core Concepts](#core-concepts)
- [Using Route Parameters]()
- [Using Page Titles]()
- [Route Matching]()
- [Components]()
- [Redirecting]()
- [Animations]()

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
- Automatically parsed and encoded components
# Titles
# 404 Page Not Found
# Components
- Multiple matches per route
# Redirects
# Animations