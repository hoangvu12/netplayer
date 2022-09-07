import React, { useCallback, useLayoutEffect, useState } from 'react';
import usePopover, { UsePopoverOptions } from '../../hooks/usePopover';
import { classNames } from '../../utils';
import Portal from '../Portal';
import styles from './Popover.module.css';

export interface PopoverProps extends Partial<UsePopoverOptions> {
  reference: React.ReactNode;
  referenceProps?: React.HTMLAttributes<HTMLElement>;
  popperProps?: React.HTMLAttributes<HTMLElement>;
  type?: 'click' | 'hover';
  portalSelector?: string;
}

const noop = () => {};

const Popover: React.FC<PopoverProps> = ({
  reference,
  children,
  popperProps = {},
  referenceProps = {},
  type = 'click',
  portalSelector,
  ...options
}) => {
  const [portalElement, setPortalElement] = useState<Element>(document.body);
  const { floatingRef, referenceRef, update, strategy, x, y } = usePopover<
    HTMLDivElement,
    HTMLDivElement
  >({ offset: 10, strategy: 'fixed', ...options });

  const { className: popperClassName = '', ...popperRest } = popperProps!;
  const { className: referenceClassName = '', ...referenceRest } =
    referenceProps!;

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      update();

      setIsOpen(true);
    },
    [update]
  );

  const handleClose: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      update();

      setIsOpen(false);
    },
    [update]
  );

  useLayoutEffect(() => {
    if (!portalSelector) return;

    const el = document.querySelector(portalSelector);

    if (!el) return;

    setPortalElement(el);

    update();
  }, [portalSelector, update]);

  return (
    <React.Fragment>
      <div
        ref={referenceRef}
        onClick={type === 'click' ? handleOpen : noop}
        onMouseEnter={type === 'hover' ? handleOpen : noop}
        onMouseLeave={type === 'hover' ? handleClose : noop}
        className={classNames(referenceClassName)}
        {...referenceRest}
      >
        {reference}
      </div>

      <Portal element={portalElement}>
        <div
          style={{
            position: strategy,
            left: x,
            top: y,
          }}
          className={classNames(
            styles.popperContainer,
            isOpen && styles.isOpen,
            popperClassName
          )}
          ref={floatingRef}
          {...popperRest}
        >
          {children}
        </div>

        {isOpen && type === 'click' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
            }}
            onClick={handleClose}
          ></div>
        )}
      </Portal>
    </React.Fragment>
  );
};

export default Popover;
