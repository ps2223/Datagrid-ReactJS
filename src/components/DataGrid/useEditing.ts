import { useState, useCallback } from "react";

export function useEditing<T extends { id: string | number }>(
  data: T[],
  onChange: (updated: T[]) => void
) {
  const [editingCell, setEditingCell] = useState<{
    rowId: T["id"];
    key: keyof T;
  } | null>(null);

  const updateCell = useCallback(
    (rowId: T["id"], key: keyof T, value: T[keyof T]) => {
      // Create updated dataset safely
      const updated = data.map((row) =>
        row.id === rowId ? { ...row, [key]: value } : row
      );

      onChange(updated);
    },
    [data, onChange]
  );

  return {
    editingCell,
    setEditingCell,
    updateCell,
  };
}