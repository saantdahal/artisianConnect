"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image: string;
  };
  existingReview?: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
  } | null;
}

export function ReviewModal({
  isOpen,
  onClose,
  product,
  existingReview,
}: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");

  // Update states if existingReview prop changes (e.g. from null to an object)
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setTitle(existingReview.title || "");
      setComment(existingReview.comment || "");
    } else {
      setRating(0);
      setTitle("");
      setComment("");
    }
  }, [existingReview, isOpen]);

  const queryClient = useQueryClient();
  const router = useRouter();
  const submitReview = useMutation({
    mutationFn: async () => {
      if (rating === 0) throw new Error("Please select a rating");

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          rating,
          title,
          comment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(
        existingReview
          ? "Review updated successfully"
          : "Review submitted successfully",
      );
      setRating(0);
      setTitle("");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });

      router.push("/user/reviews");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? "Edit Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            Share your experience with this product to help other buyers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-4 border-b border-gray-100">
          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-50 shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <p className="text-sm font-medium text-gray-800 line-clamp-2">
            {product.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-[#fadb14] text-[#fadb14]"
                        : "text-gray-200"
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Review Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
            />
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Detailed Review (Optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? What should other shoppers know?"
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-shadow resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-600 bg-white shadow-sm border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitReview.isPending || rating === 0}
              className="bg-teal-500 hover:bg-teal-600 text-white shadow-sm"
            >
              {submitReview.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {existingReview ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
