import ReactDOM from "react-dom"
import React from "react"
import { Provider } from "react-redux"
import { store } from "./redux/store"

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
)

export function App() {
    return <div className="section-cont"></div>
}
