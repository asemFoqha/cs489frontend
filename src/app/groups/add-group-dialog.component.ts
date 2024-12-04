import {Component, inject, OnDestroy, signal} from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {GroupsService} from "./services/groups.service";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {catchError, Subscription, throwError} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-add-group-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatDialogModule, MatFormFieldModule, MatProgressBarModule,ReactiveFormsModule,MatInputModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()">

      @if ($isLoading()) {
        <div class="fixed full-width">
          <mat-progress-bar mode="indeterminate"/>
        </div>
      }


      <h2 mat-dialog-title>Add Group</h2>
      <mat-divider/>
      <mat-dialog-content class="mat-typography">
        <mat-form-field class="mb-1">
          <mat-label>Title</mat-label>
          <input
            matInput
            type="text"
            placeholder="Florida"
            formControlName="title"
          />
          @if (title.errors?.['minlength'] && !title.errors?.['required']) {
            <mat-error>
              The minimum length for the title is <strong>3</strong>
            </mat-error>
          }

          @if (title.errors?.['required']) {
            <mat-error>
              Title is <strong>required</strong>
            </mat-error>
          }

        </mat-form-field>
      </mat-dialog-content>
      <mat-divider/>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid || $isLoading()"
          (click)="handleSubmit()"
        >
          Add
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      mat-dialog-content,
      mat-progress-bar {
        max-width: 250px;
      }
    `,
  ]
})
export class AddGroupDialogComponent implements OnDestroy {
  private dialog = inject(MatDialogRef);
  private groupsService = inject(GroupsService);
  form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
  });
  addGroup$: Subscription | null = null;
  $isLoading = signal(false);

  get title() {
    return this.form.controls.title;
  }

  handleSubmit() {
    this.$isLoading.set(true)
    this.addGroup$?.unsubscribe();
    this.addGroup$ = this.groupsService
      .addGroup(this.title.value)
      .pipe(
        catchError(() => {
          this.$isLoading.set(false)
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        if (res.success) {
          this.groupsService.pushGroup(res.data);
          this.dialog.close();
        }
      });
  }

  ngOnDestroy() {
    this.addGroup$?.unsubscribe();
  }

}
