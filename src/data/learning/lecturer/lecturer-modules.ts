export type LecturerModuleStatus = "Publik" | "Draft";

export interface LecturerModule {
  id: number;
  title: string;
  materialCount: number;
  status: LecturerModuleStatus;
  updated: string;
  code: string;
  image?: string;
  bannerPublicId?: string | null;
}

export interface LecturerModuleFormValue {
  title: string;
  status: LecturerModuleStatus;
  bannerUrl?: string | null;
  bannerPublicId?: string | null;
  shouldRemoveBanner?: boolean;
}

export const lecturerModules: LecturerModule[] = [
  {
    id: 1,
    title: "ANC Terpadu Trimester 1",
    materialCount: 6,
    status: "Publik",
    updated: "20 Apr 2026",
    code: "BIDAN-X7A",
    image:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640",
  },
  {
    id: 2,
    title: "APGAR Score & Resusitasi",
    materialCount: 4,
    status: "Publik",
    updated: "18 Apr 2026",
    code: "BIDAN-K2B",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640",
  },
  {
    id: 3,
    title: "Inisiasi Menyusu Dini",
    materialCount: 3,
    status: "Draft",
    updated: "15 Apr 2026",
    code: "BIDAN-IMD",
    image:
      "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640",
  },
];

export function generateLecturerModuleCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";

  for (let index = 0; index < 3; index += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }

  return `BIDAN-${suffix}`;
}

export function filterLecturerModules(
  modules: LecturerModule[],
  search: string
) {
  const keyword = search.trim().toLowerCase();

  if (!keyword) return modules;

  return modules.filter((module) => {
    return (
      module.title.toLowerCase().includes(keyword) ||
      module.code.toLowerCase().includes(keyword)
    );
  });
}