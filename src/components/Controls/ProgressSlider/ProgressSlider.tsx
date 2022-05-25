import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useVideo } from '../../../contexts/VideoContext';
import { classNames, convertTime } from '../../../utils';
import { isDesktop } from '../../../utils/device';
import Slider from '../../Slider';
import styles from './ProgressSlider.module.css';

const ProgressSlider = () => {
  const { videoEl, setVideoState } = useVideo();
  const [bufferPercent, setBufferPercent] = useState(0);
  const [hoverPercent, setHoverPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // https://stackoverflow.com/questions/5029519/html5-video-percentage-loaded
  useEffect(() => {
    if (!videoEl) return;

    const handleProgressBuffer = () => {
      const buffer = videoEl.buffered;

      if (!buffer.length) return;
      if (!videoEl.duration) return;

      const bufferedTime = buffer.end(buffer.length - 1);
      const bufferedPercent = (bufferedTime / videoEl.duration) * 100;

      setBufferPercent(bufferedPercent);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime);
    };

    videoEl.addEventListener('progress', handleProgressBuffer);
    videoEl.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoEl.removeEventListener('progress', handleProgressBuffer);
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoEl]);

  const currentPercent = useMemo(() => {
    if (!videoEl?.duration) return 0;

    return (currentTime / videoEl.duration) * 100;
  }, [currentTime]);

  const handlePercentIntent = useCallback((percent: number) => {
    setHoverPercent(percent);
  }, []);

  const handlePercentChange = useCallback(
    (percent: number) => {
      if (!videoEl?.duration) return;

      const newTime = (percent / 100) * videoEl.duration;

      videoEl.currentTime = newTime;

      if (videoEl.paused) {
        videoEl.play();
      }

      setVideoState({ seeking: false });
      setCurrentTime(newTime);
    },
    [videoEl?.duration]
  );

  const handleDragStart = useCallback(() => {
    setVideoState({ seeking: true });
  }, []);

  const handleDragEnd = useCallback(() => {
    setVideoState({ seeking: true });
  }, []);

  const handlePercentChanging = useCallback(
    percent => {
      if (!videoEl?.duration) return;

      if (!videoEl.paused) {
        videoEl.pause();
      }

      const newTime = (percent / 100) * videoEl.duration;

      setVideoState({ seeking: true });
      setCurrentTime(newTime);
    },
    [videoEl?.duration]
  );

  return (
    <Slider
      className={classNames(styles.container, isDesktop && styles.desktop)}
      onPercentIntent={handlePercentIntent}
      onPercentChange={handlePercentChange}
      onPercentChanging={handlePercentChanging}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.innerContainer}>
        <Slider.Bar className={styles.hoverBar} percent={hoverPercent} />
        <Slider.Bar className={styles.bufferBar} percent={bufferPercent} />
        <Slider.Bar className={styles.playBar} percent={currentPercent} />
        <Slider.Bar className={styles.backgroundBar} />
        <Slider.Dot className={styles.dot} percent={currentPercent} />

        {!!hoverPercent && videoEl?.duration && (
          <div
            className={styles.hoverTime}
            style={{ left: hoverPercent + '%' }}
          >
            {convertTime((hoverPercent / 100) * videoEl.duration)}
          </div>
        )}
      </div>
    </Slider>
  );
};

export default ProgressSlider;
