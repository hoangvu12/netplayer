import * as React from 'react';

import PlayIcon from '../icons/PlayIcon';
import Indicator, { createIndicator } from './Indicator';

const PlayIndicator = createIndicator((props, ref) => {
  return (
    <Indicator
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      {...props}
      ref={ref}
    >
      <div style={{ width: '50%', height: '50%' }}>
        <PlayIcon />
      </div>
    </Indicator>
  );
});

export default React.memo(PlayIndicator);
