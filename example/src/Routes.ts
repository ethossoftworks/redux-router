import { route } from "@ethossoftworks/redux-router"

const defaultTitle = "Redux Router Example"

export const Routes = {
    Home: route({
        path: "/",
        title: () => defaultTitle,
    }),
    Articles: route({
        path: "/articles",
        meta: { transitionKey: "articles" },
        title: () => `${defaultTitle} - Articles`,
    }),
    Article: route({
        path: "/articles/:articleId",
        data: (articleId: string) => ({ params: { articleId } }),
        title: (data) => `${defaultTitle} - Article ${data.params.articleId}`,
        meta: { transitionKey: "articles" },
    }),
    Login: route({
        path: "/login",
        data: (url?: string) => ({ query: { ...(url ? { r: url } : {}) } }),
        title: () => `${defaultTitle} - Login`,
    }),
}
