import * as React from 'react';

import BackwardIcon from '../icons/BackwardIcon';
import Indicator, { createIndicator } from './Indicator';

const BackwardIndicator = createIndicator((props, ref) => {
  return (
    <Indicator
      style={{
        top: '50%',
        left: '10%',
        transform: 'translate(-10%, -50%)',
      }}
      {...props}
      ref={ref}
    >
      <div style={{ width: '50%', height: '50%' }}>
        <BackwardIcon />
      </div>
    </Indicator>
  );
});

export default React.memo(BackwardIndicator);
