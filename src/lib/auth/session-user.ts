export type DashboardSessionUserRole = "ADMIN" | "DOSEN" | "MAHASISWA";

export type DashboardSessionUser = {
  id: number;
  name: string;
  email: string;
  role: DashboardSessionUserRole;
  avatarUrl: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  mahasiswaProfile: {
    id: number;
    npm: string;
  } | null;
  dosenProfile: {
    id: number;
    nidnNip: string;
  } | null;
};