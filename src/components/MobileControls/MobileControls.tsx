import * as React from 'react';
import { useVideo } from '../../contexts/VideoContext';
import { useInteract } from '../../contexts/VideoInteractingContext';
import { classNames } from '../../utils';
import FullscreenButton from '../Controls/FullscreenButton';
import ProgressSlider from '../Controls/ProgressSlider';
import TimeIndicator from '../Controls/TimeIndicator';
import styles from './MobileControls.module.css';

const MobileControls = () => {
  const { isInteracting, isShowingIndicator } = useInteract();
  const { videoState } = useVideo();

  const shouldInactive = React.useMemo(() => {
    return (
      (!videoState.seeking && !isInteracting && !videoState.buffering) ||
      isShowingIndicator
    );
  }, [
    isInteracting,
    isShowingIndicator,
    videoState.buffering,
    videoState.seeking,
  ]);

  return (
    <div
      className={classNames(
        styles.container,
        shouldInactive && styles.inactive
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
