import { route } from "@ethossoftworks/redux-router"

export const Routes = {
    Home: route({
        path: "/",
    }),
    Articles: route({
        path: "/articles",
        meta: { transitionKey: "articles" },
    }),
    Article: route({
        path: "/articles/:articleId",
        meta: { transitionKey: "articles" },
        data: (articleId: string) => ({ params: { articleId } }),
    }),
    Login: route({
        path: "/login",
        data: (url?: string) => ({ query: { ...(url ? { r: url } : {}) } }),
    }),
}

export const AuthRoutes = [Routes.Article, Routes.Articles]
