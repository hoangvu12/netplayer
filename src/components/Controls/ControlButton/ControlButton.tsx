import * as React from 'react';

import { PLAYER_CONTAINER_CLASS } from '../../../constants';
import { classNames } from '../../../utils';
import { isDesktop } from '../../../utils/device';
import Popover from '../../Popover';
import { PopoverProps } from '../../Popover/Popover';
import styles from './ControlButton.module.css';

interface ControlButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  tooltip?: React.ReactNode;
  tooltipProps?: PopoverProps;
}

const selector = `.${PLAYER_CONTAINER_CLASS}`;

const ControlButton: React.FC<ControlButtonProps> = ({
  className = '',
  tooltip,
  tooltipProps,
  ...props
}) => {
  const button = (
    <button
      className={classNames('control-button', styles.controlButton, className)}
      {...props}
    >
      {props.children}
    </button>
  );

  if (tooltip && isDesktop) {
    return (
      <Popover
        portalSelector={selector}
        reference={button}
        type="hover"
        placement="top"
        popperProps={{ className: styles.popper }}
        avoidOverflowSelector={selector}
        {...tooltipProps}
      >
        <p style={{ backgroundColor: 'black', padding: '0.5rem' }}>{tooltip}</p>
      </Popover>
    );
  }

  return button;
};

export default ControlButton;
