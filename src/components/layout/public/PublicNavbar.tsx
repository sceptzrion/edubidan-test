import { Navbar } from "@/components/layout/public/Navbar";
import { getCurrentSessionUser } from "@/lib/auth/session";
import type { StoredUser, StoredUserRole } from "@/lib/auth/client-auth";

type SessionUser = Awaited<ReturnType<typeof getCurrentSessionUser>>;

function mapSessionUserToStoredUser(user: SessionUser): StoredUser | null {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as StoredUserRole,
    avatarUrl: user.avatarUrl,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
    mahasiswaProfile: user.mahasiswaProfile
      ? {
          id: user.mahasiswaProfile.id,
          npm: user.mahasiswaProfile.npm,
        }
      : null,
    dosenProfile: user.dosenProfile
      ? {
          id: user.dosenProfile.id,
          nidnNip: user.dosenProfile.nidnNip,
        }
      : null,
  };
}

export async function PublicNavbar() {
  const currentUser = await getCurrentSessionUser();

  return <Navbar initialUser={mapSessionUserToStoredUser(currentUser)} />;
}