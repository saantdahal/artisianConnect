"use client";

import React, { useEffect, useState } from "react";
import { getAdminApplications, approveApplication, rejectApplication } from "@/app/actions/admin";
import { CheckCircle, XCircle, FileText, Store } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";

interface Application {
    id: string;
    storeName: string;
    description: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: Date;
    user: {
        name: string | null;
        email: string;
    }
}

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadApplications();
    }, []);

    async function loadApplications() {
        try {
            const result = await getAdminApplications();
            if (result.success && result.applications) {
                setApplications(result.applications as Application[]);
            } else {
                setError(result.error || "Failed to load applications");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
        if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this application?`)) {
            return;
        }

        setProcessingId(id);
        try {
            const result = action === "APPROVE" ? await approveApplication(id) : await rejectApplication(id);

            if (result.success) {
                // Update the local state to reflect the new status
                setApplications(apps => apps.map(app =>
                    app.id === id
                        ? { ...app, status: action === "APPROVE" ? "APPROVED" : "REJECTED" }
                        : app
                ));
            } else {
                alert(result.error || `Failed to ${action.toLowerCase()} application`);
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
            <DashboardHeader title="Vendor Applications" />
            
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-sans">
                        Application Requests
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Review and manage requests to become a vendor on the platform.
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
                                    Store Details
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    Description
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500 uppercase tracking-wider w-40 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="h-10 w-10 mt-1 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                <Store className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-base">
                                                    {app.storeName}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    {app.user.name || "Unknown"} &bull; {app.user.email}
                                                </div>
                                                {/* Mobile description */}
                                                <div className="md:hidden mt-3 text-sm text-gray-600 line-clamp-2">
                                                    {app.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell max-w-md">
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            {app.description}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                        ${app.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' : ''}
                        ${app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
                        ${app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                    `}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        {app.status === "PENDING" ? (
                                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleAction(app.id, "APPROVE")}
                                                    disabled={processingId === app.id}
                                                    className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Approve Application"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(app.id, "REJECT")}
                                                    disabled={processingId === app.id}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Reject Application"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Resolved</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-12 h-12 text-gray-300 mb-4" />
                                            <p className="text-lg font-medium text-gray-900">No applications found</p>
                                            <p className="text-sm text-gray-500 mt-1">There are currently no vendor applications to review.</p>
                                        </div>
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
