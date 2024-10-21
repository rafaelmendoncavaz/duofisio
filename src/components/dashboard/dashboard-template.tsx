import type { ReactNode } from "react"
import { DashboardMenu } from "./dashboard-menu"
import { DashboardNavigation } from "./dashboard-navigation"

export interface DashboardTemplateProps {
    children: ReactNode
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
    return (
        <div className="h-screen flex">
            <DashboardNavigation />
            <div className="w-full">
                <DashboardMenu />
                <main className="mx-10 mt-5 flex flex-col space-y-4">
                    {children}
                </main>
            </div>
        </div>
    )
}
