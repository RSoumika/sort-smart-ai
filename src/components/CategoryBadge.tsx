import {
  Apple,
  HelpCircle,
  Recycle,
  Cpu,
  AlertTriangle,
  Trash2,
  Shirt,
  Wine,
  PackageOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CATEGORIES, type WasteCategory } from "@/data/wasteKnowledgeBase";
import { cn } from "@/lib/utils";

export const CATEGORY_ICONS: Record<WasteCategory, LucideIcon> = {
  biodegradable: Apple,
  recyclable: Recycle,
  hazardous: AlertTriangle,
  ewaste: Cpu,
  general: Trash2,
  textile: Shirt,
  glass: Wine,
  metal: PackageOpen,
  unknown: HelpCircle,
};

const STYLES: Record<WasteCategory, string> = {
  biodegradable: "bg-bio-soft text-bio",
  recyclable: "bg-recycle-soft text-recycle",
  hazardous: "bg-hazard-soft text-hazard",
  ewaste: "bg-ewaste-soft text-ewaste",
  general: "bg-unknown-soft text-unknown",
  textile: "bg-bio-soft text-bio",
  glass: "bg-recycle-soft text-recycle",
  metal: "bg-recycle-soft text-recycle",
  unknown: "bg-unknown-soft text-unknown",
};

export function CategoryBadge({
  category,
  size = "md",
  className,
}: {
  category: WasteCategory;
  size?: "sm" | "md";
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-semibold uppercase tracking-wide",
        STYLES[category],
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs",
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-3.5" : "size-4"} aria-hidden />
      {CATEGORIES[category].label}
    </span>
  );
}

export function CategoryIconTile({
  category,
  className,
}: {
  category: WasteCategory;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[category];
  return (
    <span
      className={cn(
        "flex size-12 items-center justify-center rounded-2xl",
        STYLES[category],
        className,
      )}
    >
      <Icon className="size-6" aria-hidden />
    </span>
  );
}
