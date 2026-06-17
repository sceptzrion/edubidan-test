export function getDisplayNameParts(name: string, maxWords = 2) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "Pengguna";
  }

  return words.slice(0, maxWords).join(" ");
}