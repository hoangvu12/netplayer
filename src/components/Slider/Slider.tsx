import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { classNames } from '../../utils';
import styles from './Slider.module.css';

interface SliderOptions {
  vertical?: boolean;
}
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
  vertical?: boolean;
  width?: number | string;
  height?: number | string;
}

const SliderContext = React.createContext<SliderOptions>({ vertical: false });

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
  vertical,
  height,
  width,
  ...props
}: PropsWithChildren<SliderProps & SliderOptions>) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const lastTouch = useRef<React.Touch | null>(null);

  const calculatePercent = useCallback(
    (offset: number) => {
      if (!sliderRef.current) return 0;

      const {
        width,
        left,
        top,
        height,
      } = sliderRef.current?.getBoundingClientRect()!;

      const percent = vertical
        ? (height + top - offset) / height
        : (offset - left) / width;

      const newPercent = percent <= 0 || isNaN(percent) ? 0 : percent * 100;

      return newPercent > 100 ? 100 : newPercent;
    },
    [vertical]
  );

  const handleDocumentTouchMove = useCallback((e: TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
  }, []);

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = useCallback(
    e => {
      document.addEventListener('touchmove', handleDocumentTouchMove, {
        passive: false,
      });

      isMouseDown.current = true;
      const offset = vertical ? e.touches[0].clientY : e.touches[0].clientX;
      const percent = calculatePercent(offset);

      onPercentChange?.(percent);
      onDragStart?.(percent);
      onTouchStart?.(e);
    },
    [onTouchStart, calculatePercent, vertical]
  );

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = useCallback(
    e => {
      lastTouch.current = e.touches[0];
      const offset = vertical ? e.touches[0].clientY : e.touches[0].clientX;
      const percent = calculatePercent(offset);

      onPercentIntent?.(percent);
      onTouchMove?.(e);
      onPercentChanging?.(percent);
    },
    [onTouchMove, onPercentChanging, calculatePercent, vertical]
  );

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = useCallback(
    e => {
      document.removeEventListener('touchmove', handleDocumentTouchMove);

      isMouseDown.current = false;

      onPercentIntent?.(0);
      onTouchEnd?.(e);

      if (!lastTouch.current) return;

      const percent = calculatePercent(
        vertical ? lastTouch.current.clientY : lastTouch.current.clientX
      );

      onDragEnd?.(percent);
      onPercentChange?.(percent);
    },
    [onPercentChange, onTouchEnd, onPercentIntent, calculatePercent, vertical]
  );

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      isMouseDown.current = true;
      const offset = vertical ? e.clientY : e.clientX;
      const percent = calculatePercent(offset);

      onDragEnd?.(percent);
      onPercentChange?.(percent);
      onMouseDown?.(e);
    },
    [onMouseDown, calculatePercent, vertical]
  );

  const handleMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      isMouseDown.current = false;
      const percent = calculatePercent(vertical ? e.clientY : e.clientX);

      onDragEnd?.(percent);
      onPercentChange?.(percent);
      onPercentIntent?.(0);
      onMouseUp?.(e);
    },
    [onMouseUp, onPercentChange, onPercentIntent, calculatePercent, vertical]
  );

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      const percent = calculatePercent(vertical ? e.clientY : e.clientX);

      onPercentIntent?.(percent);
      onMouseMove?.(e);

      if (isMouseDown.current) {
        onPercentChanging?.(calculatePercent(percent));
      }
    },
    [onMouseMove, onPercentChanging, onMouseDown, calculatePercent, vertical]
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
        const percent = calculatePercent(vertical ? e.clientY : e.clientX);

        onPercentIntent?.(percent);

        if (isMouseDown.current) {
          onPercentChanging?.(percent);
        }
      };

      const handleWindowMouseUp = (e: MouseEvent) => {
        isMouseDown.current = false;

        const percent = calculatePercent(vertical ? e.clientY : e.clientX);

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
      calculatePercent,
      vertical,
    ]
  );

  const sliderStyle = useMemo(() => {
    if (width && height) return { width, height };

    if (vertical) {
      return { height: '100%', width: '5px' };
    }

    return { width: '100%', height: '5px' };
  }, [width, height]);

  return (
    <SliderContext.Provider value={{ vertical }}>
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
        style={{ ...sliderStyle }}
        {...props}
      >
        {children}
      </div>
    </SliderContext.Provider>
  );
};

export const useSlider = () => {
  return useContext(SliderContext);
};

interface BarProps extends React.HTMLAttributes<HTMLDivElement> {
  percent?: number;
}

interface DotProps extends React.HTMLAttributes<HTMLDivElement> {
  percent?: number;
  width?: number;
  height?: number;
}

const Bar: React.FC<BarProps> = ({
  percent = 100,
  className = '',
  style,
  ...props
}) => {
  const { vertical } = useSlider();

  const barStyle = useMemo(() => {
    if (vertical) {
      return {
        height: percent + '%',
        width: '100%',
        bottom: '0px',
      };
    }

    return {
      width: percent + '%',
      height: '100%',
    };
  }, [percent, vertical]);

  return (
    <div
      className={classNames(styles.bar, className)}
      style={{ ...barStyle, ...style }}
      {...props}
    />
  );
};

const Dot: React.FC<DotProps> = ({
  percent = 100,
  className = '',
  style,
  width = 13,
  height = 13,
  ...props
}) => {
  const { vertical } = useSlider();

  const dotStyle = useMemo(() => {
    if (vertical) {
      return {
        bottom: percent + '%',
      };
    }

    return {
      left: percent + '%',
    };
  }, [percent, vertical]);

  const dotSize = useMemo(
    () => ({
      width: width + 'px',
      height: height + 'px',
    }),
    [width, height]
  );

  return (
    <div
      className={classNames(styles.dot, className)}
      style={{
        ...dotStyle,
        ...dotSize,
        ...style,
      }}
      {...props}
    />
  );
};

Slider.Bar = Bar;
Slider.Dot = Dot;

export default Slider;
