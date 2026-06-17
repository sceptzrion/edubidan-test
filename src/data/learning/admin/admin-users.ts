export type AdminUserRole = "Mahasiswa" | "Dosen";
export type AdminUserStatus = "Aktif" | "Nonaktif";
export type AdminUserGender = "Laki-laki" | "Perempuan";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  institution: string;
  modules: number;
  avgScore: number;
  status: AdminUserStatus;
  joined: string;
  gender?: AdminUserGender;
  role: AdminUserRole;
  identityNo: string;
}

export type AdminUserModalMode = "add" | "edit" | "detail" | null;

export interface AdminUserModalState {
  mode: AdminUserModalMode;
  user?: AdminUser;
}

export const adminUsers: AdminUser[] = [
  {
    id: 1,
    name: "Sari Dewi",
    email: "sari.dewi@student.unsika.ac.id",
    phone: "081211111111",
    institution: "Universitas Singaperbangsa Karawang",
    modules: 6,
    avgScore: 92,
    status: "Aktif",
    joined: "15 Jan 2026",
    gender: "Perempuan",
    role: "Mahasiswa",
    identityNo: "2024010101",
  },
  {
    id: 2,
    name: "Anisa Putri",
    email: "anisa.putri@student.unsika.ac.id",
    phone: "081322222222",
    institution: "Universitas Singaperbangsa Karawang",
    modules: 4,
    avgScore: 85,
    status: "Aktif",
    joined: "20 Jan 2026",
    gender: "Perempuan",
    role: "Mahasiswa",
    identityNo: "2024010102",
  },
  {
    id: 3,
    name: "Dr. Rina Hartati, M.Keb",
    email: "rina.hartati@staff.unsika.ac.id",
    phone: "082133333333",
    institution: "Universitas Singaperbangsa Karawang",
    modules: 8,
    avgScore: 0,
    status: "Aktif",
    joined: "01 Feb 2026",
    gender: "Perempuan",
    role: "Dosen",
    identityNo: "0312087701",
  },
  {
    id: 4,
    name: "Dewi Anggraini",
    email: "dewi.anggraini@student.unsika.ac.id",
    phone: "082244444444",
    institution: "Universitas Singaperbangsa Karawang",
    modules: 5,
    avgScore: 71,
    status: "Nonaktif",
    joined: "05 Feb 2026",
    gender: "Perempuan",
    role: "Mahasiswa",
    identityNo: "2024010104",
  },
  {
    id: 5,
    name: "Maya Sari",
    email: "maya.sari@student.unsika.ac.id",
    phone: "082355555555",
    institution: "Universitas Singaperbangsa Karawang",
    modules: 2,
    avgScore: 65,
    status: "Aktif",
    joined: "10 Mar 2026",
    gender: "Perempuan",
    role: "Mahasiswa",
    identityNo: "2024010105",
  },
  {
    id: 6,
    name: "Dr. Bambang Surya, M.Keb",
    email: "bambang.surya@staff.unsika.ac.id",
    phone: "081566666666",
    institution: "Universitas Singaperbangsa Karawang",
    modules: 4,
    avgScore: 0,
    status: "Aktif",
    joined: "12 Mar 2026",
    gender: "Laki-laki",
    role: "Dosen",
    identityNo: "0420116802",
  },
  {
    id: 7,
    name: "Nita Suryani",
    email: "nita.suryani@student.unsika.ac.id",
    phone: "081677777777",
    institution: "Universitas Singaperbangsa Karawang",
    modules: 1,
    avgScore: 0,
    status: "Aktif",
    joined: "15 Apr 2026",
    gender: "Perempuan",
    role: "Mahasiswa",
    identityNo: "2024010107",
  },
];

export function filterAdminUsers(
  users: AdminUser[],
  search: string,
  roleFilter: "Semua" | AdminUserRole,
  statusFilter: "Semua" | AdminUserStatus
) {
  const keyword = search.trim().toLowerCase();

  return users.filter((user) => {
    const matchesRole = roleFilter === "Semua" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "Semua" || user.status === statusFilter;

    const matchesSearch =
      !keyword ||
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.identityNo.toLowerCase().includes(keyword);

    return matchesRole && matchesStatus && matchesSearch;
  });
}