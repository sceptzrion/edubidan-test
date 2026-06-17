import { Search } from "lucide-react";

export function AdminUsersEmptyState() {
  return (
    <tr>
      <td colSpan={6} className="p-12 text-center">
        <Search size={32} className="mx-auto text-muted-foreground/30 mb-3" />

        <p className="text-sm font-bold text-foreground">
          Pengguna tidak ditemukan
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          Coba ubah kata kunci pencarian atau filter yang digunakan.
        </p>
      </td>
    </tr>
  );
}