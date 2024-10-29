import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

import type { OrderSide, ProfitTarget, ProfitTargetInputs } from '../model';

export class PlaceOrderStore {
  constructor() {
    makeObservable(this);

    reaction(
      (): [number, OrderSide] => [this.price, this.activeOrderSide],
      ([price, activeOrderSide]) => {
        this.profitTargets = this.profitTargets.map((item) => {
          const targetPrice =
            activeOrderSide === 'buy'
              ? price + (this.price * item.profit) / 100
              : price - (this.price * item.profit) / 100;

          return {
            ...item,
            targetPrice,
          };
        });
      },
    );
  }

  @observable activeOrderSide: OrderSide = 'buy';
  @observable price = 0;
  @observable amount = 0;
  @observable isTakeProfit = false;
  @observable profitTargets: ProfitTarget[] = [];
  @observable errors: string[] = [];

  @computed get total(): number {
    return this.price * this.amount;
  }

  @computed get limitNumberProfitTargets(): boolean {
    return this.numberOfProfitTargets === 5;
  }

  @computed get numberOfProfitTargets(): number {
    return this.profitTargets.length;
  }

  @computed get projectedProfit(): number {
    return this.profitTargets.reduce((result, profitTarget) => {
      const targetPrice = profitTarget.targetPrice;
      const amount = profitTarget.amount;

      result +=
        this.activeOrderSide === 'buy'
          ? ((this.amount * amount) / 100) * (targetPrice - this.price)
          : ((this.amount * amount) / 100) * (this.price - targetPrice);

      return result;
    }, 0);
  }

  @computed
  private get newProfitTarget(): ProfitTarget {
    const profit = this.numberOfProfitTargets
      ? this.profitTargets[this.numberOfProfitTargets - 1].profit + 2
      : 2;
    const price =
      this.activeOrderSide === 'buy'
        ? this.price + (this.price * profit) / 100
        : this.price - (this.price * profit) / 100;

    return {
      id: uuidv4(),
      hasError: false,
      profit: profit,
      targetPrice: price,
      amount: this.profitTargets.length === 0 ? 100 : 20,
    };
  }

  @action
  public setOrderSide = (side: OrderSide) => {
    this.activeOrderSide = side;
  };

  @action
  public setPrice = (price: number) => {
    this.price = price;
  };

  @action
  public setAmount = (amount: number) => {
    this.amount = amount;
  };

  @action
  public setTotal = (total: number) => {
    this.amount = this.price > 0 ? total / this.price : 0;
  };

  @action
  public openProfitTargets = () => {
    this.isTakeProfit = true;
    this.addProfitTarget();
  };

  @action
  public closeProfitTargets = () => {
    this.isTakeProfit = false;
    this.clearProfitTargets();
  };

  @action
  public addProfitTarget = () => {
    this.profitTargets.push(this.newProfitTarget);

    let totalAmount = 0;
    let maxAmount = 0;
    let profitTargetIndexWithMaxAmount = 0;

    this.profitTargets.forEach((profitTarget, index) => {
      const amount = profitTarget.amount;

      totalAmount += amount;

      if (amount > maxAmount) {
        maxAmount = amount;
        profitTargetIndexWithMaxAmount = index;
      }
    });

    if (totalAmount > 100) {
      const profitTargetWithMaxAmount =
        this.profitTargets[profitTargetIndexWithMaxAmount];

      profitTargetWithMaxAmount.amount =
        profitTargetWithMaxAmount.amount - (totalAmount - 100);
    }
  };

  @action
  public removeProfitTarget = (id: string) => {
    this.profitTargets = this.profitTargets.filter(
      (profitTarget) => profitTarget.id !== id,
    );
    if (this.profitTargets.length === 0) {
      this.closeProfitTargets();
    }
  };

  @action
  public clearProfitTargets = () => {
    this.profitTargets = [];
    this.errors = [];
  };

  @action
  public changeProfitTarget = ({
    profitTargetId,
    value,
    fieldId,
  }: {
    profitTargetId: string;
    value: number;
    fieldId: ProfitTargetInputs;
  }) => {
    this.profitTargets = this.profitTargets.map((profitTarget) => {
      if (profitTarget.id === profitTargetId) {
        return { ...profitTarget, [fieldId]: value, hasError: false };
      } else {
        return profitTarget;
      }
    });
  };

  @action
  public recalculateProfit = (profitTargetId: string) => {
    this.profitTargets = this.profitTargets.map((profitTarget) => {
      if (profitTarget.id === profitTargetId) {
        const targetPrice = profitTarget.targetPrice;

        return {
          ...profitTarget,
          profit:
            this.price > 0
              ? ((targetPrice - this.price) / this.price) * 100
              : profitTarget.profit,
        };
      } else {
        return profitTarget;
      }
    });
  };

  @action
  public recalculateTargetPrice = (profitTargetId: string) => {
    this.profitTargets = this.profitTargets.map((profitTarget) => {
      if (profitTarget.id === profitTargetId) {
        const profit = profitTarget.profit;
        const targetPrice =
          this.activeOrderSide === 'buy'
            ? this.price + (this.price * profit) / 100
            : this.price - (this.price * profit) / 100;

        return {
          ...profitTarget,
          targetPrice: targetPrice,
        };
      } else {
        return profitTarget;
      }
    });
  };

  @action
  public validate = () => {
    this.errors = [];

    let totalAmount = 0;
    let totalProfit = 0;

    this.profitTargets = this.profitTargets.map((profitTarget, index) => {
      totalAmount += profitTarget.amount;
      totalProfit += profitTarget.profit;

      let hasError = false;

      if (profitTarget.profit < 0.01) {
        this.errors.push('Minimum value is 0.01%');
        hasError = true;
      }

      if (
        index > 0 &&
        profitTarget.profit <= this.profitTargets[index - 1].profit
      ) {
        this.errors.push(
          "Each target's profit should be greater than the previous one",
        );
        hasError = true;
      }

      if (profitTarget.targetPrice <= 0) {
        this.errors.push('Price must be greater than 0');
        hasError = true;
      }

      return { ...profitTarget, hasError };
    });

    if (totalProfit > 500) {
      this.errors.push('Maximum profit sum is 500%');
    }

    if (totalAmount > 100) {
      const exceedAmount = totalAmount - 100;
      this.errors.push(
        `${totalAmount}% out of 100% selected. Please decrease by ${exceedAmount}`,
      );
    }

    if (totalAmount < 100) {
      const shortfallAmount = 100 - totalAmount;
      this.errors.push(
        `${totalAmount}% out of 100% selected. Please increase by ${shortfallAmount}`,
      );
    }
  };
}
