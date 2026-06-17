import { AccountSecurityTab } from "@/components/dashboard/shared/settings/AccountSecurityTab";

export function AdminSecurityTab() {
  return (
    <AccountSecurityTab
      description="Perbarui kata sandi admin untuk menjaga keamanan akses pengelolaan sistem."
      currentPasswordId="adminOldPassword"
      newPasswordId="adminNewPassword"
      confirmPasswordId="adminConfirmPassword"
      successMessage="Kata sandi admin berhasil diperbarui."
    />
  );
}