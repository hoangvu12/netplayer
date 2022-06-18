import React, { useCallback, useMemo } from 'react';
import { useInteract, useVideo } from '../../../contexts';
import VolumeMutedIcon from '../../icons/VolumeMutedIcon';
import VolumeOneIcon from '../../icons/VolumeOneIcon';
import VolumeThreeIcon from '../../icons/VolumeThreeIcon';
import VolumeTwoIcon from '../../icons/VolumeTwoIcon';
import Slider from '../../Slider';
import styles from './MobileVolumeSlider.module.css';

const VolumeComponents = {
  0: VolumeMutedIcon,
  0.25: VolumeOneIcon,
  0.5: VolumeTwoIcon,
  1: VolumeThreeIcon,
};

const MobileVolumeSlider = () => {
  const { videoState, videoEl } = useVideo();
  const { setIsInteracting } = useInteract();

  const handleVolumeChange = useCallback(
    (percent: number) => {
      setIsInteracting(true);

      if (!videoEl) return;

      videoEl.volume = percent / 100;
    },
    [setIsInteracting, videoEl]
  );

  const VolumeComponent = useMemo(() => {
    const entries = Object.entries(VolumeComponents).sort(
      (a, b) => Number(a[0]) - Number(b[0])
    );

    for (const [key, value] of entries) {
      if (videoState.volume <= Number(key)) {
        return value;
      }
    }

    return VolumeMutedIcon;
  }, [videoState.volume]);

  return (
    <div className={styles.container}>
      <div className={styles.volumeIcon}>
        <VolumeComponent />
      </div>

      <Slider
        height="33%"
        width="5px"
        vertical
        className={styles.sliderContainer}
        onPercentChange={handleVolumeChange}
        onPercentChanging={handleVolumeChange}
      >
        <Slider.Bar
          className={styles.mainBar}
          percent={videoState.volume * 100}
        />
        <Slider.Bar className={styles.backgroundBar} />
        <Slider.Dot className={styles.dot} percent={videoState.volume * 100} />
      </Slider>
    </div>
  );
};

export default React.memo(MobileVolumeSlider);
