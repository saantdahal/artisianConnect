"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import { Loader2, Plus, X, Image as ImageIcon, Trash2, ArrowLeft, Save } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  images: string[];
  status: "DRAFT" | "PENDING" | "ACTIVE" | "SOLD";
  attributes: { key: string; value: string }[];
  isHero: boolean;
  isFeatured: boolean;
};

type Category = {
  id: string;
  name: string;
};

export default function EditProductPage() {
  const { id } = useParams();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      status: "DRAFT",
      attributes: [],
      isHero: false,
      isFeatured: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  // Fetch product data
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return response.data as Category[];
    },
  });

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      const attributesArray = Object.entries(product.attributes || {}).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        stock: product.stock,
        status: product.status,
        attributes: attributesArray,
        isHero: product.isHero,
        isFeatured: product.isFeatured,
      });
      setUploadedImages(product.images || []);
    }
  }, [product, reset]);

  // Mutation for updating product
  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Transform attributes array to object
      const attributesObject = data.attributes.reduce(
        (acc, curr) => {
          if (curr.key) acc[curr.key] = curr.value;
          return acc;
        },
        {} as Record<string, string>,
      );

      const payload = {
        ...data,
        price: parseFloat(data.price.toString()),
        stock: parseInt(data.stock.toString()),
        attributes: attributesObject,
        isHero: data.isHero,
        isFeatured: data.isFeatured,
      };

      const response = await axios.patch(`/api/products/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      router.push("/vendor/dashboard/products");
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    },
  });

  const onSubmit = (data: ProductFormData) => {
    updateProductMutation.mutate({ ...data, images: uploadedImages });
  };

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      setUploadedImages((prev) => [...prev, imageUrl]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="pb-8">
      <DashboardHeader />

      <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/vendor/dashboard/products"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-500 mt-1">
                Update your product details and images.
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            product?.status === "ACTIVE" ? "bg-green-100 text-green-800" : 
            product?.status === "DRAFT" ? "bg-gray-100 text-gray-800" :
            "bg-amber-100 text-amber-800"
          }`}>
            {product?.status}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">General Information</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    {...register("name", {
                      required: "Product name is required",
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Modern Sofa"
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
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Describe your product..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700 block">
                    Product Images
                  </label>

                  <div className="flex flex-wrap gap-4">
                    {uploadedImages.map((url, index) => (
                      <div
                        key={index}
                        className="relative w-32 h-32 rounded-lg overflow-hidden group border border-gray-200"
                      >
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

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
                          className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors"
                        >
                          <ImageIcon size={24} />
                          <span className="text-xs mt-2 font-medium">
                            Upload Image
                          </span>
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>

                {/* Attributes */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">
                      Product Attributes
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ key: "", value: "" })}
                    >
                      <Plus size={14} className="mr-1" /> Add Attribute
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <input
                          {...register(`attributes.${index}.key` as const, {
                            required: "Key required",
                          })}
                          placeholder="Name (e.g. Color)"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          {...register(`attributes.${index}.value` as const, {
                            required: "Value required",
                          })}
                          placeholder="Value (e.g. Blue)"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No attributes added yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Settings */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                  <h3 className="text-base font-semibold text-gray-900">
                    Product Details
                  </h3>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      {...register("status", {
                        required: "Status is required",
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="ACTIVE">Active</option>
                      <option value="PENDING">Pending</option>
                      <option value="SOLD">Sold</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      {...register("categoryId", {
                        required: "Category is required",
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                      disabled={isLoadingCategories}
                    >
                      <option value="">Select category</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-xs">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price", {
                        required: "Price is required",
                        min: { value: 0, message: "Price must be positive" },
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Stock
                    </label>
                    <input
                      type="number"
                      {...register("stock", {
                        required: "Stock is required",
                        min: { value: 0, message: "Stock cannot be negative" },
                      })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder="0"
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-xs">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>

                  {/* Visibility Toggles */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isHero"
                        {...register("isHero")}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <label
                        htmlFor="isHero"
                        className="text-sm font-medium text-gray-700"
                      >
                        Show in Hero Section
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        {...register("isFeatured")}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="text-sm font-medium text-gray-700"
                      >
                        Mark as Featured
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" disabled={updateProductMutation.isPending}>
                {updateProductMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Update Product
                  </>
                )}
              </Button>
              <Link href="/vendor/dashboard/products">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
      </div>
    </div>
  );
}
