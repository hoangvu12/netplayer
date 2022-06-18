import * as React from 'react';
import { SVGProps, memo } from 'react';

const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="iconify iconify--mdi"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    style={{ width: '100%', height: '100%' }}
    {...props}
  >
    <path
      fill="currentColor"
      d="M21 7 9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7Z"
    />
  </svg>
);

const Memo = memo(CheckIcon);
export default Memo;
