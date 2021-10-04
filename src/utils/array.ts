export const contain = <T>(hystack: T[], needle: T): boolean => {
  for (const h of hystack) {
    if (h === needle) {
      return true;
    }
  }
  return false;
};

export const merge = <T>(base: T[], sources: T[], find: (b: T, s: T) => boolean): T[] => {
  const filtered = sources.filter((s) => !base.find((b) => find(b, s)));
  return [...base, ...filtered];
};

export const replace = <T>(array: T[], find: (t: T) => boolean, assign: (t: T) => T): T[] => {
  const idx = array.findIndex((a) => find(a));
  if (idx === -1) {
    return array;
  }

  const newElement = assign(array[idx]);
  return [...array.slice(0, idx), newElement, ...array.slice(idx + 1)];
};
