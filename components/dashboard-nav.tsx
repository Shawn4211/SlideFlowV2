"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Monitor,
  LayoutTemplate,
  Images,
  Calendar,
  Tv2,
  Settings,
  Info,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Project",
    href: "/dashboard/screens",
    icon: Monitor,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: LayoutTemplate,
  },
  {
    title: "Content",
    href: "/dashboard/content",
    icon: Images,
  },
  {
    title: "Schedules",
    href: "/dashboard/schedules",
    icon: Calendar,
  },
  {
    title: "Display",
    href: "/dashboard/display",
    icon: Tv2,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "About",
    href: "/dashboard/about",
    icon: Info,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
