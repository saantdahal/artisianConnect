"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import { ReviewModal } from "@/components/user/ReviewModal";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: any;
  };
}

export default function MyReviewsPage() {
  const queryClient = useQueryClient();
  const [reviewToEdit, setReviewToEdit] = useState<any>(null);

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["user-reviews"],
    queryFn: async () => {
      const res = await fetch("/api/user/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await fetch(`/api/reviews?id=${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 font-serif">
          My Reviews
        </h1>
        <div className="text-center py-20 bg-white dark:bg-muted/50 rounded-xl border border-gray-100 dark:border-border">
          <MessageSquare className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            No reviews yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            You haven't left any product reviews yet. Review your delivered
            orders to share your thoughts!
          </p>
          <Link
            href="/user/orders"
            className="inline-block mt-6 px-6 py-2.5 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 font-serif">
        My Reviews
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          ({reviews.length})
        </span>
      </h1>

      <div className="space-y-4">
        {reviews.map((review) => {
          const firstImage =
            Array.isArray(review.product.images) &&
            review.product.images.length > 0
              ? review.product.images[0]
              : "/images/placeholder.jpg"; // Replace with your actual placeholder

          return (
            <div
              key={review.id}
              className="bg-white dark:bg-muted/50 rounded-xl border border-gray-100 dark:border-border p-5 flex flex-col md:flex-row gap-5"
            >
              {/* Product Info */}
              <div className="flex items-start gap-4 md:w-1/3 shrink-0">
                <Link
                  href={`/products/${review.product.slug}`}
                  className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 dark:bg-muted shrink-0 border border-gray-100 dark:border-border block"
                >
                  <Image
                    src={
                      typeof firstImage === "string"
                        ? firstImage
                        : firstImage?.url || "/placeholder.jpg"
                    }
                    alt={review.product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="80px"
                  />
                </Link>
                <div>
                  <Link
                    href={`/products/${review.product.slug}`}
                    className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-2"
                  >
                    {review.product.name}
                  </Link>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-1">
                    Reviewed{" "}
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Divider on mobile */}
              <div className="w-full h-px bg-gray-50 dark:bg-border md:hidden block" />

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-[#fadb14] text-[#fadb14]"
                          : "text-gray-200 dark:text-gray-700 fill-gray-50 dark:fill-gray-800"
                      }`}
                    />
                  ))}
                </div>

                {review.title && (
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                    {review.title}
                  </h4>
                )}

                {review.comment ? (
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {review.comment}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                    No written comment provided.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col gap-2 shrink-0 md:border-l md:border-gray-50 md:dark:border-border md:pl-5 text-right w-full md:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReviewToEdit(review)}
                  className="text-xs h-8 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/50 hover:text-teal-700 dark:hover:text-teal-300"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this review?")
                    ) {
                      deleteReview.mutate(review.id);
                    }
                  }}
                  disabled={deleteReview.isPending}
                  className="text-xs h-8 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {reviewToEdit && (
        <ReviewModal
          isOpen={!!reviewToEdit}
          onClose={() => setReviewToEdit(null)}
          product={{
            id: reviewToEdit.product.id,
            name: reviewToEdit.product.name,
            image:
              Array.isArray(reviewToEdit.product.images) &&
              reviewToEdit.product.images.length > 0
                ? typeof reviewToEdit.product.images[0] === "string"
                  ? reviewToEdit.product.images[0]
                  : reviewToEdit.product.images[0]?.url
                : "/placeholder.jpg",
          }}
          existingReview={{
            id: reviewToEdit.id,
            rating: reviewToEdit.rating,
            title: reviewToEdit.title,
            comment: reviewToEdit.comment,
          }}
        />
      )}
    </div>
  );
}
