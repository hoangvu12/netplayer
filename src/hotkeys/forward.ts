import { HotKey } from '../types';

const forwardHotKey = (hotKey: string | string[] = 'right'): HotKey => ({
  fn: (videoEl: HTMLVideoElement) => {
    videoEl.currentTime = videoEl.currentTime + 10;
  },
  name: 'forward',
  hotKey: hotKey,
});

export default forwardHotKey;
