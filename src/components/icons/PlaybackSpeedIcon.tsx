import * as React from 'react';
import { SVGProps, memo } from 'react';

const PlaybackSpeedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="Hawkins-Icon Hawkins-Icon-Standard"
    style={{ width: '100%', height: '100%' }}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.643 7.438c-3.122-3.25-8.164-3.25-11.286 0-3.143 3.273-3.143 8.596 0 11.87l-1.442 1.385c-3.887-4.048-3.887-10.593 0-14.64 3.908-4.07 10.262-4.07 14.17 0 3.887 4.047 3.887 10.592 0 14.64l-1.442-1.386c3.143-3.273 3.143-8.596 0-11.87ZM14 14a2 2 0 1 1-1.482-1.932l3.275-3.275 1.414 1.414-3.275 3.275c.044.165.068.339.068.518Z"
      fill="currentColor"
    />
  </svg>
);

export default memo(PlaybackSpeedIcon);
