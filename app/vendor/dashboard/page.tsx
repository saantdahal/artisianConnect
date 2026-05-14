import React from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import Charts, { SalesChannelChart } from "./components/Charts";
import TransactionsTable from "./components/TransactionsTable";
import {
  getVendorDashboardStats,
  getVendorSalesChartData,
  getVendorRecentTransactions
} from "@/app/actions/vendor";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Fetch data in parallel
  const [statsData, chartData, transactionsData] = await Promise.all([
    getVendorDashboardStats(),
    getVendorSalesChartData(),
    getVendorRecentTransactions()
  ]);

  if (!statsData.success) {
    // Possibly unauthorized or not a vendor
    redirect("/");
  }

  return (
    <div className="pb-8">
      <DashboardHeader />
      {/* Pass fetched data to components */}
      <StatsCards statsData={statsData.stats} />
      <Charts chartData={chartData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionsTable transactionsData={transactionsData.transactions} />
        </div>
        <div>
          <SalesChannelChart />
        </div>
      </div>
    </div>
  );
}
