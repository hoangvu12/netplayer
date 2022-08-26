import { parse } from '@plussub/srt-vtt-parser';
import { Entry } from '@plussub/srt-vtt-parser/dist/src/types';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { buildAbsoluteURL } from 'url-toolkit';
import { PLAYER_CONTAINER_CLASS } from '../../constants';
import { useVideo, useVideoProps } from '../../contexts';
import { usePopover } from '../../hooks';
import { isValidUrl } from '../../utils';
import Portal from '../Portal';
import styles from './ProgressSlider/ProgressSlider.module.css';

const playerContainerClass = '.' + PLAYER_CONTAINER_CLASS;

interface ThumbnailHoverProps {
  hoverPercent: number;
}

const ThumbnailHover: React.FC<ThumbnailHoverProps> = ({ hoverPercent }) => {
  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(
    null
  );
  const [thumbnailEntries, setThumbnailEntries] = useState<Entry[]>([]);
  const { thumbnail } = useVideoProps();
  const { videoEl } = useVideo();

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

  return currentThumbnail && portalElement ? (
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
            zIndex: '50',
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
  ) : null;
};

export default ThumbnailHover;
