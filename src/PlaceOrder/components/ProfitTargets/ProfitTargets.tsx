import cn from 'classnames';

import { ProfitTarget } from 'PlaceOrder/components/ProfitTargets/ProfitTarget/ProfitTarget.tsx';
import {
  OrderSide,
  ProfitTarget as ProfitTargetType,
} from 'PlaceOrder/model.ts';

import styles from './ProfitTargets.module.scss';

interface Props {
  profitTargets: ProfitTargetType[];
  activeOrderSide: OrderSide;
}

export const ProfitTargets = ({ profitTargets, activeOrderSide }: Props) => {
  return (
    <div className={styles.root}>
      <div className={cn(styles.row, styles.headerRow)}>
        <div className={styles.title}>Profit</div>
        <div className={styles.title}>Target price</div>
        <div className={styles.title}>
          {activeOrderSide === 'buy' ? 'Amount to buy' : 'Amount to sell'}
        </div>
      </div>
      {profitTargets.map((profitTarget) => (
        <div
          className={cn(styles.row, styles.bodyRow, {
            [styles.error]: profitTarget.hasError,
          })}
          key={profitTarget.id}
        >
          <ProfitTarget profitTarget={profitTarget} />
        </div>
      ))}
    </div>
  );
};
