import * as React from 'react';
import { SVGProps, memo } from 'react';

const AudioIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="iconify iconify--ic"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    style={{ width: '100%', height: '100%' }}
    {...props}
  >
    <path
      fill="currentColor"
      d="M12 5v8.55c-.94-.54-2.1-.75-3.33-.32-1.34.48-2.37 1.67-2.61 3.07a4.007 4.007 0 0 0 4.59 4.65c1.96-.31 3.35-2.11 3.35-4.1V7h2c1.1 0 2-.9 2-2s-.9-2-2-2h-2c-1.1 0-2 .9-2 2z"
    />
  </svg>
);

const Memo = memo(AudioIcon);
export default Memo;
