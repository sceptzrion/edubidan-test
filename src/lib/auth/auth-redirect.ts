export function getRedirectPathByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === "admin@edubidan.id") {
    return "/dashboard/admin";
  }

  if (normalizedEmail.endsWith("@staff.unsika.ac.id")) {
    return "/dashboard/lecturer";
  }

  return "/dashboard";
}