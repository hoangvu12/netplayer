import * as React from 'react';

import { useVideo } from '../../contexts/VideoContext';
import { convertTime } from '../../utils';

const TimeIndicator = () => {
  const { videoState } = useVideo();

  return (
    <p>
      {convertTime(videoState.currentTime)} /{' '}
      {convertTime(videoState.duration || 0)}
    </p>
  );
};

export default React.memo(TimeIndicator);
