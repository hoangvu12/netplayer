import { classNames } from '../../utils';
import * as React from 'react';
import styles from './TextIcon.module.css';

export interface TextIconProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'as'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  as?: string | React.ComponentType<{ className: string }>;
}

const TextIcon: React.FC<TextIconProps> = ({
  leftIcon,
  rightIcon,
  as: Component = 'div',
  children,
  className = '',
  ...props
}) => {
  return (
    <Component className={classNames(styles.container, className)} {...props}>
      {leftIcon}
      <p>{children}</p>
      {rightIcon}
    </Component>
  );
};

export default TextIcon;
