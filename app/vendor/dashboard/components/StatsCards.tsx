"use client";
import React from "react";
import { Banknote, ShoppingCart, TrendingUp, Users } from "lucide-react";

interface StatsType {
  totalSales: number;
  totalOrders: number;
  totalProfit: number;
  newCustomers: number;
}

const StatsCards = ({ statsData }: { statsData?: StatsType }) => {
  // Format numbers
  const formatCurrency = (val: number) =>
    `Rs. ${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const stats = [
    {
      title: "Total Sales",
      value: statsData ? formatCurrency(statsData.totalSales) : "Rs. 0",
      change: "+0%", // Needs historical data for this
      changeType: "positive",
      icon: Banknote,
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: statsData ? statsData.totalOrders.toString() : "0",
      change: "+0%",
      changeType: "positive",
      icon: ShoppingCart,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
    },
    {
      title: "Total Profit (Est.)",
      value: statsData ? formatCurrency(statsData.totalProfit) : "Rs. 0",
      change: "+0%",
      changeType: "positive",
      icon: TrendingUp,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100",
    },
    {
      title: "Active Customers",
      value: statsData ? statsData.newCustomers.toString() : "0",
      change: "+0%",
      changeType: "positive",
      icon: Users,
      iconColor: "text-pink-500",
      iconBg: "bg-pink-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-6 rounded-[20px] shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              {/* <p className="text-xs font-medium text-emerald-500">
                {stat.change}{" "}
                <span className="text-gray-400 font-normal">last month</span>
              </p> */}
            </div>
            <div className={`p-3 rounded-full ${stat.iconBg}`}>
              <Icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
