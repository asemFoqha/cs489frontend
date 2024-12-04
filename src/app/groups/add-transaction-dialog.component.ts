import {Component, inject, OnDestroy, signal} from '@angular/core';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {GroupsService} from "./services/groups.service";
import {catchError, Subscription, throwError} from "rxjs";
import IResponse from "../types/response.inteface";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatNativeDateModule} from "@angular/material/core";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-add-transaction-dialog',
  standalone: true,
  imports: [
    MatProgressBarModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],

  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()">
      @if ($isLoading()) {
        <div class="fixed full-width">
          <mat-progress-bar mode="indeterminate"/>
        </div>
      }

      <h2 mat-dialog-title>Add Transaction</h2>
      <mat-divider/>
      <mat-dialog-content class="mat-typography">
        <mat-form-field class="mb-1">
          <mat-label>Title</mat-label>
          <input matInput type="text" formControlName="title"/>
          @if (title.errors?.['required']) {
            <mat-error>
              Title is <strong>required</strong>
            </mat-error>
          }

        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Description</mat-label>
          <input matInput type="text" formControlName="description"/>
          @if (description.errors?.['required']) {
            <mat-error>
              Description is <strong>required</strong>
            </mat-error>
          }

        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Category</mat-label>
          <input matInput type="text" formControlName="category"/>
          @if (category.errors?.['required']) {
            <mat-error>
              Category is <strong>required</strong>
            </mat-error>
          }

        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Amount</mat-label>
          <input matInput type="number" formControlName="amount"/>
          @if (amount.errors?.['min'] && !amount.errors?.['required']) {
            <mat-error

            >
              Minimum amount is <strong>0.1</strong>
            </mat-error>
          }

          @if (amount.errors?.['required']) {
            <mat-error>
              Amount is <strong>required</strong>
            </mat-error>
          }

        </mat-form-field>
        <mat-form-field class="mb-1">
          <mat-label>Choose a date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date"/>

          @if (date.errors?.['required']) {
            <mat-error>
              Date is <strong>required</strong>
            </mat-error>
          }

          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <div class="mb-1">
          <label>Receipt</label>
          <div class="mt-1">
            <button
              mat-raised-button
              type="button"
              color="primary"
              (click)="fileInput.click()"
              (blur)="handleReceiptBlur()"
            >
              Choose File
            </button>
          </div>
          @if ($receipt()) {
            <label class="mt-1 one-line">{{ $receipt() }}</label>
          }
          @if ($error()) {
            <mat-error class="mt-1">
              {{ $error() }}
            </mat-error>
          }

          <input
            hidden
            #fileInput
            type="file"
            accept="image/*"
            (change)="handleReceiptChange($event)"
          />
        </div>
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
        max-width: 300px;
      }
    `,
  ],
})
export class AddTransactionDialogComponent implements OnDestroy {


  private dialog = inject(MatDialogRef);
  private groupsService = inject(GroupsService);
  form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.1)]],
    date: ['', [Validators.required]],
  });
  groupId: string = inject(MAT_DIALOG_DATA);

  $receipt = signal('');
  $receiptSource = signal<File | null>(null)
  addTransaction$: Subscription | null = null;
  $isLoading = signal(false)
  $error = signal('');

  get title() {
    return this.form.controls.title;
  }

  get description() {
    return this.form.controls.description;
  }

  get category() {
    return this.form.controls.category;
  }

  get amount() {
    return this.form.controls.amount;
  }

  get date() {
    return this.form.controls.date;
  }


  handleReceiptBlur() {
    if (this.$receiptSource() === null) {
      this.$error.set('Receipt is required!');
    }
  }

  handleReceiptChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.$receipt.set(target.files[0].name);
      this.$receiptSource.set(target.files[0]);
      this.$error.set('');
    }
  }

  handleSubmit() {
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.delete('date');
    const date = new Date(this.form.value.date!).getTime();
    formData.append('date', date.toString());
    formData.append('receipt', this.$receiptSource()!, this.$receipt());
    this.$isLoading.set(true);
    this.$error.set('');
    this.addTransaction$?.unsubscribe();
    this.addTransaction$ = this.groupsService
      .addTransactions(formData, this.groupId)
      .pipe(
        catchError((e) => {
          this.$error.set(e.error.data);
          this.$isLoading.set(false)
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res: IResponse<Boolean>) => {
        this.dialog.close(res.data && res.success);
      });
  }

  ngOnDestroy() {
    this.addTransaction$?.unsubscribe();
  }

}
