import type { DesignStatus } from "@/lib/types";

const statusStyles: Record<DesignStatus, string> = {
  待審批: "bg-amber-50 text-amber-800 ring-amber-200",
  已批准: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  退稿: "bg-red-50 text-red-800 ring-red-200",
};

export function StatusBadge({ status }: { status: DesignStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status] ?? "bg-gray-50 text-gray-800 ring-gray-200"}`}
    >
      {status}
    </span>
  );
}
