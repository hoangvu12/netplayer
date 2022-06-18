import { HotKey } from '../types';

const volumeHotKey = (hotKey: string | string[] = 'm'): HotKey => {
  let previousVolume = 1;

  return {
    fn: (videoEl: HTMLVideoElement) => {
      if (videoEl.volume === 0) {
        videoEl.volume = previousVolume;
      } else {
        previousVolume = videoEl.volume;
        videoEl.volume = 0;
      }
    },
    name: 'volume',
    hotKey: hotKey,
  };
};

export default volumeHotKey;
