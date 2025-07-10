import * as React from 'react';
import classNames from 'classnames';

import './styles.css';

export type FlexColumnProps = React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>;

export function FlexColumn({ children, className, ...props }: FlexColumnProps) {
  return (
    <div className={classNames('flex-column', className)} {...props}>
      {children}
    </div>
  );
}
