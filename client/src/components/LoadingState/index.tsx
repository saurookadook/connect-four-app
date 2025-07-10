import classNames from 'classnames';
import './styles.css';

export function LoadingState({
  className, // force formatting
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classNames('loading-spinner', className)} // force formatting
      {...props}
    ></div>
  );
}
