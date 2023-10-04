import { useCallback, useEffect, useState } from "react";

function useInfiniteScroll(targetRef: React.RefObject<HTMLElement>, initialPage: number, callback: () => void) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const handleScroll = useCallback(() => {
    if (!hasScrolledToBottom && targetRef.current) {
      const target = targetRef.current;
      const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 100;
      
      if (isAtBottom && target.clientHeight < target.scrollHeight) {
        setHasScrolledToBottom(true);
        setCurrentPage(currentPage + 1);
        callback();
      }
    }
    
  },[hasScrolledToBottom, targetRef, callback, currentPage]);

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.addEventListener("scroll", () => handleScroll());
    }

    return () => {
      if (targetRef.current) {
        targetRef.current.removeEventListener("scroll", () => handleScroll());
      }
    };
  }, [targetRef, callback, hasScrolledToBottom, currentPage]);

  const resetBottomScrollFlag = () => {
    setHasScrolledToBottom(false);
  };

  const resetPageCount = () => {
    setCurrentPage(1);
  };

  return { resetBottomScrollFlag, currentPage, resetPageCount };
}

export default useInfiniteScroll;
