import type {
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
} from "@/data/learning/admin/admin-users";

export type ApiUserRole = "ADMIN" | "DOSEN" | "MAHASISWA";

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: ApiUserRole;
  avatarUrl: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  mahasiswaProfile: {
    id: number;
    npm: string;
  } | null;
  dosenProfile: {
    id: number;
    nidnNip: string;
  } | null;
  notifPreference?: unknown;
};

export type UsersApiResponse = {
  success: boolean;
  message: string;
  data: ApiUser[] | null;
};

export type UserApiResponse = {
  success: boolean;
  message: string;
  data: ApiUser | null;
  meta?: {
    email?: {
      sent: boolean;
      skipped: boolean;
      error: string | null;
    };
  };
};

export type AdminUserSortKey =
  | "joined"
  | "name"
  | "role"
  | "status"
  | "identityNo"
  | "email";

export type AdminUserSortDirection = "asc" | "desc";

export type AdminUserFormData = Partial<AdminUser> & {
  useAutoPassword?: boolean;
  password?: string;
  confirmPassword?: string;
};

export type AdminUserFormPayload = {
  name: string;
  email: string;
  role: "MAHASISWA" | "DOSEN";
  identifier: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  password?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function mapApiRoleToAdminRole(role: ApiUserRole): AdminUserRole {
  if (role === "DOSEN") {
    return "Dosen";
  }

  return "Mahasiswa";
}

export function mapAdminRoleToApiRole(role: AdminUserRole) {
  if (role === "Dosen") {
    return "DOSEN" as const;
  }

  return "MAHASISWA" as const;
}

export function mapApiUserToAdminUser(user: ApiUser): AdminUser {
  const role = mapApiRoleToAdminRole(user.role);
  const identityNo =
    user.role === "DOSEN"
      ? user.dosenProfile?.nidnNip ?? "-"
      : user.mahasiswaProfile?.npm ?? "-";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phoneNumber ?? "",
    institution: "Universitas Singaperbangsa Karawang",
    gender: "Perempuan",
    status: user.isActive ? "Aktif" : "Nonaktif",
    modules: 0,
    avgScore: 0,
    role,
    identityNo,
    joined: formatDate(user.createdAt),
  };
}

export function mapAdminStatusToIsActive(status?: AdminUserStatus) {
  return status !== "Nonaktif";
}

export function buildCreateUserPayload(
  data: AdminUserFormData
): AdminUserFormPayload {
  const role = mapAdminRoleToApiRole(data.role ?? "Mahasiswa");
  const useAutoPassword = data.useAutoPassword ?? true;

  return {
    name: data.name?.trim() ?? "",
    email: data.email?.trim() ?? "",
    role,
    identifier: data.identityNo?.trim() ?? "",
    phoneNumber: data.phone?.trim() || null,
    avatarUrl: null,
    password: useAutoPassword ? "password123" : data.password?.trim() ?? "",
  };
}

export function buildUpdateUserPayload(data: AdminUserFormData) {
  return {
    name: data.name?.trim() ?? "",
    email: data.email?.trim() ?? "",
    identifier: data.identityNo?.trim() ?? "",
    phoneNumber: data.phone?.trim() || null,
    avatarUrl: null,
  };
}

function getSortValue(user: AdminUser, sortBy: AdminUserSortKey) {
  if (sortBy === "name") return user.name.toLowerCase();
  if (sortBy === "email") return user.email.toLowerCase();
  if (sortBy === "role") return user.role.toLowerCase();
  if (sortBy === "status") return user.status.toLowerCase();
  if (sortBy === "identityNo") return user.identityNo.toLowerCase();

  return user.joined.toLowerCase();
}

export function sortAdminUsers(
  users: AdminUser[],
  sortBy: AdminUserSortKey,
  sortDirection: AdminUserSortDirection
) {
  return [...users].sort((firstUser, secondUser) => {
    const firstValue = getSortValue(firstUser, sortBy);
    const secondValue = getSortValue(secondUser, sortBy);

    const result = firstValue.localeCompare(secondValue, "id-ID", {
      numeric: true,
      sensitivity: "base",
    });

    return sortDirection === "asc" ? result : -result;
  });
}