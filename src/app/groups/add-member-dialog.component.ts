import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {GroupsService} from "./services/groups.service";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {catchError, Subscription, throwError} from "rxjs";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDividerModule} from "@angular/material/divider";
import {MatInputModule} from "@angular/material/input";
import IResponse from "../types/response.inteface";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import IUser from "../types/user.interface";

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [
    MatProgressBarModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()">
      @if ($isLoading()) {
        <div class="fixed full-width">
          <mat-progress-bar mode="indeterminate"/>
        </div>
      }
      <h2 mat-dialog-title>Add Member</h2>
      <mat-divider/>
      <mat-dialog-content class="mat-typography">
        <mat-form-field class="mb-1">
          <mat-label>Email</mat-label>
          <input
            matInput
            type="text"
            placeholder="Email"
            formControlName="email"
          />
          @if (email.errors?.['minlength'] && !email.errors?.['required']) {
            <mat-error>
              The minimum length for the title is <strong>3</strong>
            </mat-error>
          }
          @if (email.errors?.['required']) {
            <mat-error>
              Title is <strong>required</strong>
            </mat-error>
          }

        </mat-form-field>

        @if ($error()) {
          <mat-error>
            {{ $error() }}
          </mat-error>
        }


        <mat-form-field>
          <mat-label>Users</mat-label>
          <mat-select (selectionChange)="handleSelectingUser($event)">
            @for (user of $users(); track user._id) {
              <mat-option [value]="user.email">{{ user.fullname }}</mat-option>
            }
          </mat-select>
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
  ],
})
export class AddMemberDialogComponent implements OnDestroy, OnInit {
  #dialog = inject(MatDialogRef);
  #groupsService = inject(GroupsService);
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  groupId: string = inject(MAT_DIALOG_DATA);
  addMember$: Subscription | null = null;
  getUsers$: Subscription | null = null;
  $isLoading = signal(false);
  $error = signal("");
  $users = signal<IUser[]>([])

  get email() {
    return this.form.controls.email;
  }

  ngOnInit() {
    this.handleGetAllUsers()
  }

  handleSubmit() {
    this.$isLoading.set(true);
    this.$error.set("");

    this.addMember$?.unsubscribe();
    this.addMember$ = this.#groupsService
      .addGroupMember(this.form.value.email as string, this.groupId)
      .pipe(
        catchError((e) => {
          this.$error.set(e.error.data)
          this.$isLoading.set(false)
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res: IResponse<Boolean>) => {
        this.#dialog.close(res.data && res.success);
      });
  }

  handleGetAllUsers() {
    this.$isLoading.set(true);
    this.$error.set("");
    this.getUsers$?.unsubscribe()

    this.getUsers$ = this.#groupsService.getAllUsers().pipe(
      catchError((e) => {
        this.$error.set(e.error.data)
        this.$isLoading.set(false)
        return throwError(
          () => new Error('Something bad happened; please try again later.')
        );
      })
    ).subscribe((res:IResponse<IUser[]>)=> {
      this.$isLoading.set(false)
      this.$users.set(res.data)
    })
  }

  handleSelectingUser(e:MatSelectChange){
    this.$error.set("")
    this.form.controls.email.setValue(e.value)
  }
  ngOnDestroy() {
    this.addMember$?.unsubscribe();
    this.getUsers$?.unsubscribe()
  }
}
