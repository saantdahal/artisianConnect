"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { getVendorSettings, updateVendorSettings } from "@/app/actions/vendor";
import { Textarea } from "@/components/ui/textarea";

const settingsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z.string().optional(),
    storeName: z.string().min(2, "Store name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function VendorSettingsPage() {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [settingsData, setSettingsData] = useState<any>(null);

    const fetchSettings = async () => {
        setIsLoading(true);
        const res = await getVendorSettings();
        if (res.success) {
            setSettingsData(res.settings);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }

    if (!settingsData) {
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load vendor settings.
            </div>
        );
    }

    const { personal, store } = settingsData;

    return (
        <>
            <div className="flex-1 pb-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                </div>

                <div className="bg-white p-8 shadow-sm rounded-xl">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-10">
                        <div className="space-y-2">
                            <Label className="text-gray-500 text-xs font-normal">
                                Full Name
                            </Label>
                            <div className="text-sm font-medium text-gray-800">
                                {personal.name || "Vendor"}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-500 text-xs font-normal">
                                Email Address
                            </Label>
                            <div className="text-sm font-medium text-gray-800">
                                {personal.email}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-500 text-xs font-normal">
                                Phone Number
                            </Label>
                            <div className="text-sm font-medium text-gray-800">
                                {personal.phoneNumber || "Not Specified"}
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 mb-8" />

                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        Store Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        <div className="space-y-2">
                            <Label className="text-gray-500 text-xs font-normal">
                                Store Name
                            </Label>
                            <div className="text-sm font-medium text-gray-800">
                                {store.storeName}
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-gray-500 text-xs font-normal">
                                Store Description
                            </Label>
                            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg leading-relaxed whitespace-pre-wrap">
                                {store.description}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                        <Button
                            onClick={() => setIsEditOpen(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            Edit Settings
                        </Button>
                    </div>
                </div>
            </div>

            {isEditOpen && (
                <EditSettingsModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    initialData={{
                        name: personal.name || "",
                        phoneNumber: personal.phoneNumber || "",
                        storeName: store.storeName || "",
                        description: store.description || "",
                    }}
                    onSuccess={fetchSettings}
                />
            )}
        </>
    );
}

function EditSettingsModal({
    isOpen,
    onClose,
    initialData,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    initialData: any;
    onSuccess: () => void;
}) {
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<z.infer<typeof settingsSchema>>({
        resolver: zodResolver(settingsSchema),
        defaultValues: initialData,
    });

    async function onSubmit(values: z.infer<typeof settingsSchema>) {
        setIsSaving(true);
        try {
            const res = await updateVendorSettings(values);
            if (res.success) {
                onSuccess();
                onClose();
            } else {
                alert(res.error || "Failed to update settings");
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Edit Settings</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900 border-b pb-2">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="+1234567890" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900 border-b pb-2 mt-4">Store Details</h3>
                            <FormField
                                control={form.control}
                                name="storeName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Store Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Store Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                rows={5}
                                                className="resize-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
