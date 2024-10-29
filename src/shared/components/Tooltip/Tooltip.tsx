import type { ReactNode } from 'react';
import { Tooltip as MUITooltip, TooltipProps } from '@mui/material';

import styles from './Tooltip.module.scss';

interface Props {
  message: ReactNode;
  children: TooltipProps['children'];
  open?: boolean;
  placement?: TooltipProps['placement'];
  disableInteractive?: boolean;
  disableHoverListener?: boolean;
  disableTouchListener?: boolean;

  onClose?(): void;
}

function Tooltip({
  children,
  message,
  placement = 'bottom',
  open,
  disableInteractive = true,
  disableHoverListener,
  disableTouchListener,
  onClose,
}: Props) {
  return (
    <MUITooltip
      arrow
      disableFocusListener // onFocus and onBlur do not work if using a Tooltip with TextField https://github.com/mui-org/material-ui/issues/19883#issuecomment-592980194
      classes={{
        tooltip: styles.root,
        arrow: styles.arrow,
        popper: styles.popper,
      }}
      disableHoverListener={disableHoverListener}
      disableInteractive={disableInteractive}
      disableTouchListener={disableTouchListener}
      open={open}
      placement={placement}
      title={<>{message}</>}
      onClose={onClose}
    >
      {children}
    </MUITooltip>
  );
}

export { Tooltip };
