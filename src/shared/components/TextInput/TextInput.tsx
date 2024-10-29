import { ChangeEvent, FocusEvent, ReactNode, useState } from 'react';
import {
  InputBaseProps as MUIInputProps,
  InputLabelProps as MUIInputLabelProps,
  TextField,
  TextFieldProps,
  TooltipProps,
} from '@mui/material';
import cn from 'classnames';

import { Tooltip } from '../Tooltip/Tooltip';

import styles from './TextInput.module.scss';

type Props = Omit<
  TextFieldProps,
  'variant' | 'onChange' | 'className' | 'classes' | 'error'
> & {
  error?: ReactNode;
  InputLabelProps?: Omit<
    TextFieldProps['InputLabelProps'],
    'className' | 'classes'
  >;
  InputProps?: Omit<
    TextFieldProps['InputProps'],
    'disableUnderline' | 'classes' | 'className'
  >;
  errorPlacement?: TooltipProps['placement'];
  onChange?(value: string): void;
  variant?: 'table' | '';
};

const TextInput = ({
  error,
  onChange,
  onFocus,
  onBlur,
  InputLabelProps,
  InputProps,
  errorPlacement = 'top',
  variant = '',
  ...rest
}: Props) => {
  const inputClasses: MUIInputProps['classes'] = {
    root: cn(styles.inputWrapper, {
      [styles.error]: Boolean(error),
      [styles[variant]]: Boolean(variant),
    }),
    focused: cn(styles.inputWrapper, styles.focused),
    adornedEnd: cn(styles.inputWrapper, styles.adornedEnd),
    adornedStart: cn(styles.inputWrapper, styles.adornedStart),
    input: cn(styles.input, styles[variant]),
  };

  const labelClasses: MUIInputLabelProps['classes'] = {
    root: styles.inputLabel,
  };

  const [isFocused, setIsFocused] = useState(false);

  return (
    <Tooltip
      message={error ?? ''}
      open={isFocused && !!error}
      placement={errorPlacement}
    >
      <TextField
        {...rest}
        InputLabelProps={{
          ...InputLabelProps,
          classes: labelClasses,
        }}
        InputProps={{
          ...InputProps,
          onFocus: handleFocus,
          onBlur: handleBlur,
          disableUnderline: true,
          classes: inputClasses,
        }}
        className={styles.root}
        variant="filled"
        onChange={handleChange}
      />
    </Tooltip>
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event.target.value);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    onFocus ? onFocus(event) : InputProps?.onFocus?.(event);
    setIsFocused(true);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    onBlur ? onBlur(event) : InputProps?.onBlur?.(event);
    setIsFocused(false);
  }
};

export { TextInput };
export type { Props as TextInputProps };
