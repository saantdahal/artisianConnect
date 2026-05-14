"use client";
import React from "react";
import { Search, Bell, Heart, LogOut } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  title?: string;
}

const DashboardHeader = ({ title = "Dashboard" }: DashboardHeaderProps) => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="flex items-center space-x-4 w-full md:w-auto">
        <div className="flex items-center gap-3 pl-2">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-700">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 bg-teal-100 rounded-full shadow-sm text-gray-400 hover:text-blue-500 transition-colors overflow-hidden border border-gray-100 outline-none">
                <div className="w-8 h-8 relative">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-600 font-bold">
                      {session?.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={async () => {
                  await signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = "/";
                      },
                    },
                  });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
