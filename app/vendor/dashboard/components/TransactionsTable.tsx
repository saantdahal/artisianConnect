"use client";
import React from "react";
import { MoreHorizontal } from "lucide-react";

interface TransactionData {
  id: string;
  date: string;
  product: string;
  customer: string;
  amount: string;
  status: string;
  statusColor: string;
}

const TransactionsTable = ({ transactionsData }: { transactionsData?: TransactionData[] }) => {
  const transactions = transactionsData || [];

  return (
    <div className="bg-white p-6 rounded-[20px] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
          Most Recent Transactions
        </h3>
        <button className="text-blue-500 text-xs font-bold hover:underline">
          View All &gt;&gt;
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-xs border-b border-gray-100">
              <th className="pb-3 font-medium pl-2">Date ↕</th>
              <th className="pb-3 font-medium">ID ↕</th>
              <th className="pb-3 font-medium">Product ↕</th>
              <th className="pb-3 font-medium">Customer ↕</th>
              <th className="pb-3 font-medium">Amount ↕</th>
              <th className="pb-3 font-medium">Order Status ↕</th>
              <th className="pb-3 font-medium text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.length > 0 ? (
              transactions.map((t, i) => (
                <tr
                  key={i}
                  className="group hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                >
                  <td className="py-4 pl-2 font-medium text-gray-500">
                    {t.date}
                  </td>
                  <td className="py-4 font-medium text-gray-500">{t.id}</td>
                  <td className="py-4 font-bold text-gray-900">{t.product}</td>
                  <td className="py-4 font-medium text-gray-600">{t.customer}</td>
                  <td className="py-4 font-bold text-gray-900">{t.amount}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${t.status === "Delivered" ? "bg-green-400" : (t.status === "Cancelled" || t.status === "Declined") ? "bg-red-400" : "bg-orange-400"}`}
                      ></div>{" "}
                      <span className={`font-medium ${t.statusColor}`}>
                        {t.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-right pr-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  No recent transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
