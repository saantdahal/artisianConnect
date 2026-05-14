"use client";

import React, { useEffect, useState } from "react";
import { getAdminUsers, deleteUser } from "@/app/actions/admin";
import { Trash2, UserCog, ShieldAlert } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const result = await getAdminUsers();
            if (result.success && result.users) {
                setUsers(result.users as User[]);
            } else {
                setError(result.error || "Failed to load users");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id: string, role: string) => {
        if (role === 'ADMIN') {
            alert("Cannot delete an admin from here.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        setDeletingId(id);
        try {
            const result = await deleteUser(id);
            if (result.success) {
                setUsers(users.filter((user) => user.id !== id));
            } else {
                alert(result.error || "Failed to delete user");
            }
        } catch (err) {
            alert("An unexpected error occurred");
        } finally {
            setDeletingId(null);
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
            <DashboardHeader title="User Management" />
            
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-sans">
                        Platform Users
                    </h1>
                    <p className="text-gray-500 mt-1">
                        View and manage all registered users on the platform.
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
                                    User Details
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    Joined Date
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500 uppercase tracking-wider w-32 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="truncate">
                                                <div className="font-medium text-gray-900">
                                                    {user.name || "Unknown"}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate cursor-pointer" title={user.email}>
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === "ADMIN"
                                                    ? "bg-red-50 text-red-700 border-red-200"
                                                    : user.role === "VENDOR"
                                                        ? "bg-teal-50 text-teal-700 border-teal-200"
                                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap w-32">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleDelete(user.id, user.role)}
                                                disabled={deletingId === user.id || user.role === 'ADMIN'}
                                                className={`p-2 rounded-lg transition-colors ${deletingId === user.id
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : user.role === 'ADMIN'
                                                            ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                                                            : "hover:bg-red-50 text-gray-400 hover:text-red-500"
                                                    }`}
                                                title={user.role === 'ADMIN' ? 'Cannot delete admin' : 'Delete user'}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No users found.
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
