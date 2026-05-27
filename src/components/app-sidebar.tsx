"use client";

import * as React from "react";
import {
  AudioLinesIcon,
  FileTextIcon,
  HomeIcon,
  LibraryIcon,
  LifeBuoyIcon,
  MessageSquareIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "VartaIQ User",
    email: "workspace@vartaiq.app",
    avatar: "",
  },
  navMain: [
    {
      title: "Meeting Library",
      url: "/meetings",
      icon: <LibraryIcon />,
      isActive: true,
      items: [
        {
          title: "All meetings",
          url: "/meetings",
        },
      ],
    },
    {
      title: "Meet Bot",
      url: "/meet-bot",
      icon: <AudioLinesIcon />,
      items: [
        {
          title: "Start bot",
          url: "/meet-bot",
        },
        {
          title: "Transcripts",
          url: "/meet-bot/transcripts",
        }
      ],
    },
    {
      title: "AI Summaries",
      url: "/meet-bot/summaries",
      icon: <FileTextIcon />,
    },
    {
      title: "Transcripts",
      url: "/meet-bot/transcripts",
      icon: <MessageSquareIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Website",
      url: "/",
      icon: <HomeIcon />,
    },
    {
      title: "Support",
      url: "mailto:support@vartaiq.app",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Feedback",
      url: "mailto:feedback@vartaiq.app",
      icon: <SendIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/meetings" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <SparklesIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">VartaIQ</span>
                <span className="truncate text-xs text-muted-foreground">
                  Meeting Intelligence
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
