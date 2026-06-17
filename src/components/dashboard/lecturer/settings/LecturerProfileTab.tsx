import { AccountProfileTab } from "@/components/dashboard/shared/settings/AccountProfileTab";

export function LecturerProfileTab() {
  return (
    <AccountProfileTab
      roleLabel="Dosen"
      title="Informasi Profil"
      description="Perbarui identitas dosen dan informasi kontak yang digunakan pada akun Anda."
      nameLabel="Nama Lengkap & Gelar"
      identityLabel="NIDN / NIP"
      identityFallback="-"
      phoneLabel="Nomor WhatsApp"
      accentClassName="bg-linear-to-br from-primary to-teal-500"
      initialsFallback="D"
    />
  );
}