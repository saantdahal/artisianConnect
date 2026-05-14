"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { name: "HOME", href: "/" },
    { name: "Products", href: "/products" },
    // { name: "Bamboo", href: "/bamboo" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="w-full bg-white dark:bg-background pb-6 pt-2">
      <div className="container mx-auto px-4 flex justify-center space-x-10">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "text-xs font-bold tracking-widest transition-colors uppercase font-sans relative group",
              pathname === link.href
                ? "text-teal-400"
                : "text-[#1a202c] dark:text-gray-300 hover:text-teal-400 dark:hover:text-teal-400",
            )}
          >
            {link.name}
            {/* Active/Hover underline effect if desired, matching the 'HOME' highlight in screenshot */}
            <span
              className={cn(
                "absolute -bottom-1 left-0 w-full h-[2px] bg-teal-400 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100",
                pathname === link.href && "scale-x-100",
              )}
            ></span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
