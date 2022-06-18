import { HotKey } from '../types';

const playPauseHotKey = (
  hotKey: string | string[] = ['k', 'space']
): HotKey => ({
  fn: (videoEl: HTMLVideoElement) => {
    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  },
  name: 'playPause',
  hotKey: hotKey,
});

export default playPauseHotKey;
