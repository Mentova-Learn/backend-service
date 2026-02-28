"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FullPageSpinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/constants";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/children": "My Children",
  "/courses": "Courses",
  "/courses/create": "Create Course",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (/^\/courses\/[^/]+$/.test(pathname)) return "Course";
  return "Mentova";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated, hydrate } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace(ROUTES.LOGIN);
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return <FullPageSpinner />;
  }

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="lg:pl-[280px]">
        <Header
          title={pageTitle}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
