import * as React from 'react';
import { useVideo } from '../../contexts/VideoContext';
import { useInteract } from '../../contexts/VideoInteractingContext';
import { useVideoProps } from '../../contexts/VideoPropsContext';
import { classNames } from '../../utils';
import BackwardButton from '../Controls/BackwardButton';
import ForwardButton from '../Controls/ForwardButton';
import MobileVolumeSlider from '../Controls/MobileVolumeSlider';
import PlayPauseButton from '../Controls/PlayPauseButton';
import ScreenshotButton from '../Controls/ScreenshotButton';
import SettingsButton from '../Controls/SettingsButton';
import SliderIcon from '../icons/SliderIcon';
import TextIcon from '../TextIcon';
import styles from './MobileOverlay.module.css';

const MobileOverlay = () => {
  const { isInteracting, isShowingIndicator } = useInteract();
  const { i18n } = useVideoProps();
  const { videoState } = useVideo();

  const shouldInactive = React.useMemo(() => {
    return (
      (!isInteracting && !videoState.seeking && !videoState.buffering) ||
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
        'mobile-overlay',
        styles.overlayContainer,
        shouldInactive && styles.inactive
      )}
    >
      <TextIcon
        leftIcon={
          <div className={styles.dragMessageIcon}>
            <SliderIcon />
          </div>
        }
        className={classNames(
          styles.dragMessage,
          !videoState.seeking && styles.inactive
        )}
      >
        {i18n.controls.sliderDragMessage}
      </TextIcon>

      <MobileVolumeSlider />

      <div
        className={classNames(
          styles.uiContainer,
          videoState.seeking && styles.inactive
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

        <div className={styles.mobileTopButtons}>
          <ScreenshotButton />
          <SettingsButton />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileOverlay);
