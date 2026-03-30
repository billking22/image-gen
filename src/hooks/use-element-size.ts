import { useState, useEffect, RefObject } from "react";

export function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    observer.observe(ref.current);
    
    // Initial size
    setSize({
      width: ref.current.clientWidth,
      height: ref.current.clientHeight
    });
    
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
