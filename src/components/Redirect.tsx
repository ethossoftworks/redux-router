import { useEffect } from "react"
import { RouteItemData } from "../route"
import { useDispatch } from "react-redux"
import { RouterActions } from "../reducer"

export type RedirectProps = {
    to: RouteItemData | string
    condition?: boolean
    replace?: boolean
}

export function Redirect({ to, condition, replace = true }: RedirectProps) {
    const dispatch = useDispatch()

    useEffect(() => {
        if (condition !== undefined && condition === false) {
            return
        }
        dispatch(RouterActions.navigate(to, replace))
    })

    return null
}
