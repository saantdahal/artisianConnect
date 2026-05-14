"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

const sidebarLinks = [
  {
    title: "Manage My Account",
    items: [
      { name: "My Profile", href: "/user/profile" },
      { name: "Address Book", href: "/user/address-book" },
      { name: "My Payment Options", href: "/user/payment-options" },
    ],
  },
  {
    title: "My Orders",
    href: "/user/orders",
    items: [
      { name: "My Returns", href: "/user/returns" },
      { name: "My Cancellations", href: "/user/cancellations" },
    ],
  },
  {
    title: "My Reviews",
    href: "/user/reviews",
    items: [],
  },
  {
    title: "My Wishlist & Followed Stores",
    href: "/user/wishlist",
    items: [],
  },
  {
    title: "Logout",
    href: "/logout",
    items: [],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-transparent">
        <div className="mb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Hello, {session?.user?.name || "User"}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center">
              ✔ Verified Account
            </span>
          </div>
        </div>

        <nav className="space-y-6">
          {sidebarLinks.map((section, index) => (
            <div key={index}>
              {section.href ? (
                section.title === "Logout" ? (
                  <Link
                    href={section.href}
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-2"
                  >
                    {section.title}
                  </Link>
                ) : (
                  <Link
                    href={section.href}
                    className={cn(
                      "block text-sm font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-2",
                      section.title === "Sell On Artisian Connect"
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-gray-800 dark:text-gray-200",
                    )}
                  >
                    {section.title}
                  </Link>
                )
              ) : (
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  {section.title}
                </h3>
              )}

              {section.items && section.items.length > 0 && (
                <ul className="space-y-2 pl-4">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block text-sm transition-colors",
                          pathname === item.href
                            ? "text-teal-500 font-medium"
                            : "text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400",
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
