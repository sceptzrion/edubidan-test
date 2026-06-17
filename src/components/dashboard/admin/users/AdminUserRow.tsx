"use client";

import { Edit3, Eye, Power, PowerOff, Trash2 } from "lucide-react";

import type { AdminUser } from "@/data/learning/admin/admin-users";

interface AdminUserRowProps {
  user: AdminUser;
  onView: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function AdminUserRow({
  user,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: AdminUserRowProps) {
  const identityLabel = user.role === "Dosen" ? "NIDN" : "NPM";

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
      <td className="p-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 shadow-inner ${
              user.role === "Dosen"
                ? "bg-indigo-500/10 text-indigo-600"
                : "bg-teal-500/10 text-teal-600"
            }`}
          >
            {user.name.charAt(0)}
          </div>

          <div className="min-w-0">
            <p className="font-extrabold text-foreground text-sm truncate max-w-48">
              {user.name}
            </p>

            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">
              Bergabung: {user.joined}
            </p>
          </div>
        </div>
      </td>

      <td className="p-4 sm:px-6 text-muted-foreground font-mono text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold bg-muted px-2 py-0.5 rounded uppercase tracking-wider text-foreground">
            {identityLabel}
          </span>

          <span className="font-medium">{user.identityNo}</span>
        </div>
      </td>

      <td className="p-4 sm:px-6 text-muted-foreground font-medium text-xs sm:text-sm">
        {user.email}
      </td>

      <td className="p-4 sm:px-6 text-center">
        <span
          className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
            user.role === "Dosen"
              ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
              : "bg-teal-500/10 text-teal-600 border border-teal-500/20"
          }`}
        >
          {user.role}
        </span>
      </td>

      <td className="p-4 sm:px-6 text-center">
        <span
          className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
            user.status === "Aktif"
              ? "bg-green-500/10 text-green-600 border border-green-500/20"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          {user.status}
        </span>
      </td>

      <td className="p-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => onView(user)}
            className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors text-muted-foreground"
            title="Lihat Detail"
            aria-label={`Lihat detail ${user.name}`}
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(user)}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
            title="Edit Data"
            aria-label={`Edit data ${user.name}`}
          >
            <Edit3 size={18} />
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus(user)}
            className={`p-2 rounded-xl transition-colors text-muted-foreground ${
              user.status === "Aktif"
                ? "hover:bg-amber-500/10 hover:text-amber-500"
                : "hover:bg-green-500/10 hover:text-green-600"
            }`}
            title={user.status === "Aktif" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
            aria-label={
              user.status === "Aktif"
                ? `Nonaktifkan akun ${user.name}`
                : `Aktifkan akun ${user.name}`
            }
          >
            {user.status === "Aktif" ? <PowerOff size={18} /> : <Power size={18} />}
          </button>

          {user.status === "Nonaktif" && (
            <button
              type="button"
              onClick={() => onDelete(user)}
              className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors text-muted-foreground"
              title="Hapus Permanen"
              aria-label={`Hapus permanen ${user.name}`}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}