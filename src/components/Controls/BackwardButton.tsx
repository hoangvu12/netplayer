import React, { useRef } from 'react'
import ControlButton from './ControlButton'
import BackwardIcon from '../icons/BackwardIcon'
import { useVideo } from '../../contexts/VideoContext'
import BackwardIndicator from '../Indicator/BackwardIndicator'
import { IndicatorRef } from '../Indicator/Indicator'
import { useVideoProps } from '../../contexts/VideoPropsContext'
import { stringInterpolate } from '../../utils'

const BackwardButton = () => {
  const { videoEl } = useVideo()
  const { i18n } = useVideoProps()
  const backwardIndicator = useRef<IndicatorRef>(null)

  const handleClick = () => {
    if (!videoEl) return

    backwardIndicator.current?.show()
    videoEl.currentTime = videoEl.currentTime - 10
  }

  return (
    <ControlButton
      tooltip={stringInterpolate(i18n.controls.backward, { time: 10 })}
      onClick={handleClick}
    >
      <BackwardIcon />

      <BackwardIndicator ref={backwardIndicator} />
    </ControlButton>
  )
}

export default BackwardButton
