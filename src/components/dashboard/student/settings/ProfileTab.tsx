import { AccountProfileTab } from "@/components/dashboard/shared/settings/AccountProfileTab";

export function ProfileTab() {
  return (
    <AccountProfileTab
      roleLabel="Mahasiswa UNSIKA"
      title="Informasi Profil"
      description="Perbarui informasi pribadi yang digunakan pada akun mahasiswa Anda."
      nameLabel="Nama Lengkap"
      identityLabel="NPM"
      identityFallback="-"
      phoneLabel="No. Telepon"
      accentClassName="bg-linear-to-br from-primary to-teal-400"
      initialsFallback="M"
    />
  );
}