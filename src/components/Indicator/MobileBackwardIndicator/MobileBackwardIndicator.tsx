import * as React from 'react';
import BackwardIcon from '../../icons/BackwardIcon';
import { BaseIndicator, createIndicator } from '../Indicator';
import styles from './MobileBackwardIndicator.module.css';

const MobileBackwardIndicator = createIndicator((props, ref) => {
  return (
    <BaseIndicator {...props} className={styles.indicator} ref={ref}>
      <div className={styles.iconContainer}>
        <BackwardIcon />
      </div>
    </BaseIndicator>
  );
});

export default MobileBackwardIndicator;
