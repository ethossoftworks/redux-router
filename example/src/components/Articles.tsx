import React from "react"
import { Page } from "./Page"
import { Link } from "@ethossoftworks/redux-router/components"
import { Routes } from "../Routes"
import { Modal } from "./Modal"
import { useDispatch } from "react-redux"
import { RouterActions, useRouteMatch } from "@ethossoftworks/redux-router"

export function Articles() {
    const articleMatch = useRouteMatch(Routes.Article)

    return (
        <Page className="page--articles">
            <h1>Articles</h1>
            {[...Array(5)].map((_, i) => (
                <div key={i}>
                    <Link to={Routes.Article((i + 1).toString())}>Article {i + 1}</Link>
                </div>
            ))}
            <ArticleModal open={articleMatch !== null} articleId={articleMatch?.data.params.articleId || ""} />
        </Page>
    )
}

function ArticleModal({ articleId, open }: { articleId: string; open: boolean }) {
    const dispatch = useDispatch()

    return (
        <Modal
            id={articleId}
            open={open}
            showClose={true}
            onClose={() => dispatch(RouterActions.navigate(Routes.Articles()))}
        >
            This is article {articleId}.
            <br />
            Notice the URL changed when this modal opened.
            <br />
            <div>
                <Link to={Routes.Article("5")}>Article 5</Link>
            </div>
        </Modal>
    )
}
