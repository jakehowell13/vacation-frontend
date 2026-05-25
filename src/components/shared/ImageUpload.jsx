import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, X } from "lucide-react";
import { useState, useEffect } from "react";

export const ImageUpload = ({
  label,
  image,
  onImageChange,
  disabled,
}) => {
  const inputId = `${label?.toLowerCase().replace(/\s+/g, "-") ?? "image"}-upload`;

  const [preview, setPreview] = useState(null);

  // If parent passes an existing image URL (edit mode)
  useEffect(() => {
    if (typeof image === "string") {
      setPreview(image);
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ✅ send FILE to parent (this fixes your backend issue)
    onImageChange(file);

    // ✅ generate preview locally only
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onImageChange(null);
    setPreview(null);
  };

  return (
    <section className="rounded-lg border border-primary/15 bg-primary/5 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <label htmlFor={inputId} className="text-lg font-medium">
            {label}
          </label>
          <p className="text-sm text-muted-foreground">
            Add a visual cover for this trip.
          </p>
        </div>

        {(preview) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={disabled}
            className="shrink-0"
          >
            <X className="size-4" />
            Remove
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-dashed border-primary/30 bg-background">
        {preview ? (
          <img
            src={preview}
            alt={`${label} preview`}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ImageIcon className="size-6" />
            </div>
            <p className="text-sm font-medium">No cover image selected</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={disabled}
          className="sr-only"
        />

        <Button type="button" variant="outline" size="sm" asChild>
          <label htmlFor={inputId} className="cursor-pointer">
            <Upload className="size-4" />
            {preview ? "Change image" : "Upload image"}
          </label>
        </Button>
      </div>
    </section>
  );
};