import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'
import { classNames } from '../../utils'
import ArrowLeftIcon from '../icons/ArrowLeftIcon'
import ArrowRightIcon from '../icons/ArrowRightIcon'
import TextIcon from '../TextIcon'
import styles from './NestedMenu.module.css'
import CheckIcon from '../icons/CheckIcon'
interface Menu {
  title: string
  menuKey: string
}

interface ContextProps {
  activeMenu: Menu
  push: (menu: Menu) => void
  pop: () => void
}

interface NestedMenuProps extends React.HTMLProps<HTMLDivElement> {}

const defaultHistory: Menu[] = [{ menuKey: 'base', title: 'base' }]

const NestedMenuContext = createContext<ContextProps>({
  activeMenu: { menuKey: 'base', title: 'Base' },
  push: () => {},
  pop: () => {}
})

const NestedMenu = ({
  children,
  className = '',
  ...props
}: PropsWithChildren<NestedMenuProps>) => {
  const [history, setHistory] = useState<Menu[]>(defaultHistory)

  const handleGoBack = useCallback(() => {
    setHistory((prev) => prev.slice(0, -1))
  }, [])

  const historyPush = useCallback((menu: Menu) => {
    setHistory((prev) => [...prev, menu])
  }, [])

  const historyPop = useCallback(() => {
    setHistory((prev) => prev.slice(0, -1))
  }, [])

  const activeMenu = useMemo(() => history[history.length - 1], [history])

  return (
    <NestedMenuContext.Provider
      value={{
        activeMenu,
        push: historyPush,
        pop: historyPop
      }}
    >
      <div className={classNames(styles.container, className)} {...props}>
        {activeMenu.menuKey !== 'base' && (
          <TextIcon
            onClick={handleGoBack}
            leftIcon={
              <div style={{ width: '1.25rem', height: '1.25rem' }}>
                <ArrowLeftIcon />
              </div>
            }
            className={styles.goBackButton}
          >
            {activeMenu.title}
          </TextIcon>
        )}

        <ul className={styles.itemContainer}>{children}</ul>
      </div>
    </NestedMenuContext.Provider>
  )
}

export interface ItemProps
  extends Omit<React.HTMLProps<HTMLLIElement>, 'onChange'> {
  parentMenuKey?: string
  itemKey: string
  title: string
  activeItemKey?: string
  value: string
  onChange?: (value: string) => void
}

export interface BaseItemProps
  extends Omit<React.HTMLProps<HTMLLIElement>, 'slot'> {
  title: string
  isShown?: boolean
  isActive?: boolean
  activeIcon?: React.ReactNode
  slot?: React.ReactNode
}

const BaseItem = React.memo<BaseItemProps>(
  ({
    title,
    isShown,
    isActive,
    className = '',
    activeIcon,
    slot,
    ...props
  }) => {
    return isShown ? (
      <li className={classNames(styles.baseItem, className)} {...props}>
        {isActive && activeIcon && (
          <div className={styles.activeIconContainer}>{activeIcon}</div>
        )}

        <p className={styles.baseItemTitle}>{title}</p>

        {slot}
      </li>
    ) : null
  }
)

const Item = React.memo<ItemProps>(
  ({
    title,
    parentMenuKey = 'base',
    itemKey,
    className,
    activeItemKey,
    value,
    onChange,
    ...props
  }) => {
    const { activeMenu } = useContext(NestedMenuContext)

    const isMenuActive = parentMenuKey === activeMenu.menuKey
    const isItemActive = activeItemKey === itemKey

    return (
      <BaseItem
        title={title}
        isShown={isMenuActive}
        isActive={isItemActive}
        onClick={() => {
          onChange?.(value)
        }}
        activeIcon={<CheckIcon />}
        {...props}
      />
    )
  }
)

export interface SubMenuProps
  extends Omit<React.HTMLProps<HTMLUListElement>, 'onChange'> {
  menuKey: string
  title: string
  activeItemKey?: string
  parentMenuKey?: string
  icon?: React.ReactNode
  onChange?: (value: string) => void
}

const SubMenu: React.FC<SubMenuProps> = ({
  children,
  menuKey,
  title,
  activeItemKey,
  parentMenuKey = 'base',
  className = '',
  icon,
  onChange,
  ...props
}) => {
  const { activeMenu, push } = useContext(NestedMenuContext)

  const isActive = useMemo(
    () => activeMenu.menuKey === menuKey,
    [activeMenu.menuKey, menuKey]
  )
  const isParentActive = useMemo(
    () => activeMenu.menuKey === parentMenuKey,
    [activeMenu.menuKey, menuKey]
  )

  const handleSetMenu = useCallback(() => {
    push({
      menuKey,
      title
    })
  }, [menuKey, title])

  const resolvedChildren:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactPortal =
    React.isValidElement(children) && children.type === React.Fragment
      ? children.props.children
      : children

  if (React.Children.count(resolvedChildren) === 0) {
    return null
  }

  const childrenWithMenuKey = React.Children.map(resolvedChildren, (child) => {
    if (!React.isValidElement(child)) return

    const newElement = React.cloneElement(child, {
      ...child.props,
      parentMenuKey: menuKey,
      activeItemKey,
      onChange
    })

    return newElement
  })

  const itemProps = React.Children.map(resolvedChildren, (child) => {
    if (!React.isValidElement(child)) return

    return child.props as ItemProps
  })

  const activeItem = itemProps?.find((item) => item?.itemKey === activeItemKey)

  return isActive ? (
    <ul className={classNames(styles.subMenuContainer, className)} {...props}>
      {childrenWithMenuKey}
    </ul>
  ) : isParentActive ? (
    <BaseItem
      title={title}
      isShown
      isActive
      activeIcon={icon}
      onClick={handleSetMenu}
      slot={
        <div className={styles.subMenuSlotContainer}>
          {activeItem?.title && (
            <p className={styles.subMenuSlotTitle}>{activeItem.title}</p>
          )}

          <div className={styles.subMenuSlotIcon}>
            <ArrowRightIcon />
          </div>
        </div>
      }
    />
  ) : (
    <React.Fragment>{children}</React.Fragment>
  )
}

NestedMenu.Item = Item
NestedMenu.SubMenu = SubMenu

export default NestedMenu
