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
      <DashboardNavigation />
      <main>
        {children}
      </main>
    </>
  )
}