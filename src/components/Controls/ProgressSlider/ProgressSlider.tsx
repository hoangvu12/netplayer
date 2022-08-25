import { parse } from '@plussub/srt-vtt-parser';
import { Entry } from '@plussub/srt-vtt-parser/dist/src/types';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { buildAbsoluteURL } from 'url-toolkit';
import { PLAYER_CONTAINER_CLASS } from '../../../constants';
import { useVideoProps } from '../../../contexts';
import { useVideo } from '../../../contexts/VideoContext';
import { usePopover } from '../../../hooks';
import { classNames, convertTime, isValidUrl } from '../../../utils';
import { isDesktop } from '../../../utils/device';
import Portal from '../../Portal';
import Slider from '../../Slider';
import styles from './ProgressSlider.module.css';

const playerContainerClass = '.' + PLAYER_CONTAINER_CLASS;

const ProgressSlider = () => {
  const { videoEl, setVideoState } = useVideo();
  const { thumbnail } = useVideoProps();
  const [thumbnailEntries, setThumbnailEntries] = useState<Entry[]>([]);
  const [bufferPercent, setBufferPercent] = useState(0);
  const [hoverPercent, setHoverPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(
    null
  );

  const { floatingRef, referenceRef, update, strategy, x, y } = usePopover<
    HTMLDivElement,
    HTMLDivElement
  >({
    offset: 10,
    strategy: 'fixed',
    overflowElement: playerContainerClass,
    position: 'top',
  });

  useLayoutEffect(() => {
    const el = document.querySelector(playerContainerClass) as HTMLDivElement;

    if (!el) return;

    setPortalElement(el);

    update();
  }, [update]);

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
  }, [currentTime, videoEl?.duration]);

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
    [setVideoState, videoEl]
  );

  const handleDragStart = useCallback(() => {
    setVideoState({ seeking: true });
  }, [setVideoState]);

  const handleDragEnd = useCallback(() => {
    setVideoState({ seeking: true });
  }, [setVideoState]);

  const handlePercentChanging = useCallback(
    (percent) => {
      if (!videoEl?.duration) return;

      if (!videoEl.paused) {
        videoEl.pause();
      }

      const newTime = (percent / 100) * videoEl.duration;

      setVideoState({ seeking: true });
      setCurrentTime(newTime);
    },
    [setVideoState, videoEl]
  );

  useEffect(() => {
    if (!thumbnail) return;
    if (!videoEl) return;

    const fetchThumbnails = async () => {
      const response = await fetch(thumbnail);

      const text = await response.text();

      const { entries = [] } = parse(text);

      setThumbnailEntries(entries);
    };

    fetchThumbnails();
  }, [thumbnail, videoEl]);

  const currentThumbnail = useMemo(() => {
    if (!thumbnailEntries?.length) return;
    if (!videoEl?.duration) return;

    const currentTime = (hoverPercent / 100) * videoEl.duration * 1000;

    const currentEntry = thumbnailEntries.find(
      (entry) => entry.from <= currentTime && entry.to > currentTime
    );

    if (!currentEntry?.text) return undefined;

    const thumbnailUrlRaw = isValidUrl(currentEntry.text)
      ? currentEntry.text
      : buildAbsoluteURL(thumbnail, currentEntry.text);

    const { origin, pathname } = new URL(thumbnailUrlRaw);

    const thumbnailUrl = origin + pathname;

    const [x, y, w, h] = thumbnailUrlRaw
      ?.split('=')[1]
      .split(',')
      .map((a) => a.trim());

    // Update thumbnail position
    update();

    return {
      rect: {
        x: -1 * Number(x),
        y: -1 * Number(y),
        w: Number(w),
        h: Number(h),
      },
      url: thumbnailUrl,
    };
  }, [hoverPercent, thumbnail, thumbnailEntries, update, videoEl?.duration]);

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

        {currentThumbnail && portalElement && (
          <React.Fragment>
            <div
              ref={referenceRef}
              className={styles.hoverThumbnailReference}
              style={{ left: hoverPercent + '%' }}
            />

            <Portal element={portalElement}>
              <div
                className={styles.hoverThumbnail}
                ref={floatingRef}
                style={{
                  top: y + 'px',
                  left: x + 'px',
                  position: strategy,
                  display: hoverPercent > 0 ? 'block' : 'none',
                  width: currentThumbnail.rect.w,
                  height: currentThumbnail.rect.h,
                  backgroundImage: `url(${currentThumbnail.url})`,
                  backgroundPositionX: currentThumbnail.rect.x,
                  backgroundPositionY: currentThumbnail.rect.y,
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </Portal>
          </React.Fragment>
        )}

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
