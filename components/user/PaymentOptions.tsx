"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addPaymentOption,
  deletePaymentOption,
  setDefaultPaymentOption,
  getPaymentOptions,
} from "@/app/actions/payment";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const paymentSchema = z.object({
  type: z.enum(["DIGITAL_WALLET", "CREDIT_CARD", "DEBIT_CARD"]),
  provider: z.string().min(1, "Provider is required"),
  accountName: z.string().min(2, "Account/Card name is required"),
  accountNumber: z.string().min(5, "Valid account/card number is required"),
  expiryDate: z.string().optional(),
  isDefault: z.boolean(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentOption {
  id: string;
  type: string;
  provider: string;
  accountName: string;
  accountNumber: string;
  expiryDate: string | null;
  isDefault: boolean;
}

export function PaymentOptions() {
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      type: "DIGITAL_WALLET",
      provider: "",
      accountName: "",
      accountNumber: "",
      expiryDate: "",
      isDefault: false,
    },
  });

  const fetchPaymentOptions = async () => {
    try {
      setIsFetching(true);
      const options = await getPaymentOptions();
      // Ensure specific fields like createdAt/updatedAt are handled if needed,
      // but for this interface we just need the properties in PaymentOption
      setPaymentOptions(options as unknown as PaymentOption[]);
    } catch (error) {
      toast.error("Failed to load payment options");
    } finally {
      setIsFetching(false);
    }
  };

  React.useEffect(() => {
    fetchPaymentOptions();
  }, []);

  const onSubmit = async (data: PaymentFormValues) => {
    setIsLoading(true);
    try {
      await addPaymentOption(data);
      toast.success("Payment option added successfully");
      setIsModalOpen(false);
      form.reset();
      fetchPaymentOptions();
    } catch (error) {
      toast.error("Failed to add payment option");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    form.reset({
      type: "DIGITAL_WALLET",
      provider: "",
      accountName: "",
      accountNumber: "",
      expiryDate: "",
      isDefault: false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this payment option?")) {
      try {
        await deletePaymentOption(id);
        toast.success("Payment option deleted");
        fetchPaymentOptions();
      } catch (error) {
        toast.error("Failed to delete payment option");
      }
    }
  };

  const hasDefault = paymentOptions.some((p) => p.isDefault);

  return (
    <div className="bg-white dark:bg-muted/50 p-6 shadow-sm rounded-sm border dark:border-border space-y-6">
      <div className="space-y-4">
        {/* Cash on Delivery - Always present as fallback or option */}
        <div className="border dark:border-border rounded-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/50 flex items-center justify-center rounded-full text-green-600 dark:text-green-400 font-bold text-xs">
              COD
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Cash on Delivery</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive</p>
            </div>
          </div>
          <div>
            {!hasDefault && (
              <span className="text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/50 px-2 py-1 rounded">
                Default
              </span>
            )}
          </div>
        </div>

        {paymentOptions.map((option) => (
          <div
            key={option.id}
            className="border dark:border-border rounded-sm p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center rounded-full text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">
                {option.provider.substring(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {option.provider} {option.type.replace("_", " ")}
                  </p>
                  {option.isDefault && (
                    <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/50 px-1.5 py-0.5 rounded border border-teal-100 dark:border-teal-800">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.accountName} • {option.accountNumber}
                  {option.expiryDate && ` • Exp: ${option.expiryDate}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!option.isDefault && (
                <button
                  onClick={async () => {
                    try {
                      await setDefaultPaymentOption(option.id);
                      toast.success("Set as default payment option");
                      fetchPaymentOptions();
                    } catch (e) {
                      toast.error("Failed to set default");
                    }
                  }}
                  className="text-teal-500 text-xs hover:underline"
                >
                  Make Default
                </button>
              )}
              <button
                onClick={() => handleDelete(option.id)}
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleAddNew}
          className="bg-[#1da1f2] hover:bg-[#1a91da] text-white text-sm font-medium h-10 px-6 uppercase rounded-sm shadow-none"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add ayment Method
        </Button>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DIGITAL_WALLET">
                          Digital Wallet
                        </SelectItem>
                        <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                        <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Esewa, Visa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account/Card Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name on account" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account/Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Account or Card Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 bg-gray-50 dark:bg-muted/50 p-3 rounded-sm border dark:border-border">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as default payment method</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#1da1f2] hover:bg-[#1a91da] text-white"
                >
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
