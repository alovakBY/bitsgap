import { FormEvent } from 'react';
import { observer } from 'mobx-react';

import { Button } from 'shared/components/Button/Button';
import { NumberInput } from 'shared/components/NumberInput/NumberInput';
import { QuestionTooltip } from 'shared/components/QuestionTooltip/QuestionTooltip';

import { PlaceOrderTypeSwitch } from './components/PlaceOrderTypeSwitch/PlaceOrderTypeSwitch';
import { TakeProfit } from './components/TakeProfit/TakeProfit';
import { BASE_CURRENCY, QUOTE_CURRENCY } from './constants';
import { useStore } from './context';

import styles from './PlaceOrderForm.module.scss';

export const PlaceOrderForm = observer(() => {
  const {
    activeOrderSide,
    price,
    total,
    amount,
    setPrice,
    setAmount,
    setTotal,
    setOrderSide,
    validate,
  } = useStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    validate();
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <div className={styles.label}>
        Market direction{' '}
        <QuestionTooltip message="Market direction description" />
      </div>
      <div className={styles.content}>
        <div className={styles.typeSwitch}>
          <PlaceOrderTypeSwitch
            activeOrderSide={activeOrderSide}
            onChange={setOrderSide}
          />
        </div>
        <NumberInput
          label={`Price, ${QUOTE_CURRENCY}`}
          value={price}
          onChange={(value) => setPrice(Number(value))}
        />
        <NumberInput
          label={`Amount, ${BASE_CURRENCY}`}
          value={amount}
          onChange={(value) => setAmount(Number(value))}
        />
        <NumberInput
          label={`Total, ${QUOTE_CURRENCY}`}
          value={total}
          onChange={(value) => setTotal(Number(value))}
        />
        <TakeProfit />
        <div className={styles.submit}>
          <Button
            fullWidth
            color={activeOrderSide === 'buy' ? 'green' : 'red'}
            type="submit"
          >
            {activeOrderSide === 'buy'
              ? `Buy ${BASE_CURRENCY}`
              : `Sell ${QUOTE_CURRENCY}`}
          </Button>
        </div>
      </div>
    </form>
  );
});
