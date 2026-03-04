import { DashboardNav } from "@/components/dashboard-nav";
import { UserNav } from "@/components/user-nav";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">SlideFlow</h1>
        </div>
        <DashboardNav />

      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <UserNav />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

        {/* Copyright Footer */}
        <footer className="h-10 border-t bg-card flex items-center justify-center px-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SlideFlow. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
