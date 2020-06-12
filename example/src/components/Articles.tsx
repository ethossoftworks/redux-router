import React from "react"
import { Page } from "./Page"
import { Link } from "@ethossoftworks/redux-router/components"
import { Routes } from "../Routes"
import { Modal } from "./Modal"
import { useDispatch } from "react-redux"
import { RouterActions, useRouteMatch } from "@ethossoftworks/redux-router"
import { TransitionStatus } from "react-transition-group/Transition"

export function Articles({ transition }: { transition: TransitionStatus }) {
    const dispatch = useDispatch()
    const articleMatch = useRouteMatch(Routes.Article)

    return (
        <Page className="page--articles">
            <h1>Articles</h1>
            {[...Array(5)].map((_, i) => (
                <div key={i}>
                    <Link to={Routes.Article((i + 1).toString())}>Article {i + 1}</Link>
                </div>
            ))}
            <Modal
                open={articleMatch !== null}
                showClose={true}
                onClose={() => dispatch(RouterActions.navigate(Routes.Articles()))}
            >
                Hello {articleMatch?.data.params.articleId}
            </Modal>
        </Page>
    )
}
