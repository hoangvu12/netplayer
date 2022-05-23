import { PLAYER_CONTAINER_CLASS } from '../constants'
import { HotKey } from '../types'
import screenfull from '../utils/screenfull'

const fullscreenHotKey = (hotKey: string | string[] = 'f'): HotKey => ({
  fn: () => {
    if (!screenfull.isEnabled) return

    const containerEl = document.querySelector(PLAYER_CONTAINER_CLASS)

    if (!document.fullscreenElement) {
      // @ts-ignore
      screenfull.request(containerEl)
    } else {
      screenfull.exit()
    }
  },
  name: 'fullscreen',
  hotKey: hotKey
})

export default fullscreenHotKey
