import { useRef, useCallback, useEffect, useState } from 'react';

type Position = 'top' | 'bottom' | 'left' | 'right';
type Strategy = 'absolute' | 'fixed';

export interface UsePopoverData {
  x: number;
  y: number;
  strategy: Strategy;
}

export interface UsePopoverOptions {
  position: Position;
  offset: number;
  strategy: Strategy;
  overflowElement: HTMLElement | string;
}

const defaultOptions: UsePopoverOptions = {
  position: 'top',
  offset: 0,
  strategy: 'absolute',
  overflowElement: document.documentElement,
};

const usePopover = <T extends HTMLElement, K extends HTMLElement>(
  options: Partial<UsePopoverOptions> = defaultOptions
) => {
  const { position, offset, strategy, overflowElement } = {
    ...defaultOptions,
    ...options,
  };

  const [data, setData] = useState<UsePopoverData>({
    x: 0,
    y: 0,
    strategy,
  });

  const floatingRef = useRef<K>(null);
  const referenceRef = useRef<T>(null);

  const update = useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }

    let overflowRect: DOMRect;

    if (typeof overflowElement === 'string') {
      overflowRect = document
        .querySelector(overflowElement)!
        .getBoundingClientRect();
    } else {
      overflowRect = overflowElement.getBoundingClientRect();
    }

    const referenceRect = referenceRef.current.getBoundingClientRect();
    const floatingRect = floatingRef.current.getBoundingClientRect();

    const rawX =
      position === 'left'
        ? referenceRect.left - floatingRect.width - offset
        : position === 'right'
        ? referenceRect.right + offset
        : referenceRect.left + referenceRect.width / 2 - floatingRect.width / 2;

    const rawY =
      position === 'top'
        ? referenceRect.top - floatingRect.height - offset
        : position === 'bottom'
        ? referenceRect.bottom + offset
        : referenceRect.top +
          referenceRect.height / 2 -
          floatingRect.height / 2;

    let x = rawX;
    const y = rawY;

    if (x + floatingRect.width > overflowRect.right) {
      x = overflowRect.right - floatingRect.width - offset;
    } else if (x < overflowRect.left) {
      x = overflowRect.left + offset;
    }

    setData({
      x,
      y,
      strategy,
    });
  }, [offset, overflowElement, position, strategy]);

  useEffect(() => {
    if (!referenceRef.current || !floatingRef.current) return;

    const resizeObserver = new ResizeObserver(update);

    resizeObserver.observe(floatingRef.current);
    resizeObserver.observe(floatingRef.current);

    document.addEventListener('scroll', update, {
      passive: false,
      capture: true,
    });
    window.addEventListener('resize', update);

    update();

    return () => {
      window.removeEventListener('resize', update);
      document.removeEventListener('scroll', update, { capture: true });
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, floatingRef.current, referenceRef.current]);

  return {
    floatingRef,
    referenceRef,
    update,
    ...data,
  };
};

export default usePopover;
