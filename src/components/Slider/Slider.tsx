import React, { PropsWithChildren, useCallback, useRef } from 'react';
import { classNames } from '../../utils';
import styles from './Slider.module.css';

interface SliderProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onDragStart' | 'onDragEnd'
  > {
  onPercentChange?: (percent: number) => void;
  onPercentIntent?: (percent: number) => void;
  onPercentChanging?: (percent: number) => void;
  onDragStart?: (percent: number) => void;
  onDragEnd?: (percent: number) => void;
}

const Slider = ({
  onPercentChange,
  onPercentChanging,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onPercentIntent,
  onMouseMove,
  onTouchMove,
  onTouchStart,
  onTouchEnd,
  children,
  className = '',
  onDragStart,
  onDragEnd,
  ...props
}: PropsWithChildren<SliderProps>) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const lastTouch = useRef<React.Touch | null>(null);

  const calculatePercent = useCallback((offset: number) => {
    if (!sliderRef.current) return 0;

    const { width, left } = sliderRef.current?.getBoundingClientRect()!;
    const percent = (offset - left) / width;
    const newPercent = percent <= 0 || isNaN(percent) ? 0 : percent * 100;

    return newPercent > 100 ? 100 : newPercent;
  }, []);

  const handleMoving = useCallback(
    (offset: number) => {
      const percent = calculatePercent(offset);

      onPercentIntent?.(percent);

      if (!isMouseDown.current) return;
    },
    [onPercentIntent]
  );

  const handleSeek = useCallback(
    (offset: number) => {
      const percent = calculatePercent(offset);

      onPercentChange?.(percent);
    },
    [onPercentChange]
  );

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = useCallback(
    e => {
      isMouseDown.current = true;
      const offset = e.touches[0].clientX;

      handleSeek(offset);
      onDragStart?.(calculatePercent(offset));
      onTouchStart?.(e);
    },
    [onTouchStart, handleSeek]
  );

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = useCallback(
    e => {
      lastTouch.current = e.touches[0];
      const offset = e.touches[0].clientX;
      const percent = calculatePercent(offset);

      handleMoving(offset);
      onTouchMove?.(e);
      onDragEnd?.(percent);
      onPercentChanging?.(percent);
    },
    [handleMoving, onTouchMove, onPercentChanging]
  );

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = useCallback(
    e => {
      isMouseDown.current = false;

      onPercentIntent?.(0);
      onTouchEnd?.(e);

      if (!lastTouch.current) return;

      const percent = calculatePercent(lastTouch.current.clientX);

      onPercentChange?.(percent);
    },
    [onPercentChange, onTouchEnd, onPercentIntent]
  );

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      isMouseDown.current = true;
      const offset = e.clientX;
      const percent = calculatePercent(offset);

      onDragEnd?.(percent);
      handleSeek(offset);
      onMouseDown?.(e);
    },
    [onMouseDown, handleSeek]
  );

  const handleMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      isMouseDown.current = false;
      const percent = calculatePercent(e.clientX);

      onDragEnd?.(percent);
      onPercentChange?.(percent);
      onPercentIntent?.(0);
      onMouseUp?.(e);
    },
    [onMouseUp, onPercentChange, onPercentIntent]
  );

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      handleMoving(e.clientX);
      onMouseMove?.(e);

      if (isMouseDown.current) {
        onPercentChanging?.(calculatePercent(e.clientX));
      }
    },
    [handleMoving, onMouseMove, onPercentChanging, onMouseDown]
  );

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      onMouseLeave?.(e);

      if (!isMouseDown.current) {
        onPercentIntent?.(0);

        return;
      }

      // Handle if user dragging outside of slider
      const handleWindowMouseMove = (e: MouseEvent) => {
        const percent = calculatePercent(e.clientX);

        onPercentIntent?.(percent);

        if (isMouseDown.current) {
          onPercentChanging?.(percent);
        }
      };

      const handleWindowMouseUp = (e: MouseEvent) => {
        isMouseDown.current = false;

        const percent = calculatePercent(e.clientX);

        onDragEnd?.(percent);
        onPercentIntent?.(0);
        onPercentChange?.(percent);

        window.removeEventListener('mousemove', handleWindowMouseMove);
        window.removeEventListener('mouseup', handleWindowMouseUp);
      };

      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    },
    [
      onMouseLeave,
      onPercentIntent,
      onPercentChange,
      onPercentChanging,
      handleMoving,
    ]
  );

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={sliderRef}
      className={classNames(styles.container, className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface BarProps extends React.HTMLAttributes<HTMLDivElement> {
  percent?: number;
}

interface DotProps extends React.HTMLAttributes<HTMLDivElement> {
  percent?: number;
}

const Bar: React.FC<BarProps> = ({
  percent = 100,
  className = '',
  style,
  ...props
}) => (
  <div
    className={classNames(styles.bar, className)}
    style={{ width: percent + '%', ...style }}
    {...props}
  />
);

const Dot: React.FC<DotProps> = ({
  percent = 100,
  className = '',
  style,
  ...props
}) => (
  <div
    className={classNames(styles.dot, className)}
    style={{ left: percent + '%', ...style }}
    {...props}
  />
);

Slider.Bar = Bar;
Slider.Dot = Dot;

export default Slider;
