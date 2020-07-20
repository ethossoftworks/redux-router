import React from "react"
import { Header } from "./Header"

export function Page({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={className ? `${className} page-wrapper` : "page-wrapper"}>
            <Header />
            <div className="page-content">{children}</div>
        </div>
    )
}
