import { SvgIcon } from '@mui/material';
import cn from 'classnames';

import styles from './InfoIcon.module.scss';

interface Props {
  className?: string;
}

function InfoIcon({ className }: Props) {
  return (
    <SvgIcon
      className={cn(className, styles.root)}
      height={16}
      viewBox="0 0 16 16"
      width={16}
    >
      <path
        className={styles.circle}
        clipRule="evenodd"
        d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
        fillRule="evenodd"
      />
      <rect
        className={styles.char}
        height="5.33333"
        rx="0.666667"
        transform="rotate(-180 8.33334 11.3333)"
        width="1.33333"
        x="8.33334"
        y="11.3333"
      />
      <rect
        className={styles.char}
        height="1.33333"
        rx="0.666667"
        transform="rotate(-180 8.33334 5.33331)"
        width="1.33333"
        x="8.33334"
        y="5.33331"
      />
    </SvgIcon>
  );
}

export { InfoIcon };
