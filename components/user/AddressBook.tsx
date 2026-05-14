"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/app/actions/address";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  region: z.string().min(2, "Region is required"),
  postcode: z.string().optional(),
  label: z.string().min(1, "Label is required"), // HOME or OFFICE
  isDefaultShipping: z.boolean(),
  isDefaultBilling: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  region: string;
  postcode: string | null;
  label: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

interface AddressBookProps {
  initialAddresses: Address[];
}

export function AddressBook({ initialAddresses }: AddressBookProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      region: "",
      postcode: "",
      label: "HOME",
      isDefaultShipping: false,
      isDefaultBilling: false,
    },
  });

  // Effect to update local state when initialAddresses changes (e.g. after server action revalidation)
  // However, for immediate feedback, we might want to rely on the revalidation and router refresh.
  // But since we are passing initialAddresses from the server component page, we should sync it.
  React.useEffect(() => {
    setAddresses(initialAddresses);
  }, [initialAddresses]);

  const onSubmit = async (data: AddressFormValues) => {
    setIsLoading(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
        toast.success("Address updated successfully");
      } else {
        await addAddress(data);
        toast.success("Address added successfully");
      }
      setIsModalOpen(false);
      setEditingAddress(null);
      form.reset();
    } catch (error) {
      toast.error("Failed to save address");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    form.reset({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      address: address.address,
      region: address.region,
      postcode: address.postcode || "",
      label: address.label,
      isDefaultShipping: address.isDefaultShipping,
      isDefaultBilling: address.isDefaultBilling,
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    form.reset({
      fullName: "",
      phoneNumber: "",
      address: "",
      region: "",
      postcode: "",
      label: "HOME",
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-muted/50 p-6 shadow-sm rounded-sm border dark:border-border">
      <div className="flex justify-end mb-6">
        {/* Header actions if needed */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
          <thead className="bg-gray-50 dark:bg-muted text-xs text-gray-500 dark:text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Full Name</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Postcode</th>
              <th className="px-4 py-3 font-medium">Phone Number</th>
              <th className="px-4 py-3 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-border">
            {addresses.map((address) => (
              <tr key={address.id} className="hover:bg-gray-50/50 dark:hover:bg-muted/50">
                <td className="px-4 py-4 font-medium">{address.fullName}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {address.label && (
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] uppercase font-medium text-white",
                            address.label === "OFFICE"
                              ? "bg-teal-500"
                              : "bg-gray-400",
                          )}
                        >
                          {address.label}
                        </span>
                      )}
                      <span>{address.address}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {address.region}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">{address.postcode}</td>
                <td className="px-4 py-4">{address.phoneNumber}</td>
                <td className="px-4 py-4 text-right space-y-1">
                  <div className="flex flex-col items-end gap-1">
                    {address.isDefaultShipping && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Default Shipping Address
                      </span>
                    )}
                    {address.isDefaultBilling && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Default Billing Address
                      </span>
                    )}
                    {!address.isDefaultShipping && (
                      <button
                        onClick={async () => {
                          try {
                            await setDefaultAddress(address.id, "shipping");
                            toast.success("Set as default shipping address");
                          } catch (e) {
                            toast.error("Failed to set default");
                          }
                        }}
                        className="text-teal-500 text-xs hover:underline"
                      >
                        Make default shipping address
                      </button>
                    )}
                    {!address.isDefaultBilling && (
                      <button
                        onClick={async () => {
                          try {
                            await setDefaultAddress(address.id, "billing");
                            toast.success("Set as default billing address");
                          } catch (e) {
                            toast.error("Failed to set default");
                          }
                        }}
                        className="text-teal-500 text-xs hover:underline"
                      >
                        Make default billing address
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-teal-500 text-xs font-semibold hover:underline uppercase mt-1"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {addresses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No addresses found. Add one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Input full name" {...field} />
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
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Input mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="Province/City/Area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input placeholder="Input postcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="House no. / building / street / area"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Label>Select a label for effective delivery:</Label>
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-4 space-y-0">
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="radio"
                            value="HOME"
                            checked={field.value === "HOME"}
                            onChange={field.onChange}
                            className="accent-teal-500 w-4 h-4"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Home</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="radio"
                            value="OFFICE"
                            checked={field.value === "OFFICE"}
                            onChange={field.onChange}
                            className="accent-teal-500 w-4 h-4"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Office</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-gray-50 dark:bg-muted/50 p-4 rounded-sm space-y-3">
                <FormField
                  control={form.control}
                  name="isDefaultShipping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Default shipping address</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDefaultBilling"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Default billing address</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
