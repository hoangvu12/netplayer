import * as React from 'react'
import { SVGProps } from 'react'

const ArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className='iconify iconify--ic'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    style={{ width: '100%', height: '100%' }}
    {...props}
  >
    <path
      fill='currentColor'
      d='M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z'
    />
  </svg>
)

export default React.memo(ArrowLeftIcon)
