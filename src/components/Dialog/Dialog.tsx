import * as React from 'react';
import { classNames } from '../../utils';
import { isMobile } from '../../utils/device';
import Portal from '../Portal';
import styles from './Dialog.module.css';

interface DialogProps {
  reference: React.ReactNode;
  portalSelector?: string;
}

const Dialog: React.FC<DialogProps> = ({
  reference,
  children,
  portalSelector,
}) => {
  const [portalElement, setPortalElement] = React.useState<Element>(
    document.body
  );
  const [show, setShow] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!portalSelector) return;

    const el = document.querySelector(portalSelector);

    if (!el) return;

    setPortalElement(el);
  }, []);

  return (
    <React.Fragment>
      <div onClick={() => setShow(true)}>{reference}</div>

      <Portal element={portalElement}>
        <div className={classNames(styles.dialogContainer)} aria-hidden={!show}>
          <div
            onClick={() => setShow(false)}
            className={styles.dialogOverlay}
          />

          <div
            className={classNames(
              styles.dialogContent,
              isMobile && styles.dialogContentMobile
            )}
          >
            {children}
          </div>
        </div>
      </Portal>
    </React.Fragment>
  );
};

export default Dialog;
