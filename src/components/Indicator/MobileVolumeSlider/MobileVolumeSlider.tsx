import React, { useMemo } from 'react';
import { useVideo } from '../../../contexts';
import { classNames } from '../../../utils';
import VolumeMutedIcon from '../../icons/VolumeMutedIcon';
import VolumeOneIcon from '../../icons/VolumeOneIcon';
import VolumeThreeIcon from '../../icons/VolumeThreeIcon';
import VolumeTwoIcon from '../../icons/VolumeTwoIcon';
import { BaseIndicator, createIndicator } from '../Indicator';
import styles from './MobileVolumeSlider.module.css';

const VolumeComponents = {
  0: VolumeMutedIcon,
  0.25: VolumeOneIcon,
  0.5: VolumeTwoIcon,
  1: VolumeThreeIcon,
};

const MobileVolumeSlider = createIndicator((props, ref) => {
  const { videoState } = useVideo();

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
    <BaseIndicator
      {...props}
      animationTime={1000}
      className={classNames('mobile-volume-slider', styles.container)}
      ref={ref}
    >
      <div className={styles.volumeIcon}>
        <VolumeComponent />
      </div>

      <div className={styles.sliderContainer}>
        <div
          className={styles.slider}
          style={{ height: videoState.volume * 100 + '%' }}
        ></div>
      </div>
    </BaseIndicator>
  );
});

export default MobileVolumeSlider;
