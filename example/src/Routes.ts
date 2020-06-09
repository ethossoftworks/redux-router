import { route } from "@ethossoftworks/redux-router"

export const Routes = {
    Home: route({
        path: "/",
    }),
    Articles: route({
        path: "/articles",
    }),
    Article: route({
        path: "/articles/:articleId",
        data: (articleId: string) => ({ params: { articleId } }),
    }),
    Login: route({
        path: "/login",
    }),
}
