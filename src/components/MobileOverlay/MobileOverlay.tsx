import * as React from 'react';
import { useVideo } from '../../contexts/VideoContext';
import { useInteract } from '../../contexts/VideoInteractingContext';
import { classNames } from '../../utils';
import BackwardButton from '../Controls/BackwardButton';
import ForwardButton from '../Controls/ForwardButton';
import PlayPauseButton from '../Controls/PlayPauseButton';
import SettingsButton from '../Controls/SettingsButton';
import styles from './MobileOverlay.module.css';

const MobileOverlay = () => {
  const { isInteracting } = useInteract();
  const { videoState } = useVideo();

  return (
    <div
      className={classNames(
        'mobile-overlay',
        styles.overlayContainer,
        !isInteracting && !videoState.buffering && styles.inactive
      )}
    >
      <div className={styles.playerControlsContainer}>
        <div className={styles.playerControlsInnerContainer}>
          <div className={styles.backwardButton}>
            <BackwardButton />
          </div>

          <div className={styles.playButton}>
            <PlayPauseButton />
          </div>

          <div className={styles.forwardButton}>
            <ForwardButton />
          </div>
        </div>
      </div>

      <div className={styles.settingsButton}>
        <SettingsButton />
      </div>
    </div>
  );
};

export default React.memo(MobileOverlay);
