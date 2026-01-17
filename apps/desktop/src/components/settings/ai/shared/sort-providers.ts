type Sortable = {
  id: string;
  disabled?: boolean;
  displayName: string;
};

export function sortProviders<T extends Sortable>(
  providers: readonly T[],
): T[] {
  return [...providers].sort((a, b) => {
    if (a.id === "openrouter") return -1;
    if (b.id === "openrouter") return 1;

    if (a.disabled && !b.disabled) return 1;
    if (!a.disabled && b.disabled) return -1;

    if (a.id === "custom") return 1;
    if (b.id === "custom") return -1;

    return a.displayName.localeCompare(b.displayName);
  });
}
