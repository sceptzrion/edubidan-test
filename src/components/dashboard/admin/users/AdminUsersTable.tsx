"use client";

import { AdminUserRow } from "@/components/dashboard/admin/users/AdminUserRow";
import { AdminUsersEmptyState } from "@/components/dashboard/admin/users/AdminUsersEmptyState";
import type { AdminUser } from "@/data/learning/admin/admin-users";

interface AdminUsersTableProps {
  users: AdminUser[];
  onView: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function AdminUsersTable({
  users,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: AdminUsersTableProps) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
              Pengguna
            </th>

            <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
              No ID
            </th>

            <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
              Email
            </th>

            <th className="text-center p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
              Peran
            </th>

            <th className="text-center p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
              Status
            </th>

            <th className="text-center p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <AdminUserRow
              key={user.id}
              user={user}
              onView={onView}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))}

          {users.length === 0 && <AdminUsersEmptyState />}
        </tbody>
      </table>
    </div>
  );
}