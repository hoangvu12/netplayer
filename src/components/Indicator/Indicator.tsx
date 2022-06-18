import * as React from 'react';
import { PLAYER_CONTAINER_CLASS } from '../../constants';
import { classNames } from '../../utils';
import { isDesktop } from '../../utils/device';
import Portal from '../Portal';
import styles from './Indicator.module.css';

export interface IndicatorRef {
  show(): void;
  hide(): void;
}

export const createIndicator = <T,>(
  component: React.ForwardRefRenderFunction<IndicatorRef, T>
) => {
  return React.forwardRef<IndicatorRef, T>(component);
};

interface BaseIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const BaseIndicator = React.forwardRef<IndicatorRef, BaseIndicatorProps>(
  ({ className = '', children = '', ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    const [container, setContainer] = React.useState<Element>();
    const innerRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
      show: () => {
        setShow(false);

        setTimeout(() => {
          setShow(true);
        }, 0);
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
