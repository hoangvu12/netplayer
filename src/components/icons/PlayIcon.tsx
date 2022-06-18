import * as React from 'react';
import { SVGProps, memo } from 'react';

const PlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="svg-icon-nfplayerPlay"
    style={{ width: '100%', height: '100%' }}
    {...props}
  >
    <path
      d="M4 2.691a1 1 0 0 1 1.482-.876l16.925 9.309a1 1 0 0 1 0 1.752L5.482 22.185A1 1 0 0 1 4 21.309V2.69Z"
      fill="currentColor"
    />
  </svg>
);

export default memo(PlayIcon);
