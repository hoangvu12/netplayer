import * as React from 'react';
import { SVGProps, memo } from 'react';

const FullscreenEnterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-uia="control-fullscreen-enter"
    style={{ width: '100%', height: '100%' }}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 5a2 2 0 0 1 2-2h7v2H2v4H0V5Zm22 0h-7V3h7a2 2 0 0 1 2 2v4h-2V5ZM2 15v4h7v2H2a2 2 0 0 1-2-2v-4h2Zm20 4v-4h2v4a2 2 0 0 1-2 2h-7v-2h7Z"
      fill="currentColor"
    />
  </svg>
);

export default memo(FullscreenEnterIcon);
