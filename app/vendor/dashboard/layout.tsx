"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  DollarSign,
  Package,
  Settings,
  HelpCircle,
  LogOut,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  { name: "Categories", href: "/vendor/dashboard/categories", icon: Tags },
  { name: "Products", href: "/vendor/dashboard/products", icon: Package },
  { name: "Orders", href: "/vendor/dashboard/orders", icon: ShoppingCart },
  // { name: "Reports", href: "/vendor/dashboard/reports", icon: FileText },
  // { name: "Sales", href: "/vendor/dashboard/sales", icon: DollarSign },
];

const supportLinks = [
  { name: "Settings", href: "/vendor/dashboard/settings", icon: Settings },
  // { name: "Help Center", href: "/vendor/dashboard/help", icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    } else if (
      !isPending &&
      session &&
      session.user.role !== "VENDOR" &&
      session.user.role !== "ADMIN"
    ) {
      router.push("/"); // Or to an unauthorized page
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FE]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FE]">
      <aside className="w-64 bg-white hidden md:flex flex-col border-r border-gray-100 sticky top-0 h-screen overflow-y-auto">
        <div className="p-8">
          <Link
            href="/"
            className="text-xl font-bold font-sans text-gray-900 block"
          >
            Artisian Connect
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-8">
          <div>
            <ul className="space-y-2">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm",
                        isActive
                          ? "bg-blue-50 text-blue-500"
                          : "text-gray-500 hover:bg-gray-50 hover:text-blue-500",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm",
                        isActive
                          ? "bg-blue-50 text-blue-500"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button
            onClick={async () => {
              await signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  },
                },
              });
            }}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
