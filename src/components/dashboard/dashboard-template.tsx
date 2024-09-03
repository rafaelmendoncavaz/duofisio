import type { ReactNode } from "react";
import { DashboardMenu } from "./dashboard-menu";
import { DashboardNavigation } from "./dashboard-navigation";

export interface DashboardTemplateProps {
  children: ReactNode
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {

  return (
    <>
      <DashboardMenu />
      <div className="flex">
        <DashboardNavigation />
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </>
  )
}