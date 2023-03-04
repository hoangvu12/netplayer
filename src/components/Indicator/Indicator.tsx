import * as React from 'react';
import { PLAYER_CONTAINER_CLASS } from '../../constants';
import { useInteract } from '../../contexts';
import { classNames } from '../../utils';
import { isDesktop } from '../../utils/device';
import Portal from '../Portal';
import styles from './Indicator.module.css';

export interface IndicatorRef {
  show(shouldReshow?: boolean): void;
  hide(): void;
}

export const createIndicator = <T,>(
  component: React.ForwardRefRenderFunction<IndicatorRef, T>
) => {
  return React.forwardRef<IndicatorRef, T>(component);
};

interface BaseIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  animationTime?: number;
}

const ANIMATION_TIME = 500;

export const BaseIndicator = React.forwardRef<IndicatorRef, BaseIndicatorProps>(
  (
    { className = '', children = '', animationTime = ANIMATION_TIME, ...props },
    ref
  ) => {
    const [show, setShow] = React.useState(false);
    const [container, setContainer] = React.useState<Element>();
    const innerRef = React.useRef<HTMLDivElement>(null);
    const { setIsShowingIndicator } = useInteract();
    const timeout = React.useRef<NodeJS.Timeout>();

    React.useImperativeHandle(ref, () => ({
      show: (shouldReshow = true) => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }

        if (shouldReshow) {
          setShow(false);
        }

        setTimeout(() => {
          setShow(true);

          setIsShowingIndicator(true);
        }, 0);

        timeout.current = setTimeout(() => {
          setShow(false);

          setIsShowingIndicator(false);
        }, animationTime);
      },
      hide: () => setShow(false),
    }));

    React.useLayoutEffect(() => {
      const containerEl = document.querySelector('.' + PLAYER_CONTAINER_CLASS);

      if (!containerEl) return;

      setContainer(containerEl);
    }, []);

    return (
      <Portal element={container}>
        {show && (
          <div ref={innerRef} className={classNames(className)} {...props}>
            {children}
          </div>
        )}
      </Portal>
    );
  }
);

const Indicator = React.forwardRef<IndicatorRef, BaseIndicatorProps>(
  ({ children, className = '', ...props }, ref) => {
    return isDesktop ? (
      <BaseIndicator
        className={classNames(styles.indicator, className)}
        {...props}
        ref={ref}
      >
        {children}
      </BaseIndicator>
    ) : null;
  }
);

BaseIndicator.displayName = 'BaseIndicator';
Indicator.displayName = 'Indicator';

export default Indicator;
