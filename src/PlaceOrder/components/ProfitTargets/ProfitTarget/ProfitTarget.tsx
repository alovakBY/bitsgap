import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton } from '@mui/material';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { CELLS } from 'PlaceOrder/components/ProfitTargets/ProfitTarget/constants.ts';
import { useStore } from 'PlaceOrder/context.tsx';
import {
  ProfitTarget as ProfitTargetType,
  ProfitTargetInputs,
} from 'PlaceOrder/model.ts';
import { NumberInput } from 'shared/components/NumberInput/NumberInput.tsx';

import styles from './ProfitTarget.module.scss';

interface Props {
  profitTarget: ProfitTargetType;
}

export const ProfitTarget = observer(({ profitTarget }: Props) => {
  const {
    changeProfitTarget,
    recalculateProfit,
    recalculateTargetPrice,
    removeProfitTarget,
  } = useStore();

  const handleChange = ({
    value,
    fieldId,
  }: {
    value: number;
    fieldId: ProfitTargetInputs;
  }) => {
    changeProfitTarget({
      value,
      fieldId,
      profitTargetId: profitTarget.id,
    });
  };

  const onBlur = (fieldId: ProfitTargetInputs) => {
    if (fieldId === 'targetPrice') {
      recalculateProfit(profitTarget.id);
    }
    if (fieldId === 'profit') {
      recalculateTargetPrice(profitTarget.id);
    }
  };

  return CELLS.map(({ fieldId, prefix, renderCloseButton = false }) => (
    <div className={cn(styles.cellContent, styles[fieldId])} key={fieldId}>
      <div
        className={cn(styles.inputWrapper, styles[fieldId], {
          [styles.error]: profitTarget.hasError,
        })}
      >
        <NumberInput
          value={profitTarget[fieldId]}
          variant="table"
          onBlur={() => onBlur(fieldId)}
          onChange={(value) => handleChange({ value: Number(value), fieldId })}
        />
        <div className={styles.prefix}>{prefix}</div>
      </div>
      {renderCloseButton && (
        <IconButton
          className={styles.closeButton}
          onClick={() => removeProfitTarget(profitTarget.id)}
        >
          <CloseRoundedIcon fontSize="inherit" />
        </IconButton>
      )}
    </div>
  ));
});
