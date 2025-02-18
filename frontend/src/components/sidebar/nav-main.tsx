import { type LucideIcon } from "lucide-react";

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";

interface NanMainProps {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}

export function NavMain({ items }: NanMainProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuButton tooltip={item.title} key={item.title} onClick={() => navigate(item.url)} isActive={location.pathname === item.url}>
            <item.icon />
            <span>{item.title}</span>
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
