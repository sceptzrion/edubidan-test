export type StoredUserRole = "ADMIN" | "DOSEN" | "MAHASISWA";

export type StoredUser = {
  id: number;
  name: string;
  email: string;
  role: StoredUserRole;
  avatarUrl: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  mahasiswaProfile?: {
    id: number;
    npm: string;
  } | null;
  dosenProfile?: {
    id: number;
    nidnNip: string;
  } | null;
};

const AUTH_STORAGE_KEY = "edubidan-user";
const AUTH_CHANGE_EVENT = "edubidan-auth-change";

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyAuthStateChanged() {
  if (!isBrowser()) return;

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function parseStoredUser(value: string | null): StoredUser | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<StoredUser>;

    if (
      typeof parsed.id !== "number" ||
      typeof parsed.name !== "string" ||
      typeof parsed.email !== "string" ||
      (parsed.role !== "ADMIN" &&
        parsed.role !== "DOSEN" &&
        parsed.role !== "MAHASISWA")
    ) {
      return null;
    }

    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      avatarUrl: parsed.avatarUrl ?? null,
      phoneNumber: parsed.phoneNumber ?? null,
      isActive: parsed.isActive ?? true,
      mahasiswaProfile: parsed.mahasiswaProfile ?? null,
      dosenProfile: parsed.dosenProfile ?? null,
    };
  } catch {
    return null;
  }
}

export function getStoredUser() {
  if (!isBrowser()) return null;

  const localUser = parseStoredUser(localStorage.getItem(AUTH_STORAGE_KEY));

  if (localUser) {
    return localUser;
  }

  return parseStoredUser(sessionStorage.getItem(AUTH_STORAGE_KEY));
}

export function setStoredUser(user: StoredUser, remember = false) {
  if (!isBrowser()) return;

  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  otherStorage.removeItem(AUTH_STORAGE_KEY);

  notifyAuthStateChanged();
}

export function updateStoredUserProfile(
  updates: Partial<
    Pick<StoredUser, "name" | "avatarUrl" | "phoneNumber" | "isActive">
  >
) {
  if (!isBrowser()) return;

  const currentUser = getStoredUser();

  if (!currentUser) return;

  setStoredUser(
    {
      ...currentUser,
      ...updates,
    },
    Boolean(localStorage.getItem(AUTH_STORAGE_KEY))
  );
}

export function clearStoredUser() {
  if (!isBrowser()) return;

  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);

  notifyAuthStateChanged();
}

export function getDashboardPathByRole(role: StoredUserRole) {
  if (role === "ADMIN") {
    return "/dashboard/admin";
  }

  if (role === "DOSEN") {
    return "/dashboard/lecturer";
  }

  return "/dashboard";
}

export function getRoleLabel(role: StoredUserRole) {
  if (role === "ADMIN") {
    return "Admin";
  }

  if (role === "DOSEN") {
    return "Dosen";
  }

  return "Mahasiswa";
}

export function getUserInitials(name: string) {
  const words = name
    .trim()
    .split(" ")
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return "U";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function subscribeToAuthStateChange(callback: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  window.addEventListener("focus", callback);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener("focus", callback);
  };
}