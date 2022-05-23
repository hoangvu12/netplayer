import {
  autoUpdate,
  computePosition,
  ComputePositionConfig,
  detectOverflow,
  DetectOverflowOptions,
  Middleware,
  offset,
  shift
} from '@floating-ui/dom'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { classNames } from '../../utils'
import Portal from '../Portal'
import styles from './Popover.module.css'

export interface PopoverProps extends Partial<ComputePositionConfig> {
  reference: React.ReactNode
  referenceProps?: React.HTMLAttributes<HTMLElement>
  popperProps?: React.HTMLAttributes<HTMLElement>
  type?: 'click' | 'hover'
  portalSelector?: string
  avoidOverflowSelector?: string
  avoidOverflowOptions?: Partial<DetectOverflowOptions>
}

const noop = () => {}

const avoidOverflow = (
  options?: Partial<DetectOverflowOptions>
): Middleware => ({
  fn: async (args) => {
    const { x, y } = args

    const overflow = await detectOverflow(args, {
      rootBoundary: 'viewport',
      padding: 20,
      ...options
    })

    let newX = x
    let newY = y

    if (overflow.left > 0) {
      newX = newX + overflow.left
    } else if (overflow.right > 0) {
      newX = newX - overflow.right
    } else if (overflow.top > 0) {
      newY = newY + overflow.top
    } else if (overflow.bottom > 0) {
      newY = newY - overflow.bottom
    }

    return { x: newX, y: newY }
  },
  name: 'avoidOverflow'
})

const Popover: React.FC<PopoverProps> = ({
  reference,
  children,
  popperProps = {},
  referenceProps = {},
  type = 'click',
  portalSelector,
  avoidOverflowSelector,
  avoidOverflowOptions,
  ...options
}) => {
  const [portalElement, setPortalElement] = useState<Element>(document.body)
  const [avoidOverflowElement, setAvoidOverflowElement] = useState<Element>()
  const referenceRef = useRef<HTMLDivElement>(null)
  const floatingRef = useRef<HTMLDivElement>(null)

  const { className: popperClassName = '', ...popperRest } = popperProps!
  const { className: referenceClassName = '', ...referenceRest } =
    referenceProps!

  const [isOpen, setIsOpen] = useState(false)

  const handleOpen: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()

      setIsOpen(true)
    },
    []
  )

  const handleClose: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()

      setIsOpen(false)
    },
    []
  )

  useLayoutEffect(() => {
    if (!portalSelector) return

    const el = document.querySelector(portalSelector)

    if (!el) return

    setPortalElement(el)
  }, [portalSelector])

  useLayoutEffect(() => {
    if (!avoidOverflowSelector) return

    const el = document.querySelector(avoidOverflowSelector)

    if (!el) return

    setAvoidOverflowElement(el)
  }, [avoidOverflowSelector])

  useLayoutEffect(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return
    }

    const update = async () => {
      if (!referenceRef.current || !floatingRef.current) {
        return
      }

      const { strategy, x, y } = await computePosition(
        referenceRef.current,
        floatingRef.current,
        {
          placement: 'top',
          middleware: [
            shift(),
            offset(10),
            avoidOverflow({
              boundary: avoidOverflowElement,
              ...avoidOverflowOptions
            })
          ],
          strategy: 'absolute',
          ...options
        }
      )

      floatingRef.current.style.top = y + 'px'
      floatingRef.current.style.left = x + 'px'
      floatingRef.current.style.position = strategy
    }

    return autoUpdate(referenceRef.current, floatingRef.current, update)
  }, [portalElement, avoidOverflowElement])

  return (
    <React.Fragment>
      <div
        ref={referenceRef}
        onClick={type === 'click' ? handleOpen : noop}
        onMouseEnter={type === 'hover' ? handleOpen : noop}
        onMouseLeave={type === 'hover' ? handleClose : noop}
        className={classNames(referenceClassName)}
        {...referenceRest}
      >
        {reference}
      </div>

      <Portal element={portalElement}>
        <div
          style={{
            zIndex: 50
          }}
          className={classNames(
            styles.popperContainer,
            isOpen && styles.isOpen,
            popperClassName
          )}
          ref={floatingRef}
          {...popperRest}
        >
          {children}
        </div>

        {isOpen && type === 'click' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40
            }}
            onClick={handleClose}
          ></div>
        )}
      </Portal>
    </React.Fragment>
  )
}

export default Popover
