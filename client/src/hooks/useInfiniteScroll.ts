import { useEffect, useState } from 'react';

function useInfiniteScroll(targetRef: React.RefObject<HTMLElement>, callback: () => void) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolledToBottom && targetRef.current) {
        const target = targetRef.current;
        const isAtBottom =
          target.scrollTop + target.clientHeight >= target.scrollHeight - 100;
        if (isAtBottom) {
          setHasScrolledToBottom(true);
          callback();
        }
      }
    };

    if (targetRef.current) {
      targetRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (targetRef.current) {
        targetRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [targetRef, callback, hasScrolledToBottom]);

  // Return a function to reset the flag
  const resetScrollFlag = () => {
    setHasScrolledToBottom(false);
  };

  return resetScrollFlag;
}

export default useInfiniteScroll;
