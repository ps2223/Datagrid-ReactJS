import { useState, useMemo } from "react";
import { Column } from "../types";

export function useSorting<T>(
  data: T[],
  columns: Column<T>[]
) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, direction]);

  return {
    sortedData,
    sortKey,
    direction,
    setSortKey,
    setDirection,
  };
}