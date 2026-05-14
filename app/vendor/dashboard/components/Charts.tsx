"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ChartDataType {
  success?: boolean;
  salesData?: { name: string; sales: number; traffic: number }[];
  productData?: { name: string; sales: number }[];
}

const formatCurrency = (val: number) =>
  `Rs. ${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const channelData = [
  { name: "WEBSITE", value: 40, color: "#3B82F6" },
  { name: "INSTAGRAM", value: 30, color: "#60A5FA" },
  { name: "WHATSAPP", value: 20, color: "#93C5FD" },
  { name: "OTHERS", value: 10, color: "#BFDBFE" },
];

const Charts = ({ chartData }: { chartData?: ChartDataType }) => {
  const salesData = chartData?.salesData || [];
  const productData = chartData?.productData || [];

  // Calculate total sales from the 5 weeks for the banner
  const totalPeriodSales = salesData.reduce((sum, item) => sum + (item.sales || 0), 0);
  // Get max product sales for the progress bar scaling
  const maxProductSales = productData.length > 0 ? Math.max(...productData.map(p => p.sales)) : 100;
  // Round up to nearest nice number
  const progressScaleMax = Math.ceil(maxProductSales / 100) * 100 || 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Sales Performance Chart */}
      <div className="bg-white p-6 rounded-[20px] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
            Sales Performance (Revenue)
          </h3>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-xs border border-gray-200 rounded px-2 py-1">
              5 Weeks
            </span>
          </button>
        </div>
        <div className="h-[250px] w-full relative">
          {/* Overlay value */}
          <div className="absolute top-4 left-1/3 bg-white shadow-lg p-3 rounded-xl border border-gray-100 z-10">
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(totalPeriodSales)} <span className="text-green-500 text-xs">▲</span>
            </p>
            <p className="text-xs text-gray-400">Total Revenue</p>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickFormatter={(value) => `Rs.${value}`}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  name === 'sales' ? formatCurrency(Number(value)) : value,
                  name === 'sales' ? 'Revenue' : 'Traffic' // Traffic is mocked currently
                ]}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6366f1"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="traffic"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling Products Bar Chart */}
      <div className="bg-white p-6 rounded-[20px] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
            Top Selling Products
          </h3>
        </div>
        <div className="h-[250px] w-full py-2">
          {productData.length > 0 ? (
            <div className="flex flex-col space-y-3 justify-between h-full">
              {productData.map((item) => (
                <div key={item.name} className="flex items-center text-xs">
                  <span className="w-28 text-gray-500 font-medium truncate pr-2" title={item.name}>
                    {item.name}
                  </span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(item.sales / progressScaleMax) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-[10px] text-gray-400 pl-28 pt-2">
                <span>0</span>
                <span>{progressScaleMax / 2}</span>
                <span>{progressScaleMax}</span>
              </div>
              <div className="text-center text-[10px] text-gray-400 uppercase tracking-wider">
                units sold
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No product sales data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SalesChannelChart = () => {
  return (
    <div className="bg-white p-6 rounded-[20px] shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
          Sales Channel
        </h3>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {channelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full">
          {channelData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Charts;
