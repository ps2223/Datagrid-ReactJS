import { useEffect, useState } from "react";
import type { Column } from "./types";

export function useColumns<T extends { id: string | number }>(
  initial: Column<T>[]
) {
  const [columns, setColumns] = useState<Column<T>[]>(initial);

  // ✅ Keep columns in sync if parent updates them
  useEffect(() => {
    setColumns(initial);
  }, [initial]);

  const resizeColumn = (key: keyof T, width: number) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key
          ? { ...col, width: Math.max(50, width) }
          : col
      )
    );
  };

  const reorderColumns = (from: number, to: number) => {
    setColumns((prev) => {
      // Prevent invalid drag indexes
      if (
        from < 0 ||
        to < 0 ||
        from >= prev.length ||
        to >= prev.length
      ) {
        return prev;
      }

      const updated = [...prev];
      const [moved] = updated.splice(from, 1);

      if (!moved) return prev;

      updated.splice(to, 0, moved);
      return updated;
    });
  };

  return { columns, resizeColumn, reorderColumns };
}