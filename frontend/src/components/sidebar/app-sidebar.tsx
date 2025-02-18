import * as React from "react";
import { Bot, GalleryVerticalEnd } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarRail } from "@/components/ui/sidebar";
import { useSessionStore } from "@/context/use-session-store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentUser } = useSessionStore();

  const data = {
    user: {
      ...currentUser,
      name: "shadcn",
      email: currentUser?.email ?? "",
      avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/",
        icon: Bot,
      },
      {
        title: "Models",
        url: "/models",
        icon: Bot,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{"Acme Inc"}</span>
            <span className="truncate text-xs">{"Enterprise"}</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
