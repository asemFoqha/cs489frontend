import IGroup from './group.interface';
import IMember from './member.interface';
import ITransaction from './transaction.interface';

export default interface IFullGroup extends IGroup {
  members: IMember[];
  transactions: ITransaction[];
}
