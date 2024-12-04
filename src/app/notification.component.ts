import {Component, inject, input, OnDestroy, signal} from '@angular/core';
import IGroup from "./groups/types/group.interface";
import {GroupsService} from "./groups/services/groups.service";
import {catchError, Subscription, throwError} from "rxjs";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div class="p-3 flex column" (click)="$event.stopPropagation()">
      <span>{{ $group().title }}</span>

      <button
        mat-raised-button
        class="mt-1"
        color="primary"
        [disabled]="$isLoading()"
        (click)="handleClick()"
      >
        Accept
      </button>
    </div>
  `,
  styles: [
    `
      div {
        min-width: 140px;
      }
    `,
  ],
})
export class NotificationComponent implements OnDestroy{

  $group = input.required<IGroup>();
  $index =   input.required<number>()
  $isLoading = signal(false)
  #groupsService = inject(GroupsService);
  updateMemberPendingStatusById$: Subscription | null = null;

  handleClick() {
    this.$isLoading.set(true)
    this.updateMemberPendingStatusById$?.unsubscribe();
    this.updateMemberPendingStatusById$ = this.#groupsService
      .updateMemberPendingStatusById(this.$group()._id)
      .pipe(
        catchError(() => {
          this.$isLoading.set(false);
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        if (res.success) {
          this.#groupsService.pushGroup(this.$group());
          this.#groupsService.removeRequest(this.$index());
          this.$isLoading.set(false);
        }
      });
  }

  ngOnDestroy() {
    this.updateMemberPendingStatusById$?.unsubscribe();
  }

}
