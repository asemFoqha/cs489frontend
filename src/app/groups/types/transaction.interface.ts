import IPaidBy from './paid-by.inteface';
import IReceipt from './receipt.interface';

export default interface ITransaction {
  _id: string;
  title: string;
  description: string;
  paid_by: IPaidBy;
  category: string;
  amount: number;
  date: number;
  receipt: IReceipt;
}
