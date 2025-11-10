"use client";

import { ChangeEvent, use, useActionState, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Image from "next/image";
import { editProduct } from "@/action/product";
import { InputField } from "@/components/inputField";
import { ProductDTO } from "@/lib/dto/product";
import { CategoryDTO } from "@/lib/dto/category";

export default function EditProductForm({
  productPromise,
  categoriesPromise,
  query,
}: {
  productPromise: Promise<ProductDTO | null>;
  categoriesPromise: Promise<CategoryDTO[]>;
  query: string;
}) {
  const product = use(productPromise);
  const categories = use(categoriesPromise);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [state, action, isPending] = useActionState(editProduct, null);

  const [isEditing, setIsEditing] = useState(false);

  const [discountType, setDiscountType] = useState(
    state?.inputs?.discountType ?? product?.discountType ?? ""
  );

  const [status, setStatus] = useState(
    state?.inputs?.status ?? product?.status ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    state?.inputs?.categoryId ?? product?.category?.id.toString() ?? ""
  );
  const [isFeatured, setFeatured] = useState(
    state?.inputs?.isFeatured ?? product?.isFeatured.toString() ?? ""
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [slug, setSlug] = useState(state?.inputs?.slug ?? product?.slug ?? "");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSlug(generateSlug(value));
  };

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  const handleCancel = () => {
    setIsEditing(false);
    window.location.reload();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 3 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("Ukuran gambar maksimal 3MB");
        e.target.value = "";
        setImagePreview(null);
        return;
      }

      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleRemovePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const DiscountTypeData = [
    {
      value: "PERCENTAGE",
      name: "Persentase",
    },
    {
      value: "FIXED",
      name: "Nominal",
    },
  ];

  return (
    <form
      action={(formData) => {
        formData.append("query", query);
        return action(formData);
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center h-9">
          <h2 className="text-2xl font-bold">Detail Produk</h2>
          <div className="space-x-3">
            {isEditing ? (
              <>
                <Button
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                  className={`cursor-pointer ${
                    isPending
                      ? "bg-green-300"
                      : "bg-green-500 hover:bg-green-400"
                  }`}
                >
                  {isPending ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-300 animate-spin dark:text-gray-600 fill-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          d="M2.727 1.364c-.753 0-1.363.61-1.363 1.363v14.546c0 .753.61 1.363 1.363 1.363h14.546c.753 0 1.363-.61 1.363-1.363V2.727c0-.753-.61-1.363-1.363-1.363H2.727ZM17.273 0A2.727 2.727 0 0 1 20 2.727v14.546A2.727 2.727 0 0 1 17.273 20H2.727A2.727 2.727 0 0 1 0 17.273V2.727A2.727 2.727 0 0 1 2.727 0h14.546Zm-3.318 2.435a.682.682 0 0 0-.682.682V5a.682.682 0 0 0 1.364 0V3.117a.682.682 0 0 0-.682-.682ZM2.744.94l1.363.006l-.021 4.446c-.03.406.1.734.415 1.037c.313.301.744.438 1.384.4l8.625.004c.482-.055.821-.213 1.05-.469c.228-.257.346-.603.345-1.073V.942h1.364v4.347c.001.789-.227 1.46-.692 1.982c-.465.522-1.114.825-1.99.92h-8.66c-.959.059-1.765-.197-2.371-.78c-.604-.58-.89-1.304-.832-2.072l.02-4.4Z"
                        />
                      </svg>
                      Simpan
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="secondary"
                  disabled={isPending}
                  aria-busy={isPending}
                  onClick={handleCancel}
                >
                  Batal
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className="cursor-pointer bg-blue-600 hover:bg-blue-500"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                </svg>
                Edit
              </Button>
            )}
          </div>
        </div>
        {/* Layout 2 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informasi Umum */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Umum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputField
                  id="name"
                  label="Nama"
                  placeholder="Masukkan nama produk"
                  defaultValue={state?.inputs?.name ?? product?.name ?? ""}
                  required
                  disabled={!isEditing}
                  onChange={handleNameChange}
                  autoComplete="name"
                  error={state?.errors?.name}
                />
                <InputField
                  id="slug"
                  label="Slug"
                  placeholder="Masukkan nama slug"
                  value={slug}
                  required
                  disabled={!isEditing}
                  readOnly
                  autoComplete="slug"
                  error={state?.errors?.slug}
                />
                <input type="hidden" name="oldSlug" value={product?.slug} />
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Produk</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    disabled={!isEditing}
                    defaultValue={
                      state?.inputs?.description ?? product?.description ?? ""
                    }
                    className="focus-visible:ring-0 focus-visible:outline-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Harga dan Diskon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Label htmlFor="price">Harga</Label>
                    {state?.errors?.price && (
                      <p id="price-error" className="text-xs h-2 text-red-500">
                        *{state?.errors?.price}
                      </p>
                    )}
                  </div>
                  <div className="relative rounded-md shadow-sm">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">
                      Rp
                    </span>
                    <Input
                      id="price"
                      name="price"
                      required
                      disabled={!isEditing}
                      defaultValue={
                        state?.inputs?.price ?? product?.price ?? ""
                      }
                      className={`pl-8 focus-visible:ring-0 focus-visible:outline-none ${
                        state?.errors?.price && "border-red-500"
                      }`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Tipe Diskon */}
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Tipe Diskon</Label>
                    <Select
                      name="discountType"
                      value={discountType}
                      disabled={!isEditing}
                      onValueChange={(value) => setDiscountType(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih tipe diskon" />
                      </SelectTrigger>
                      <SelectContent>
                        {DiscountTypeData.map((d, index) => (
                          <SelectItem key={index} value={d.value}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Diskon */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Label htmlFor="discount">Diskon</Label>
                      {state?.errors?.discount?.[0] && (
                        <p
                          id="discount-error"
                          className="text-xs h-2 text-red-500"
                        >
                          *{state?.errors?.discount?.[0]}
                        </p>
                      )}
                    </div>
                    <div className="relative rounded-md shadow-sm">
                      {discountType === "FIXED" && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">
                          Rp
                        </span>
                      )}
                      <Input
                        id="discount"
                        type="number"
                        name="discount"
                        disabled={!isEditing}
                        defaultValue={
                          state?.inputs?.discount ?? product?.discount ?? ""
                        }
                        className={`${
                          discountType === "FIXED" ? "pl-10" : "pl-3"
                        } ${
                          discountType === "PERCENTAGE" ? "pr-8" : "pr-3"
                        } focus-visible:ring-0 focus-visible:outline-none ${
                          state?.errors?.discount && "border-red-500"
                        }`}
                      />
                      {discountType === "PERCENTAGE" && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">
                          %
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            {/* Upload Gambar */}
            <Card>
              <CardHeader>
                <div className="flex space-x-2">
                  <CardTitle>Upload Gambar</CardTitle>
                  {state?.errors?.image && (
                    <p id="image-error" className="text-xs h-2 text-red-500">
                      *{state?.errors?.image[0]}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative flex items-center justify-center border border-dashed w-full h-46">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        sizes="100vh"
                        fill
                        priority
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePreview}
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4" />
                      </button>
                    </>
                  ) : product?.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt="product"
                      sizes="100vh"
                      fill
                      priority
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary w-20 h-20"
                      viewBox="0 0 256 256"
                    >
                      <path
                        fill="currentColor"
                        d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16Zm0 16v102.75l-26.07-26.06a16 16 0 0 0-22.63 0l-20 20l-44-44a16 16 0 0 0-22.62 0L40 149.37V56ZM40 172l52-52l80 80H40Zm176 28h-21.37l-36-36l20-20L216 181.38V200Zm-72-100a12 12 0 1 1 12 12a12 12 0 0 1-12-12Z"
                      />
                    </svg>
                  )}
                </div>

                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  ref={fileInputRef}
                  disabled={!isEditing}
                  onChange={handleImageChange}
                  className={`${state?.errors?.image && "border-red-500"}`}
                />
              </CardContent>
              <input
                type="hidden"
                name="imageUrl"
                value={product?.imageUrl || "/placeholder.png"}
              />
            </Card>

            {/* Kategori Produk*/}
            <Card>
              <CardHeader>
                <CardTitle>Kategori</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Kategori */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Label htmlFor="categoryId">Kategori Produk</Label>
                    {state?.errors?.categoryId && (
                      <p
                        id="categoryId-error"
                        className="text-xs h-2 text-red-500"
                      >
                        *{state?.errors?.categoryId[0]}
                      </p>
                    )}
                  </div>
                  <Select
                    value={categoryId}
                    disabled={!isEditing}
                    onValueChange={(value) => setCategoryId(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="categoryId" value={categoryId} />
                </div>

                {/* Status & Produk Unggulan */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      disabled={!isEditing}
                      onValueChange={setStatus}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                        <SelectItem value="INACTIVE">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="status" value={status} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="featured">Unggulan</Label>
                    <Select
                      value={isFeatured}
                      disabled={!isEditing}
                      onValueChange={setFeatured}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Apakah produk unggulan?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Iya</SelectItem>
                        <SelectItem value="false">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <input type="hidden" name="isFeatured" value={isFeatured} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
}
