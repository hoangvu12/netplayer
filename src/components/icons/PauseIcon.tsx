import * as React from 'react';
import { SVGProps, memo } from 'react';

const PauseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="svg-icon-nfplayerPause"
    style={{ width: '100%', height: '100%' }}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 3a.5.5 0 0 0-.5.5v17a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-17a.5.5 0 0 0-.5-.5h-5Zm10 0a.5.5 0 0 0-.5.5v17a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-17a.5.5 0 0 0-.5-.5h-5Z"
      fill="currentColor"
    />
  </svg>
);

export default memo(PauseIcon);
