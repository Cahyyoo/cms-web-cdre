"use client";

import { Trash2 } from "lucide-react";

export default function DeleteButton({
  action,
  confirmMessage = "Hapus data ini? Tindakan ini tidak bisa dibatalkan.",
}: {
  action: (formData: FormData) => Promise<void>;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 size={14} />
        Hapus
      </button>
    </form>
  );
}
