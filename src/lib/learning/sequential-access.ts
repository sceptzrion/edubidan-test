export function applySequentialAccess<T extends { isCompleted: boolean }>(
  items: T[]
): Array<T & { isLocked: boolean; lockedReason?: string }> {
  let hasPreviousIncomplete = false;

  return items.map((item, index) => {
    const isLocked = index > 0 && hasPreviousIncomplete;

    const mappedItem = {
      ...item,
      isLocked,
      lockedReason: isLocked
        ? "Selesaikan konten sebelumnya terlebih dahulu."
        : undefined,
    };

    if (!item.isCompleted) {
      hasPreviousIncomplete = true;
    }

    return mappedItem;
  });
}

export function canAccessSequentialItem<T extends { isCompleted: boolean }>(
  items: T[],
  targetIndex: number
) {
  if (targetIndex <= 0) return true;

  return items.slice(0, targetIndex).every((item) => item.isCompleted);
}