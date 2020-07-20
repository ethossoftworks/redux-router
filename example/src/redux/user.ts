import { isLoggedIn, setLoggedIn } from "../util"
import { AnyAction } from "redux"

export type LoggedInState = boolean

export const LoggedInActions = {
    loggedInChanged: (loggedIn: boolean) => {
        // DON'T DO THIS. It's late and I'm lazy. Just imagine this is a thunk or saga or whatever side effect library floats your boat.
        setLoggedIn(loggedIn)

        return { type: "LOGGED_IN_CHANGED", loggedIn }
    },
}

export const loggedInReducer = (state: LoggedInState = isLoggedIn(), action: AnyAction): LoggedInState => {
    switch (action.type) {
        case "LOGGED_IN_CHANGED":
            return action.loggedIn
    }
    return state
}
