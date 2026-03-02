"use client";

// Displays text bilingually for Spanish speakers:
// Spanish (primary, normal size) + English (small, gray, underneath)
// English speakers just see English normally

export default function BilingualText({
  primary,
  subtitle,
  className = "",
}: {
  primary: string;
  subtitle: string | null;
  className?: string;
}) {
  return (
    <span className={className}>
      {primary}
      {subtitle && (
        <span className="block text-[0.7em] text-gray-400 font-normal leading-tight mt-0.5">
          {subtitle}
        </span>
      )}
    </span>
  );
}
