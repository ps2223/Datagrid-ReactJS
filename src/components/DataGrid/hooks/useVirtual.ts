import * as React from "react";

type UseVirtualProps<T> = {
  data: T[];
  containerRef: React.RefObject<HTMLDivElement>;
  rowHeight: number;
};

export function useVirtual<T>({
  data,
  containerRef,
  rowHeight,
}: UseVirtualProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);

  // ✅ ALWAYS declare hooks at top
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    setContainerHeight(container.clientHeight);

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef]);

  const totalHeight = data.length * rowHeight;

  const startIndex = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(containerHeight / rowHeight);
  const endIndex = Math.min(
    data.length,
    startIndex + visibleCount + 2
  );

  const virtualRows = [];

  for (let i = startIndex; i < endIndex; i++) {
    virtualRows.push({
      index: i,
      offsetTop: i * rowHeight,
    });
  }

  return {
    virtualRows,
    totalHeight,
  };
}