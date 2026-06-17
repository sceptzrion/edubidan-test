"use client";

import { ArrowDown, ArrowUp, Search, Shield } from "lucide-react";

import type {
  AdminUserRole,
  AdminUserStatus,
} from "@/data/learning/admin/admin-users";
import type {
  AdminUserSortDirection,
  AdminUserSortKey,
} from "@/lib/admin/users-admin-adapter";

interface AdminUsersToolbarProps {
  search: string;
  roleFilter: "Semua" | AdminUserRole;
  statusFilter: "Semua" | AdminUserStatus;
  sortBy: AdminUserSortKey;
  sortDirection: AdminUserSortDirection;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: "Semua" | AdminUserRole) => void;
  onStatusFilterChange: (value: "Semua" | AdminUserStatus) => void;
  onSortByChange: (value: AdminUserSortKey) => void;
  onSortDirectionChange: (value: AdminUserSortDirection) => void;
}

const statusOptions: ("Semua" | AdminUserStatus)[] = [
  "Semua",
  "Aktif",
  "Nonaktif",
];

const sortLabels: Record<AdminUserSortKey, string> = {
  joined: "Tanggal Bergabung",
  name: "Nama",
  role: "Peran",
  status: "Status",
  identityNo: "No ID",
  email: "Email",
};

export function AdminUsersToolbar({
  search,
  roleFilter,
  statusFilter,
  sortBy,
  sortDirection,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onSortByChange,
  onSortDirectionChange,
}: AdminUsersToolbarProps) {
  const isAscending = sortDirection === "asc";

  const toggleSortDirection = () => {
    onSortDirectionChange(isAscending ? "desc" : "asc");
  };

  return (
    <div className="border-b border-border bg-muted/10 p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-1 lg:flex-wrap lg:items-center">
          <div className="relative sm:col-span-2 lg:w-80 lg:shrink-0">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari nama, email, NIM, atau NIDN..."
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-xs font-medium shadow-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
            />
          </div>

          <div className="relative">
            <select
              value={roleFilter}
              onChange={(event) =>
                onRoleFilterChange(event.target.value as "Semua" | AdminUserRole)
              }
              className="w-full appearance-none rounded-xl border border-border bg-card py-2.5 pl-4 pr-10 text-xs font-bold shadow-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm lg:w-auto"
            >
              <option value="Semua">Semua Peran</option>
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Dosen">Dosen</option>
            </select>

            <Shield
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>

          <div className="flex min-w-0 gap-2">
            <div className="relative min-w-0 flex-1 lg:w-56 lg:flex-none">
              <select
                value={sortBy}
                onChange={(event) =>
                  onSortByChange(event.target.value as AdminUserSortKey)
                }
                className="w-full appearance-none truncate rounded-xl border border-border bg-card py-2.5 pl-4 pr-10 text-xs font-bold shadow-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
              >
                <option value="name">Urut: Nama</option>
                <option value="joined">Urut: Tanggal</option>
                <option value="role">Urut: Peran</option>
                <option value="status">Urut: Status</option>
                <option value="identityNo">Urut: No ID</option>
                <option value="email">Urut: Email</option>
              </select>

              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-muted-foreground">
                {sortLabels[sortBy].slice(0, 2).toUpperCase()}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleSortDirection}
              className="inline-flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
              title={isAscending ? "Urutan naik" : "Urutan turun"}
              aria-label={isAscending ? "Urutan naik" : "Urutan turun"}
            >
              {isAscending ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
            </button>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 gap-1.5 rounded-xl border border-border/50 bg-muted/30 p-1.5 lg:w-auto lg:flex lg:items-center lg:shrink-0">
          {statusOptions.map((status) => {
            const isActive = statusFilter === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusFilterChange(status)}
                className={`rounded-lg px-3 py-2 text-center text-xs font-extrabold transition-all whitespace-nowrap lg:min-w-20 ${
                  isActive
                    ? "border border-border/50 bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}