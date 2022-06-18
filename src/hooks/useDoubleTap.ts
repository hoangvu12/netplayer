import { useRef } from 'react';

type Event = React.DOMAttributes<HTMLDivElement>['onTouchStart'];

interface Props {
  onDoubleTap: Event;
  onTap?: Event;
  tapThreshold?: number;
}

const useDoubleTap = ({ onDoubleTap, onTap, tapThreshold = 300 }: Props) => {
  const lastTap = useRef(0);
  const timeout = useRef<NodeJS.Timeout>();

  const handleTap: Event = (e, ...args) => {
    e.persist();

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    const now = new Date().getTime();
    const timeFromLastTap = now - lastTap.current;

    if (timeFromLastTap <= tapThreshold && timeFromLastTap > 0) {
      onDoubleTap?.(e, ...args);
    } else {
      timeout.current = setTimeout(() => {
        onTap?.(e, ...args);
      }, tapThreshold);
    }

    lastTap.current = new Date().getTime();
  };

  return handleTap;
};

export default useDoubleTap;
