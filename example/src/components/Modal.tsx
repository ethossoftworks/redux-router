import React, { useMemo, useEffect } from "react"
import { CSSTransition } from "react-transition-group"

type ModalProps = {
    open: boolean
    children: React.ReactNode
    onClose?: () => void
    showClose?: boolean
}

export function Modal({ open, children, onClose, showClose }: ModalProps): JSX.Element {
    showClose == showClose || false
    const transitionDuration = useMemo(() => {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--modal-transition-duration"))
    }, [])

    useEffect(() => {
        const listener = handleKeyPress.bind(window, onClose || (() => {}))
        window.addEventListener("keydown", listener)

        return () => {
            window.removeEventListener("keydown", listener)
        }
    })

    return (
        <CSSTransition
            in={open}
            classNames="modal-wrapper"
            timeout={{ exit: transitionDuration }}
            unmountOnExit
            appear={true}
        >
            <div className="modal-wrapper" onClick={onClose ? (ev) => handleWrapperClick(onClose, ev) : () => {}}>
                <div className="modal">
                    {showClose && (
                        <div className="modal-button--close" onClick={onClose ? (ev) => onClose() : () => {}}></div>
                    )}
                    {children}
                </div>
            </div>
        </CSSTransition>
    )
}

function handleWrapperClick(onClose: () => void, ev: React.MouseEvent) {
    if (ev.target instanceof HTMLElement && ev.target.classList.contains("modal-wrapper")) {
        onClose()
    }
}

function handleKeyPress(onClose: () => void, ev: KeyboardEvent) {
    if (ev.keyCode === 27) {
        onClose()
    }
}
