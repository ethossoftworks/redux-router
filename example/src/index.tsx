import ReactDOM from "react-dom"
import React from "react"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import { App } from "./components/App"

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
)
