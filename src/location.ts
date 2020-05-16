export interface Location {
    push(path: string, title?: string): void // Push a new location onto the history stack
    replace(path: string, title?: string): void // Replace the current location onto the history stack
    back(): void // Go back in history
    forward(): void // Go forward in history

    origin(): string // Protocol + Host + Port
    path(): string // Full path beginning with "/"
    query(): string // Full query beginning with "?"
    hash(): string // Hash beginning with "#"
}

export const browserLocation: Location = Object.freeze({
    push: (path: string, title: string = "") => history.pushState(null, title, path),
    replace: (path: string, title: string = "") => history.replaceState(null, title, path),
    back: () => history.back(),
    forward: () => history.forward(),

    origin: () => location.origin,
    path: () => location.pathname,
    query: () => location.search,
    hash: () => location.hash,
})
