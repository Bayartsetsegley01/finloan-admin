/* eslint-disable @next/next/no-img-element -- tenant logos are arbitrary user-provided URLs */
import { getReadableTextColor } from "@/lib/color";
import { cn } from "@/lib/cn";

interface BrandMarkProps {
  name: string;
  logo?: string;
  /** Defaults to the active tenant colors (CSS variables). Pass explicit colors to preview another tenant. */
  primaryColor?: string;
  secondaryColor?: string;
  size?: "sm" | "md";
}

/** Tenant logo. Falls back to a generated monogram so every organization has a mark from day one. */
export function BrandMark({ name, logo, primaryColor, secondaryColor, size = "md" }: BrandMarkProps) {
  const dimensions = size === "md" ? "size-8 rounded-lg text-body" : "size-6 rounded-md text-meta";

  if (logo) {
    return <img src={logo} alt="" className={cn("shrink-0 bg-surface object-contain", dimensions)} />;
  }

  return (
    <span
      aria-hidden
      className={cn("relative grid shrink-0 place-items-center font-semibold", dimensions)}
      style={{
        backgroundColor: primaryColor ?? "var(--primary)",
        color: primaryColor ? getReadableTextColor(primaryColor) : "var(--on-primary)",
      }}
    >
      {name.trim().charAt(0).toUpperCase()}
      <span
        className={cn(
          "absolute rounded-full ring-2 ring-surface",
          size === "md" ? "-right-0.5 -bottom-0.5 size-2.5" : "-right-0.5 -bottom-0.5 size-2",
        )}
        style={{ backgroundColor: secondaryColor ?? "var(--secondary)" }}
      />
    </span>
  );
}
