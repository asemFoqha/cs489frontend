import { Pipe, PipeTransform } from '@angular/core';
import IMember from "../types/member.interface";
import IFullGroup from "../types/full-group.inteface";

@Pipe({
  name: 'memberBalance',
  standalone: true
})
export class MemberBalancePipe implements PipeTransform {

  transform(member: IMember, group: IFullGroup) {
    let sum = 0;
    let paid = 0;
    group.transactions.forEach((t) => {
      sum += t.amount;
      if (t.paid_by.user_id === member.user_id) {
        paid += t.amount;
      }
    });

    return paid - sum / group.members.length;
  }

}
