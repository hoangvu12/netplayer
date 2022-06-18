import * as React from 'react';
import { SVGProps, memo } from 'react';

const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="iconify iconify--ic"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    style={{ width: '100%', height: '100%' }}
    {...props}
  >
    <path
      fill="currentColor"
      d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"
    />
  </svg>
);

export default memo(ArrowRightIcon);
