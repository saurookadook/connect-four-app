import * as React from 'react';
import classNames from 'classnames';

import './styles.css';

export type FlexRowProps = React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>;

export function FlexRow({ children, className, ...props }: FlexRowProps) {
  return (
    <div className={classNames('flex-row', className)} {...props}>
      {children}
    </div>
  );
}
