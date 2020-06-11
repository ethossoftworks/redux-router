export const atomicInt = (() => {
    let id = 0
    return () => id++
})()
