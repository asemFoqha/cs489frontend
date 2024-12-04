import {Component, inject} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import IFilterDialog from "./types/filter-dialog.inteface";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import IFilter from "./types/filter.interface";
import {MatNativeDateModule} from "@angular/material/core";

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  template: `
    <form [formGroup]="form" class="flex column">
      <div class="mt-2 ml-2 flex justify-between">
        <h2>Filters</h2>

        @if (isResetVisible()) {
          <button
            mat-button
            color="warn"

            (click)="handleReset()"
          >
            Reset
          </button>
        }

      </div>
      <mat-form-field class="mr-1 ml-1 mb-1">
        <mat-label>Category</mat-label>
        <input matInput type="text" formControlName="category"/>
      </mat-form-field>
      <mat-form-field class="mr-1 ml-1">
        <mat-label>Paid by</mat-label>
        <mat-select formControlName="paidBy">
          <mat-option value="all"> All</mat-option>

          @for (member of data.members; track member._id) {
            <mat-option
              [value]="member.user_id"
            >
              {{ member.fullname }}
            </mat-option>
          }

        </mat-select>
      </mat-form-field>
      <mat-form-field class="m-1">
        <mat-label>From date</mat-label>
        <input
          matInput
          [matDatepicker]="fromPicker"
          formControlName="fromDate"
        />
        <mat-datepicker-toggle
          matIconSuffix
          [for]="fromPicker"
        ></mat-datepicker-toggle>
        <mat-datepicker #fromPicker></mat-datepicker>
      </mat-form-field>
      <mat-form-field class="mr-1 ml-1">
        <mat-label>To date</mat-label>
        <input matInput [matDatepicker]="toPicker" formControlName="toDate"/>
        <mat-datepicker-toggle
          matIconSuffix
          [for]="toPicker"
        ></mat-datepicker-toggle>
        <mat-datepicker #toPicker></mat-datepicker>
      </mat-form-field>
    </form>
  `,
  styles: [
    `
      form {
        width: 230px;
        height: 100%;
        background-color: #fff;
      }
    `,
  ],
})
export class FilterDialogComponent {
  data: IFilterDialog = inject(MAT_DIALOG_DATA);
  form = inject(FormBuilder).nonNullable.group(this.data.filters());

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((e) => this.handleFilter(e));
  }

  isResetVisible() {
    const { category, paidBy, fromDate, toDate } = this.form.value;

    return !(!category && paidBy === 'all' && !fromDate && !toDate);
  }

  handleReset() {
    const value = {
      category: '',
      paidBy: 'all',
      fromDate: '',
      toDate: '',
    };
    this.data.filters.set(value);
    this.form.setValue(value);
    this.handleResetFilteredTransactions();
  }

  handleResetFilteredTransactions() {
    const temp = [...this.data.transactions];
    this.data.filteredTransactions.set(
      temp.filter(({ title }) =>
        title.toLowerCase().includes(this.data.search().toLowerCase())
      )
    );
  }

  handleFilter(e: Partial<IFilter>) {
    this.handleResetFilteredTransactions();
    const { category, paidBy, fromDate, toDate } = e;
    this.data.filters.set({
      category: category!,
      paidBy: paidBy!,
      fromDate: fromDate!,
      toDate: toDate!,
    });
    let temp = [...this.data.filteredTransactions()];

    if (paidBy !== 'all') {
      temp = temp.filter(({ paid_by: { user_id } }) => user_id === paidBy);
    }

    if (category) {
      temp = temp.filter((t) =>
        t.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (fromDate) {
      temp = temp.filter(({ date }) => new Date(fromDate).getTime() <= date);
    }

    if (toDate) {
      temp = temp.filter(({ date }) => new Date(toDate).getTime() >= date);
    }

    this.data.filteredTransactions.set(temp);
  }
}
