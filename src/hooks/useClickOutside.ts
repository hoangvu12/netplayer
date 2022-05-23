import { useEffect } from 'react'

const useClickOutside = <T extends HTMLElement | null>(
  ref: React.MutableRefObject<T>,
  handler: (event: TouchEvent | MouseEvent) => void
) => {
  useEffect(() => {
    const listener = (event: TouchEvent | MouseEvent) => {
      const target = event.target as HTMLElement

      if (!ref.current) return

      if (ref.current?.contains(target)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

export default useClickOutside
