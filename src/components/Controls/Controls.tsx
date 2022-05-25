import * as React from 'react';

import { useVideo } from '../../contexts/VideoContext';
import { useInteract } from '../../contexts/VideoInteractingContext';
import { classNames } from '../../utils';
import BackwardButton from './BackwardButton';
import styles from './Controls.module.css';
import ForwardButton from './ForwardButton';
import FullscreenButton from './FullscreenButton';
import PlayPauseButton from './PlayPauseButton';
import ProgressSlider from './ProgressSlider';
import SettingsButton from './SettingsButton';
import SubtitleButton from './SubtitleButton';
import TimeIndicator from './TimeIndicator';
import VolumeButton from './VolumeButton';

const Controls = () => {
  const { isInteracting } = useInteract();
  const { videoState } = useVideo();

  return (
    <div
      className={classNames(
        styles.container,
        !videoState.seeking &&
          !isInteracting &&
          !videoState.buffering &&
          styles.hide
      )}
    >
      <div className={styles.sliderContainer}>
        <ProgressSlider />
      </div>

      <div className={styles.buttonContainer}>
        <div className={styles.leftButtonContainer}>
          <PlayPauseButton />
          <BackwardButton />
          <ForwardButton />
          <VolumeButton />
          <TimeIndicator />
        </div>
        <div className={styles.rightButtonContainer}>
          <SubtitleButton />
          <SettingsButton />
          <FullscreenButton />
        </div>
      </div>
    </div>
  );
};

export default Controls;
