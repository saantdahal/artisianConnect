"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function BecomeVendorPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [storeName, setStoreName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/user/become-vendor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ storeName, description }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit application");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <Store className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in Required</h2>
                    <p className="text-gray-500 mb-6">Please sign in to apply to become a vendor.</p>
                    <Link href="/auth/sign-in" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition">
                        Sign In
                    </Link>
                </div>
            </div>
        )
    }

    if (session.user.role === "VENDOR") {
        return (
            <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">You're already a Vendor!</h2>
                    <p className="text-gray-500 mb-6">Access your vendor dashboard now.</p>
                    <button
                        onClick={() => router.push('/vendor/dashboard')}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition"
                    >
                        Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#F4F7FE] flex flex-col items-center py-20 px-4">
                <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 max-w-2xl w-full text-center border border-gray-100">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 font-sans">
                        Application Submitted!
                    </h1>
                    <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">
                        Thanks for applying to become a vendor. Our team will review your application and you'll be notified of the status soon.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-2xl text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F7FE] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 font-sans tracking-tight mb-4">
                        Become a Vendor
                    </h1>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        Join our artisan community and start selling your handcrafted unique products to customers worldwide.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl text-sm font-medium flex items-center space-x-3">
                                    <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"></span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="storeName" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Store Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Store className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="storeName"
                                            required
                                            value={storeName}
                                            onChange={(e) => setStoreName(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-4 border-gray-200 rounded-2xl focus:ring-purple-600 focus:border-purple-600 sm:text-sm bg-gray-50 border transition-colors outline-none hover:bg-white focus:bg-white"
                                            placeholder="e.g. Acme Artisan Crafts"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Tell us about your craft
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-4 left-4 pointer-events-none">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            id="description"
                                            required
                                            rows={5}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-4 border-gray-200 rounded-2xl focus:ring-purple-600 focus:border-purple-600 sm:text-sm bg-gray-50 border transition-colors outline-none hover:bg-white focus:bg-white resize-none"
                                            placeholder="What kind of products do you create? What makes them unique?"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-4 px-8 border border-transparent rounded-2xl shadow-md text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    {isLoading ? (
                                        <div className="min-w-[140px] flex justify-center">
                                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </button>
                                <p className="text-center text-sm text-gray-500 mt-6">
                                    By submitting, you agree to our Vendor Terms of Service and Policies.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
