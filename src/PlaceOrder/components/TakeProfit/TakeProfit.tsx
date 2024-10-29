import AddCircleIcon from '@mui/icons-material/AddCircle';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { ProfitTargets } from 'PlaceOrder/components/ProfitTargets/ProfitTargets.tsx';
import { QUOTE_CURRENCY } from 'PlaceOrder/constants.ts';
import { useStore } from 'PlaceOrder/context';
import { QuestionTooltip } from 'shared/components/QuestionTooltip/QuestionTooltip.tsx';
import { Switch } from 'shared/components/Switch/Switch.tsx';

import styles from './TakeProfit.module.scss';

export const TakeProfit = observer(() => {
  const {
    isTakeProfit,
    openProfitTargets,
    closeProfitTargets,
    profitTargets,
    addProfitTarget,
    numberOfProfitTargets,
    activeOrderSide,
    limitNumberProfitTargets,
    projectedProfit,
    errors,
  } = useStore();

  const handleToggleTakeProfit = () => {
    isTakeProfit ? closeProfitTargets() : openProfitTargets();
  };

  return (
    <div className={styles.root}>
      <div className={styles.topPanel}>
        <div
          className={cn(styles.titleWrapper, { [styles.active]: isTakeProfit })}
        >
          <QuestionTooltip message="Take Profit description" />
          Take Profit
        </div>
        <Switch checked={isTakeProfit} onChange={handleToggleTakeProfit} />
      </div>
      {isTakeProfit && (
        <>
          <ProfitTargets
            activeOrderSide={activeOrderSide}
            profitTargets={profitTargets}
          />
          {errors.length !== 0 && (
            <div className={styles.error}>{errors[0]}</div>
          )}
          {!limitNumberProfitTargets && (
            <div className={styles.addProfitButton} onClick={addProfitTarget}>
              <AddCircleIcon />
              Add profit target {numberOfProfitTargets + 1}/5
            </div>
          )}
          <div className={styles.projectedProfit}>
            <div className={styles.title}>Projected profit</div>
            <div className={styles.separator} />
            <div className={styles.value}>
              <span>{projectedProfit}</span> {QUOTE_CURRENCY}
            </div>
          </div>
        </>
      )}
    </div>
  );
});
