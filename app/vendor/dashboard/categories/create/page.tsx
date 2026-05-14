"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import { Loader2, Plus, X, Image as ImageIcon } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";

type CategoryFormData = {
  name: string;
  description: string;
  image: string;
  parentId?: string;
};

export default function CreateCategoryPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>();
  const queryClient = useQueryClient();

  // Mutation for creating category
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const response = await axios.post("/api/categories", data);
      return response.data;
    },
    onSuccess: () => {
      reset();
      setUploadedImage(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      alert("Category created successfully!");
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    createCategoryMutation.mutate({ ...data, image: uploadedImage || "" });
  };

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      setUploadedImage(imageUrl);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <DashboardHeader />

      <div className="w-full mt-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Add New Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new product category.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Main Info */}
              <div className="space-y-6">
                {/* Category Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <input
                    {...register("name", {
                      required: "Category name is required",
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Chairs"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Describe this category..."
                  />
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="space-y-6">
                <label className="text-sm font-medium text-gray-700 block">
                  Category Image
                </label>

                {uploadedImage ? (
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden group border border-gray-200">
                    <img
                      src={uploadedImage}
                      alt="Category"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                    onSuccess={handleImageUpload}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors"
                      >
                        <ImageIcon size={24} />
                        <span className="text-xs mt-2 font-medium">
                          Upload Image
                        </span>
                      </button>
                    )}
                  </CldUploadWidget>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={createCategoryMutation.isPending}>
                {createCategoryMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Create Category
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
