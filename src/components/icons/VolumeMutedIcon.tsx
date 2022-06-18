import * as React from 'react';
import { SVGProps, memo } from 'react';

const VolumeMutedIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M11 4a1 1 0 0 0-1.707-.707L4.586 8H1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3.586l4.707 4.707A1 1 0 0 0 11 20V4ZM5.707 9.707 9 6.414v11.172l-3.293-3.293L5.414 14H2v-4h3.414l.293-.293Zm9.586 0L17.586 12l-2.293 2.293 1.414 1.414L19 13.414l2.293 2.293 1.414-1.414L20.414 12l2.293-2.293-1.414-1.414L19 10.586l-2.293-2.293-1.414 1.414Z"
      fill="currentColor"
    />
  </svg>
);

export default memo(VolumeMutedIcon);
