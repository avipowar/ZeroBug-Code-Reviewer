import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserMenuUser } from "@/features/auth/components/user-menu";
import React from "react";
import { DashboardSidebar } from "./dashboard-sidebar";

type DashBoardShellProps = {
  children: React.ReactNode;
  user: UserMenuUser;
  plan: string;
};

export function DashboardShell({ children, user, plan }: DashBoardShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar user={user} plan={plan} />
        <SidebarInset className="min-h-svh">{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
