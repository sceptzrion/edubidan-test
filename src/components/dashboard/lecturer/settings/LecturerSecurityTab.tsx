import { AccountSecurityTab } from "@/components/dashboard/shared/settings/AccountSecurityTab";

export function LecturerSecurityTab() {
  return (
    <AccountSecurityTab
      description="Perbarui kata sandi secara berkala untuk menjaga keamanan akun dosen."
      currentPasswordId="lecturerOldPassword"
      newPasswordId="lecturerNewPassword"
      confirmPasswordId="lecturerConfirmPassword"
      successMessage="Kata sandi berhasil diperbarui."
    />
  );
}