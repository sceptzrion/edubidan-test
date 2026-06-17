import { AccountProfileTab } from "@/components/dashboard/shared/settings/AccountProfileTab";

export function AdminProfileTab() {
  return (
    <AccountProfileTab
      roleLabel="Pengelola utama sistem EduBidan"
      title="Informasi Profil"
      description="Perbarui identitas administrator yang digunakan pada dashboard admin."
      nameLabel="Nama Lengkap"
      identityLabel="Peran Sistem"
      identityFallback="Super Admin"
      phoneLabel="Nomor Telepon"
      accentClassName="bg-linear-to-br from-indigo-500 to-purple-600"
      initialsFallback="A"
    />
  );
}