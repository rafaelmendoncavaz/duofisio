import type { ReactNode } from "react"
import { DashboardMenu } from "./dashboard-menu"
import { DashboardNavigation } from "./dashboard-navigation"

export interface DashboardTemplateProps {
    children: ReactNode
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
    return (
        <div className="h-screen flex flex-col md:flex-row">
            <DashboardNavigation />
            <div className="flex-1 flex flex-col">
                <DashboardMenu />
                <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}
