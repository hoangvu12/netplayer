import * as React from 'react';

import PauseIcon from '../icons/PauseIcon';
import Indicator, { createIndicator } from './Indicator';

const PauseIndicator = createIndicator((props, ref) => {
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
        <PauseIcon />
      </div>
    </Indicator>
  );
});

export default React.memo(PauseIndicator);
