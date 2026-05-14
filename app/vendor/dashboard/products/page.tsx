"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus, MoreHorizontal, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";

import { DataTable } from "@/components/ui/data-table";
import { columns, Product } from "./columns";

export default function ProductsPage() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("/api/products");
      return response.data as Product[];
    },
  });

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load products</p>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <DashboardHeader />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product inventory
          </p>
        </div>
        <Link href="/vendor/dashboard/products/create">
          <Button>
            <Plus size={16} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
        <DataTable
          columns={columns}
          data={products || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
