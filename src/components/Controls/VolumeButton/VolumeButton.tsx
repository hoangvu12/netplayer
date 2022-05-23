import React, { useCallback, useMemo, useRef } from 'react'
import { useVideo } from '../../../contexts/VideoContext'
import { useVideoProps } from '../../../contexts/VideoPropsContext'
import useHotKey, { parseHotKey } from '../../../hooks/useHotKey'
import { stringInterpolate } from '../../../utils'
import VolumeMutedIcon from '../../icons/VolumeMutedIcon'
import VolumeOneIcon from '../../icons/VolumeOneIcon'
import VolumeThreeIcon from '../../icons/VolumeThreeIcon'
import VolumeTwoIcon from '../../icons/VolumeTwoIcon'
import Slider from '../../Slider'
import ControlButton from '../ControlButton'
import styles from './VolumeButton.module.css'

const VolumeComponents = {
  0: VolumeMutedIcon,
  0.25: VolumeOneIcon,
  0.5: VolumeTwoIcon,
  1: VolumeThreeIcon
}

const VolumeButton = () => {
  const { videoState, videoEl } = useVideo()
  const { i18n } = useVideoProps()
  const hotkey = useHotKey('volume')
  const previousVolume = useRef(videoState.volume)

  const VolumeComponent = useMemo(() => {
    const entries = Object.entries(VolumeComponents).sort(
      (a, b) => Number(a[0]) - Number(b[0])
    )

    for (const [key, value] of entries) {
      if (videoState.volume <= Number(key)) {
        return value
      }
    }

    return VolumeMutedIcon
  }, [videoState.volume])

  const handleClick = useCallback(() => {
    if (!videoEl) return

    if (videoEl.volume === 0) {
      videoEl.volume = previousVolume.current
    } else {
      previousVolume.current = videoEl.volume
      videoEl.volume = 0
    }
  }, [videoEl])

  const handleVolumeChange = useCallback(
    (percent: number) => {
      if (!videoEl) return

      videoEl.volume = percent / 100
    },
    [videoEl]
  )

  return (
    <div className={styles.buttonContainer}>
      <ControlButton
        tooltip={
          videoState.volume === 0
            ? stringInterpolate(i18n.controls.unmuteVolume, {
                shortcut: parseHotKey(hotkey?.hotKey)
              })
            : stringInterpolate(i18n.controls.muteVolume, {
                shortcut: parseHotKey(hotkey?.hotKey)
              })
        }
        onClick={handleClick}
      >
        <VolumeComponent />
      </ControlButton>

      <Slider
        onPercentChange={handleVolumeChange}
        onPercentChanging={handleVolumeChange}
        className={styles.sliderContainer}
      >
        <Slider.Bar
          className={styles.mainBar}
          percent={videoState.volume * 100}
        />
        <Slider.Bar className={styles.backgroundBar} />
        <Slider.Dot className={styles.dot} percent={videoState.volume * 100} />
      </Slider>
    </div>
  )
}

export default VolumeButton
