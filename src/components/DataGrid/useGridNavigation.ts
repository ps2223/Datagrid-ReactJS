import { useState, useCallback } from "react";

export function useGridNavigation(rowCount: number, colCount: number) {
  const [focused, setFocused] = useState({ row: 0, col: 0 });

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      setFocused((prev) => {
        let { row, col } = prev;

        if (e.key === "ArrowDown") row = Math.min(row + 1, rowCount - 1);
        if (e.key === "ArrowUp") row = Math.max(row - 1, 0);
        if (e.key === "ArrowRight") col = Math.min(col + 1, colCount - 1);
        if (e.key === "ArrowLeft") col = Math.max(col - 1, 0);

        return { row, col };
      });
    },
    [rowCount, colCount]
  );

  return { focused, setFocused, handleKey };
}