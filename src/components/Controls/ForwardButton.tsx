import * as React from 'react';
import ControlButton from './ControlButton';
import ForwardIcon from '../icons/ForwardIcon';
import { useVideo } from '../../contexts/VideoContext';
import { IndicatorRef } from '../Indicator/Indicator';
import ForwardIndicator from '../Indicator/ForwardIndicator';
import { useVideoProps } from '../../contexts/VideoPropsContext';
import { stringInterpolate } from '../../utils';

const ForwardButton = () => {
  const { videoEl } = useVideo();
  const { i18n } = useVideoProps();
  const forwardIndicator = React.useRef<IndicatorRef>(null);

  const handleClick = () => {
    if (!videoEl) return;

    forwardIndicator.current?.show();
    videoEl.currentTime = videoEl.currentTime + 10;
  };

  return (
    <ControlButton
      tooltip={stringInterpolate(i18n.controls.forward, { time: 10 })}
      onClick={handleClick}
    >
      <ForwardIcon />

      <ForwardIndicator ref={forwardIndicator} />
    </ControlButton>
  );
};

export default React.memo(ForwardButton);
