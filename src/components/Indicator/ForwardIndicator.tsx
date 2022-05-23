import * as React from 'react';

import ForwardIcon from '../icons/ForwardIcon';
import Indicator, { createIndicator } from './Indicator';

const ForwardIndicator = createIndicator((props, ref) => {
  return (
    <Indicator
      style={{
        top: '50%',
        left: '90%',
        transform: 'translate(-90%, -50%)',
      }}
      {...props}
      ref={ref}
    >
      <div style={{ width: '50%', height: '50%' }}>
        <ForwardIcon />
      </div>
    </Indicator>
  );
});

export default React.memo(ForwardIndicator);
