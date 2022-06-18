import * as React from 'react';
import { SVGProps, memo } from 'react';

const FullscreenExitIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-uia="control-fullscreen-exit"
    style={{ width: '100%', height: '100%' }}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 8h-5V3h-2v7h7V8ZM0 16h5v5h2v-7H0v2Zm7-6H0V8h5V3h2v7Zm12 11v-5h5v-2h-7v7h2Z"
      fill="currentColor"
    />
  </svg>
);

export default memo(FullscreenExitIcon);
