import * as React from 'react';
import ForwardIcon from '../../icons/ForwardIcon';
import { BaseIndicator, createIndicator } from '../Indicator';
import styles from './MobileForwardIndicator.module.css';

const MobileForwardIndicator = createIndicator((props, ref) => {
  return (
    <BaseIndicator {...props} className={styles.indicator} ref={ref}>
      <div className={styles.iconContainer}>
        <ForwardIcon />
      </div>
    </BaseIndicator>
  );
});

export default MobileForwardIndicator;
