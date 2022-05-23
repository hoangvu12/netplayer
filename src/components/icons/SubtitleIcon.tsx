import * as React from 'react'
import { SVGProps, memo } from 'react'

const SubtitleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='Hawkins-Icon Hawkins-Icon-Standard'
    style={{ width: '100%', height: '100%' }}
    {...props}
  >
    <path
      fill='currentColor'
      d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z'
    />
  </svg>
)

export default memo(SubtitleIcon)
