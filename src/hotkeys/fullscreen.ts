import { PLAYER_CONTAINER_CLASS } from '../constants';
import { HotKey } from '../types';
import { isMobile } from '../utils/device';
import screenfull from '../utils/screenfull';

const fullscreenHotKey = (hotKey: string | string[] = 'f'): HotKey => ({
  fn: () => {
    if (!screenfull.isEnabled) return;

    const containerEl = document.querySelector('.' + PLAYER_CONTAINER_CLASS);

    if (!containerEl) return;

    if (!document.fullscreenElement) {
      screenfull.request(containerEl as HTMLElement).then(() => {
        if (!isMobile) return;

        screen.orientation.lock('landscape');
      });
    } else {
      screenfull.exit().then(() => {
        if (!isMobile) return;

        screen.orientation.lock('portrait');
      });
    }
  },
  name: 'fullscreen',
  hotKey: hotKey,
});

export default fullscreenHotKey;
