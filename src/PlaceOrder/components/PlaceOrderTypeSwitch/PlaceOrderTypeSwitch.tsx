import { Button } from 'shared/components/Button/Button';

import type { OrderSide } from '../../model';

import styles from './PlaceOrderTypeSwitch.module.scss';

interface Props {
  activeOrderSide: OrderSide;
  onChange: (orderSide: OrderSide) => void;
}

const PlaceOrderTypeSwitch = ({ activeOrderSide, onChange }: Props) => {
  const handleToggle = (orderType: OrderSide) => {
    onChange(orderType);
  };

  return (
    <div className={styles.root}>
      <Button
        fullWidth
        color="green"
        inactive={activeOrderSide !== 'buy'}
        size="small"
        onClick={() => handleToggle('buy')}
      >
        Buy
      </Button>
      <Button
        fullWidth
        color="red"
        inactive={activeOrderSide === 'buy'}
        size="small"
        onClick={() => handleToggle('sell')}
      >
        Sell
      </Button>
    </div>
  );
};

export { PlaceOrderTypeSwitch };
