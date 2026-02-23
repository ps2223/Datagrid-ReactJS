import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSorting } from "./hooks/useSorting";
import { useVirtual } from "./hooks/useVirtual";
import { Column } from "./types";

type Row = Record<string, any>;

type Props = {
  data?: Row[];
  columns?: Column<Row>[];
  rowHeight?: number;
  height?: number;
};

export function DataGrid({
  data = [],
  columns = [],
  rowHeight = 40,
  height = 500,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [gridData, setGridData] = useState<Row[]>(data);
  const [gridColumns, setGridColumns] =
    useState<Column<Row>[]>(columns);

  const [selected, setSelected] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [editing, setEditing] = useState(false);

  const [columnWidths, setColumnWidths] =
    useState<number[]>(columns.map(() => 150));

  useEffect(() => {
    setGridColumns(columns);
    setColumnWidths(columns.map(() => 150));
  }, [columns]);

  const { sortedData } = useSorting(
    gridData,
    gridColumns
  );

  const { virtualRows, totalHeight } =
    useVirtual({
      data: sortedData,
      containerRef,
      rowHeight,
    });

  /* ----------------- KEYBOARD NAVIGATION ----------------- */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selected) return;

      let { row, col } = selected;

      if (e.key === "ArrowDown")
        row = Math.min(row + 1, sortedData.length - 1);
      if (e.key === "ArrowUp")
        row = Math.max(row - 1, 0);
      if (e.key === "ArrowRight")
        col = Math.min(col + 1, gridColumns.length - 1);
      if (e.key === "ArrowLeft")
        col = Math.max(col - 1, 0);

      if (e.key === "Enter") {
        setEditing(true);
      }

      setSelected({ row, col });
    },
    [selected, sortedData.length, gridColumns.length]
  );

  /* ----------------- CELL EDITING ----------------- */

  const handleEdit = (
    rowIndex: number,
    key: string,
    value: string
  ) => {
    setGridData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [key]: value,
      };
      return updated;
    });
    setEditing(false);
  };

  /* ----------------- COLUMN RESIZE ----------------- */

  const startResize = (
    index: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = columnWidths[index] ?? 150;

    const onMouseMove = (event: MouseEvent) => {
      setColumnWidths((prev) => {
        const newWidths = [...prev];
        newWidths[index] = Math.max(
          50,
          startWidth + (event.clientX - startX)
        );
        return newWidths;
      });
    };

    const onMouseUp = () => {
      document.removeEventListener(
        "mousemove",
        onMouseMove
      );
      document.removeEventListener(
        "mouseup",
        onMouseUp
      );
    };

    document.addEventListener(
      "mousemove",
      onMouseMove
    );
    document.addEventListener("mouseup", onMouseUp);
  };

  /* ----------------- COLUMN REORDER ----------------- */

  const handleDragStart =
    (index: number) =>
    (e: React.DragEvent) => {
      e.dataTransfer.setData(
        "colIndex",
        index.toString()
      );
    };

  const handleDrop =
    (index: number) =>
    (e: React.DragEvent) => {
      const from = Number(
        e.dataTransfer.getData("colIndex")
      );

      if (from === index) return;

      setGridColumns((prevCols) => {
        const newCols = [...prevCols];
        const item = newCols[from];
        if (!item) return prevCols;

        newCols.splice(from, 1);
        newCols.splice(index, 0, item);

        return newCols;
      });

      setColumnWidths((prevWidths) => {
        const newWidths = [...prevWidths];
        const widthItem = newWidths[from];
        if (widthItem === undefined)
          return prevWidths;

        newWidths.splice(from, 1);
        newWidths.splice(index, 0, widthItem);

        return newWidths;
      });
    };

  /* ----------------- RENDER ----------------- */

  return (
    <div
      ref={containerRef}
      style={{
        height,
        overflow: "auto",
        border: "1px solid #ddd",
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          position: "relative",
          height: totalHeight,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            position: "sticky",
            top: 0,
            background: "#f5f5f5",
            zIndex: 2,
          }}
        >
          {gridColumns.map((col, colIndex) => (
            <div
              key={String(col.key)}
              draggable
              onDragStart={handleDragStart(colIndex)}
              onDragOver={(e) =>
                e.preventDefault()
              }
              onDrop={handleDrop(colIndex)}
              style={{
                width: columnWidths[colIndex],
                padding: "8px",
                borderRight: "1px solid #ccc",
                position: "relative",
                cursor: "move",
                userSelect: "none",
              }}
            >
              {col.header}

              <div
                onMouseDown={(e) =>
                  startResize(colIndex, e)
                }
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: 5,
                  height: "100%",
                  cursor: "col-resize",
                }}
              />
            </div>
          ))}
        </div>

        {/* ROWS */}
        {virtualRows.map((virtualRow) => {
          const rowIndex = virtualRow.index;
          const row =
            sortedData[rowIndex] as Row | undefined;

          if (!row) return null;

          return (
            <div
              key={rowIndex}
              style={{
                position: "absolute",
                top: virtualRow.offsetTop,
                left: 0,
                right: 0,
                display: "flex",
                height: rowHeight,
                borderTop: "1px solid #eee",
                background: "#fff",
              }}
            >
              {gridColumns.map(
                (col, colIndex) => {
                  const isSelected =
                    selected?.row ===
                      rowIndex &&
                    selected?.col ===
                      colIndex;

                  const cellValue =
                    row[
                      col.key as keyof Row
                    ];

                  return (
                    <div
                      key={String(col.key)}
                      onClick={() =>
                        setSelected({
                          row: rowIndex,
                          col: colIndex,
                        })
                      }
                      style={{
                        width:
                          columnWidths[
                            colIndex
                          ],
                        padding: "8px",
                        border: isSelected
                          ? "2px solid blue"
                          : "1px solid #eee",
                      }}
                    >
                      {editing &&
                      isSelected ? (
                        <input
                          autoFocus
                          defaultValue={
                            cellValue as string
                          }
                          onBlur={(e) =>
                            handleEdit(
                              rowIndex,
                              col.key as string,
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        String(
                          cellValue ?? ""
                        )
                      )}
                    </div>
                  );
                }
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}