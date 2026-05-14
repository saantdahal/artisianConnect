"use client";

import React, { useEffect, useState } from "react";
import { getAdminVendors, verifyVendor } from "@/app/actions/admin";
import { ShieldCheck, ShieldOff } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";

interface Vendor {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
}

export default function AdminArtisansPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadVendors();
    }, []);

    async function loadVendors() {
        try {
            const result = await getAdminVendors();
            if (result.success && result.vendors) {
                setVendors(result.vendors as Vendor[]);
            } else {
                setError(result.error || "Failed to load artisans");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    const handleRevoke = async (id: string) => {
        if (!window.confirm("Are you sure you want to revoke this user's artisan status? They will become a regular user.")) {
            return;
        }

        setProcessingId(id);
        try {
            const result = await verifyVendor(id, "REVOKE");
            if (result.success) {
                setVendors(vendors.filter((vendor) => vendor.id !== id));
            } else {
                alert(result.error || "Failed to update artisan");
            }
        } catch (err) {
            alert("An unexpected error occurred");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="pb-8">
            <DashboardHeader title="Artisan Verification" />
            
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-sans">
                        Verified Artisans
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage vendor accounts and active verification status.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Artisan Details
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Joined Date
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500 uppercase tracking-wider w-40 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                                {vendor.name ? vendor.name.charAt(0).toUpperCase() : vendor.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="truncate">
                                                <div className="font-medium text-gray-900">
                                                    {vendor.name || "Unknown"}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate cursor-pointer" title={vendor.email}>
                                                    {vendor.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span>Verified</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(vendor.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap w-40">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleRevoke(vendor.id)}
                                                disabled={processingId === vendor.id}
                                                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${processingId === vendor.id
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                                                    }`}
                                            >
                                                <ShieldOff className="w-4 h-4" />
                                                <span>Revoke</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vendors.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No artisans found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
