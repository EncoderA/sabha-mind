"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "lucide-react";

type NavMainItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export function NavMain({
  items,
}: {
  items: NavMainItem[];
}) {
  const pathname = usePathname();

  function isActive(url: string) {
    return pathname === url || pathname.startsWith(`${url}/`);
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavMainCollapsibleItem
            key={item.title}
            item={item}
            isActive={isActive}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavMainCollapsibleItem({
  item,
  isActive,
}: {
  item: NavMainItem;
  isActive: (url: string) => boolean;
}) {
  const itemIsActive =
    isActive(item.url) ||
    Boolean(item.items?.some((subItem) => isActive(subItem.url)));
  const [userOpen, setUserOpen] = React.useState(Boolean(item.isActive));
  const open = itemIsActive || userOpen;

  return (
    <Collapsible
      open={open}
      onOpenChange={setUserOpen}
      render={<SidebarMenuItem />}
    >
      <SidebarMenuButton
        isActive={itemIsActive}
        tooltip={item.title}
        render={<Link href={item.url} />}
      >
        {item.icon}
        <span>{item.title}</span>
      </SidebarMenuButton>
      {item.items?.length ? (
        <>
          <CollapsibleTrigger
            render={<SidebarMenuAction className="aria-expanded:rotate-90" />}
          >
            <ChevronRightIcon />
            <span className="sr-only">Toggle</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    isActive={isActive(subItem.url)}
                    render={<Link href={subItem.url} />}
                  >
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </>
      ) : null}
    </Collapsible>
  );
}
