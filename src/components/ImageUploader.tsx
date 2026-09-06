import { useRef, useState } from "react";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({
  file,
  previewUrl,
  onSelect,
  onClear,
}: {
  file: File | null;
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(list: FileList | null) {
    const picked = list?.[0];
    if (!picked) return;
    if (!ACCEPTED.includes(picked.type)) {
      setError("Please choose a JPG, PNG or WEBP image.");
      return;
    }
    if (picked.size > 8 * 1024 * 1024) {
      setError("That image is larger than 8 MB. Try a smaller file.");
      return;
    }
    setError(null);
    onSelect(picked);
  }

  if (file && previewUrl) {
    return (
      <div className="space-y-3">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          <img src={previewUrl} alt={`Preview of ${file.name}`} className="max-h-72 w-full object-contain" />
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate text-muted-foreground">{file.name}</span>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
          >
            <Trash2 className="size-3.5" aria-hidden /> Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
          dragging ? "border-primary bg-primary-soft" : "border-border bg-muted/40 hover:bg-muted"
        }`}
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <UploadCloud className="size-6" aria-hidden />
        </span>
        <p className="mt-4 font-display text-base font-semibold">Upload a photo</p>
        <p className="mt-1 text-sm text-muted-foreground">JPG, PNG or WEBP</p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold">
          <ImagePlus className="size-4" aria-hidden /> Choose Image
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
