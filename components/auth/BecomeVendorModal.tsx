"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Store } from "lucide-react";
import { useSession } from "@/lib/auth-client"; // Assuming this hook re-fetches session

interface BecomeVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BecomeVendorModal({ isOpen, onClose }: BecomeVendorModalProps) {
  // const { refetch } = useSession(); // If useSession supports refetch
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");

  const becomeVendorMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/user/become-vendor", {
        storeName,
        description,
      });
      return response.data;
    },
    onSuccess: () => {
      // Refresh the page to update session and redirect logic
      window.location.href = "/vendor/dashboard";
    },
    onError: (error) => {
      console.error("Failed to become vendor:", error);
      alert("Something went wrong. Please try again.");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-teal-50 p-3 rounded-full mb-4">
            <Store className="h-6 w-6 text-teal-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Become a Seller
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Start selling your products on our platform today. Access the vendor
            dashboard to manage products, orders, and sales.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-8">
            <li>Create and manage unlimited products</li>
            <li>Track your orders and earnings</li>
            <li>Access detailed sales reports</li>
            <li>Customize your store profile</li>
          </ul>
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                placeholder="Enter your store name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Store Description</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us about what you sell"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button
            onClick={() => becomeVendorMutation.mutate()}
            disabled={becomeVendorMutation.isPending || !storeName || !description}
          >
            {becomeVendorMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm & Start Selling
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
