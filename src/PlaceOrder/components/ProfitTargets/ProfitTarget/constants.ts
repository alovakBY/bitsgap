import { PERCENTAGE, QUOTE_CURRENCY } from 'PlaceOrder/constants.ts';
import type { ProfitTargetInputs } from 'PlaceOrder/model.ts';

export const CELLS: {
  fieldId: ProfitTargetInputs;
  prefix: typeof PERCENTAGE | typeof QUOTE_CURRENCY;
  renderCloseButton?: boolean;
}[] = [
  {
    fieldId: 'profit',
    prefix: PERCENTAGE,
  },
  {
    fieldId: 'targetPrice',
    prefix: QUOTE_CURRENCY,
  },
  {
    fieldId: 'amount',
    prefix: PERCENTAGE,
    renderCloseButton: true,
  },
];
