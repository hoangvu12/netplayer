import { PLAYER_CONTAINER_CLASS } from '../constants';
import { HotKey } from '../types';
import { isIOS, isMobile } from '../utils/device';
import screenfull from '../utils/screenfull';

const fullscreenHotKey = (hotKey: string | string[] = 'f'): HotKey => ({
  fn: () => {
    if (!screenfull.isEnabled) return;

    const containerElSelector = !isIOS
      ? `.${PLAYER_CONTAINER_CLASS}`
      : `.${PLAYER_CONTAINER_CLASS} video`;

    const containerEl = document.querySelector(containerElSelector);

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
