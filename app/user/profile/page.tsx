"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useSession, updateUser, changePassword } from "@/lib/auth-client";
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

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);

  return (
    <>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium text-gray-800 dark:text-gray-200">My profile</h1>
        </div>

        <div className="bg-white dark:bg-muted/50 p-8 shadow-sm rounded-sm border dark:border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs font-normal">
                Full Name
              </Label>
              <div className="text-sm text-gray-800 dark:text-gray-200">
                {session?.user?.name || "User"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                  Email Address
                </Label>
                <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
                <button className="text-teal-500 text-xs hover:underline">
                  Change
                </button>
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200">
                {session?.user?.email || "email@example.com"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                  Mobile
                </Label>
                <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
                <button
                  className="text-teal-500 text-xs hover:underline"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  Change
                </button>
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200">
                {session?.user?.phoneNumber || "No Phone Number"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                  Birthday
                </Label>
                <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
                <button
                  className="text-teal-500 text-xs hover:underline"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  Change
                </button>
              </div>

              <div className="text-sm text-gray-800 dark:text-gray-200">
                {session?.user?.birthday
                  ? new Date(session.user.birthday).toLocaleDateString()
                  : "Not Specified"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                  Gender
                </Label>
                <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
                <button
                  className="text-teal-500 text-xs hover:underline"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  Change
                </button>
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200 capitalize">
                {session?.user?.gender ?? "Not Specified"}
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4 flex gap-2 justify-end">
            <Button
              onClick={() => setIsEditProfileOpen(true)}
              className="bg-teal-400 text-white text-sm font-medium py-2.5  uppercase rounded-sm shadow-none"
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => setIsChangePasswordOpen(true)}
              className="bg-teal-400 text-white text-sm font-medium py-2.5  uppercase rounded-sm shadow-none"
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {isEditProfileOpen && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={session?.user}
        />
      )}

      {isChangePasswordOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}
    </>
  );
}

// Schema and Modal Components

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.string().optional(),
});

function EditProfileModal({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}) {
  const { data: session } = useSession(); // Refresh session after update
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      birthday: user?.birthday
        ? new Date(user.birthday).toISOString().split("T")[0]
        : "",
      gender: user?.gender || "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      await updateUser({
        name: values.name,
        image: user?.image,
        // @ts-ignore
        phoneNumber: values.phoneNumber,
        // @ts-ignore
        birthday: values.birthday ? new Date(values.birthday) : undefined,
        // @ts-ignore
        gender: values.gender,
      });
      window.location.reload();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthday</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function ChangePasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true);
    try {
      await changePassword({
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
        revokeOtherSessions: true,
      });
      alert("Password changed successfully");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
