import * as React from 'react';
import { useVideo } from '../../contexts/VideoContext';
import { useInteract } from '../../contexts/VideoInteractingContext';
import { classNames } from '../../utils';
import FullscreenButton from '../Controls/FullscreenButton';
import ProgressSlider from '../Controls/ProgressSlider';
import TimeIndicator from '../Controls/TimeIndicator';
import styles from './MobileControls.module.css';

const MobileControls = () => {
  const { isInteracting } = useInteract();
  const { videoState } = useVideo();

  return (
    <div
      className={classNames(
        styles.container,
        !videoState.seeking &&
          !isInteracting &&
          !videoState.buffering &&
          styles.inactive
      )}
    >
      <div className={styles.controlsContainer}>
        <TimeIndicator />

        <div className={styles.fullscreenButton}>
          <FullscreenButton />
        </div>
      </div>
      <div className={styles.sliderContainer}>
        <ProgressSlider />
      </div>
    </div>
  );
};

export default React.memo(MobileControls);
