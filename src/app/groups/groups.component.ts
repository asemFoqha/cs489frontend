import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Subscription, throwError } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMiniFabButton } from '@angular/material/button';
import { GroupsService } from './services/groups.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GroupCardComponent } from './group-card.component';
import { AddGroupDialogComponent } from './add-group-dialog.component';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    MatProgressBarModule,
    MatIconModule,
    MatDividerModule,
    MatMiniFabButton,
    GroupCardComponent,
  ],
  template: `
    @if ($isLoading()) {
    <div class="fixed full-width">
      <mat-progress-bar mode="indeterminate" />
    </div>
    }

    <div class="screen-margin flex column">
      <div class="flex justify-between align-center mb-2">
        <h2>Groups</h2>
        <button mat-mini-fab color="basic" (click)="openDialog()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <mat-divider />
      @if (groupsService.$groups().length) {
      <div class="gap-4 grid mt-2">
        @for (group of groupsService.$groups(); track group._id) {
        <app-group-card [$group]="group" />
        }
      </div>
      } @else { @if (!$isLoading()) {
      <div class="mt-2">
        <h1 class="text-center">You are not in any group yet!</h1>
      </div>
      } }
    </div>
  `,
  styles: ``,
})
export class GroupsComponent implements OnDestroy {
  #title = inject(Title);
  #dialog = inject(MatDialog);
  groupsService = inject(GroupsService);
  $isLoading = signal(false);
  getGroups$: Subscription | null = null;

  constructor() {
    this.#title.setTitle('Groups');
    this.$isLoading.set(true);
    this.groupsService
      .getGroups()
      .pipe(
        takeUntilDestroyed(),
        catchError(() => {
          this.$isLoading.set(false);
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        this.$isLoading.set(false);
        this.groupsService.$groups.set(res.data);
        this.getGroups$ = this.groupsService
          .getGroups(true)
          .subscribe((res) => {
            if (res.success) {
              this.groupsService.$requests.set(res.data);
            }
          });
      });
  }

  openDialog() {
    this.#dialog.open(AddGroupDialogComponent);
  }

  ngOnDestroy() {
    this.getGroups$?.unsubscribe();
  }
}
