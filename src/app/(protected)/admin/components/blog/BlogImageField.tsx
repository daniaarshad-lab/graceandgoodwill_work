"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, ImageIcon, Upload } from "lucide-react";

import { blogImageOptions } from "@/data/blogImageOptions";
import { blogService, isBlogMockMode } from "@/services/blog/blog.service";
import { showErrorToast } from "@/utils/toast";

interface BlogImageFieldProps {
  url: string;
  alt: string;
  disabled?: boolean;
  urlError?: string;
  altError?: string;
  onUrlChange: (url: string) => void;
  onAltChange: (alt: string) => void;
}

const fieldClass = (hasError?: string) =>
  `w-full rounded-xl border ${
    hasError
      ? "border-rose-500/50 focus:ring-rose-500/50"
      : "border-gold-300/20 focus:ring-gold-DEFAULT"
  } bg-navy-950 px-4 py-3 text-sm text-gold-100 outline-none transition duration-300 focus:ring-2 shadow-inner`;

export default function BlogImageField({
  url,
  alt,
  disabled,
  urlError,
  altError,
  onUrlChange,
  onAltChange,
}: BlogImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { url: uploadedUrl } = await blogService.uploadFeaturedImage(file);
      onUrlChange(uploadedUrl);
    } catch (error) {
      showErrorToast(
        "Upload failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isTemporary = url.startsWith("blob:");

  return (
    <fieldset className="space-y-4">
      <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-gold-200/60">
        Featured image
      </legend>

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        {/* Preview */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-gold-300/15 bg-navy-950">
          {url ? (
            <Image
              src={url}
              alt={alt || "Featured image preview"}
              fill
              sizes="220px"
              className="object-cover"
              /* Blob URLs and arbitrary hosts cannot be optimised reliably. */
              unoptimized={isTemporary}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-gold-100/25">
              <ImageIcon className="h-6 w-6" aria-hidden="true" />
              <span className="text-[11px]">No image selected</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="blog-image-url"
              className="mb-1.5 block text-xs font-semibold text-gold-200/70"
            >
              Image URL
            </label>
            <input
              id="blog-image-url"
              type="text"
              value={url}
              disabled={disabled}
              onChange={(event) => onUrlChange(event.target.value)}
              placeholder="/login_option1.jpg or https://…"
              className={fieldClass(urlError)}
              aria-invalid={Boolean(urlError)}
              aria-describedby={urlError ? "blog-image-url-error" : undefined}
            />
            {urlError && (
              <p
                id="blog-image-url-error"
                className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {urlError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="blog-image-alt"
              className="mb-1.5 block text-xs font-semibold text-gold-200/70"
            >
              Image description (alt text)
            </label>
            <input
              id="blog-image-alt"
              type="text"
              value={alt}
              disabled={disabled}
              onChange={(event) => onAltChange(event.target.value)}
              placeholder="Describe the image for screen readers"
              className={fieldClass(altError)}
              aria-invalid={Boolean(altError)}
              aria-describedby={altError ? "blog-image-alt-error" : undefined}
            />
            {altError && (
              <p
                id="blog-image-alt-error"
                className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {altError}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFile}
              disabled={disabled || isUploading}
              id="blog-image-upload"
            />
            <label
              htmlFor="blog-image-upload"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gold-300/20 px-4 py-2 text-xs font-bold text-gold-200 transition duration-300 hover:border-gold-300/40 hover:text-gold-100 focus-within:ring-2 focus-within:ring-gold-300/50"
            >
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              {isUploading ? "Uploading…" : "Upload image"}
            </label>

            {isBlogMockMode && isTemporary && (
              <p className="text-[11px] text-amber-400/80">
                Preview only — uploads are not stored until the backend upload
                endpoint exists, so this image will not survive a refresh.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Library picker */}
      <div>
        <p className="mb-2 text-xs font-semibold text-gold-200/70">
          Or choose from the library
        </p>
        <div
          role="radiogroup"
          aria-label="Choose a featured image from the library"
          className="grid grid-cols-3 gap-2 sm:grid-cols-6"
        >
          {blogImageOptions.map((option) => {
            const isSelected = url === option.url;
            return (
              <button
                key={option.url}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={option.label}
                disabled={disabled}
                onClick={() => onUrlChange(option.url)}
                className={`relative aspect-[16/10] overflow-hidden rounded-lg border transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60 disabled:opacity-50 ${
                  isSelected
                    ? "border-gold-DEFAULT ring-2 ring-gold-DEFAULT/30"
                    : "border-gold-300/15 hover:border-gold-300/40"
                }`}
              >
                <Image
                  src={option.url}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}
