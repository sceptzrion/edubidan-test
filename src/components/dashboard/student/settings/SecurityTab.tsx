import { AccountSecurityTab } from "@/components/dashboard/shared/settings/AccountSecurityTab";

export function SecurityTab() {
  return (
    <AccountSecurityTab
      description="Perbarui kata sandi secara berkala untuk menjaga keamanan akun mahasiswa."
      currentPasswordId="studentOldPassword"
      newPasswordId="studentNewPassword"
      confirmPasswordId="studentConfirmPassword"
      successMessage="Kata sandi berhasil diperbarui."
    />
  );
}