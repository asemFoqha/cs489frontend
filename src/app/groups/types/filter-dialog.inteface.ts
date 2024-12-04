import { WritableSignal } from '@angular/core';

import IMember from './member.interface';
import ITransaction from './transaction.interface';
import IFilter from './filter.interface';

export default interface IFilterDialog {
  members: IMember[];
  transactions: ITransaction[];
  filters: WritableSignal<IFilter>;
  filteredTransactions: WritableSignal<ITransaction[]>;
  search: WritableSignal<string>;
}
