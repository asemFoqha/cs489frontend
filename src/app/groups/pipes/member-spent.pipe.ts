import { Pipe, PipeTransform } from '@angular/core';
import IMember from "../types/member.interface";
import IFullGroup from "../types/full-group.inteface";

@Pipe({
  name: 'memberSpent',
  standalone: true
})
export class MemberSpentPipe implements PipeTransform {
  transform(member: IMember, group: IFullGroup)  {
    return group.transactions.reduce((s, acc) => {
      if (acc.paid_by.user_id === member.user_id) {
        return (s += acc.amount);
      }

      return s;
    }, 0);
  }

}
