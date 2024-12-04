import { TitleCasePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import IResponse from './types/response.inteface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatToolbarModule,
    ReactiveFormsModule,
    HttpClientModule,
    TitleCasePipe,
  ],
  template: `
    @if ($isLoading()) {
    <div class="fixed full-width">
      <mat-progress-bar mode="indeterminate" />
    </div>
    }
    <div class="screen-margin flex column">
      <div class="flex align-center">
        <mat-icon class="m-2" (click)="router.navigate(['../'])"
          >arrow_backward
        </mat-icon>
        <h2 class="remove-margin">{{ 'Profile' | titlecase }}</h2>
      </div>
      <mat-divider />
      <div class="flex justify-center screen-margin">
        <mat-card class="form-container">
          <mat-card-content>
            <form
              class="flex column"
              [formGroup]="form"
              (ngSubmit)="handleSubmit()"
            >
              <mat-form-field class="mb-1">
                <mat-label>FullName</mat-label>
                <input matInput type="text" formControlName="fullname" />

                @if (fullName.errors?.['required']) {
                <mat-error class="mt-1">
                  <strong>FullName is required</strong>
                </mat-error>
                }
              </mat-form-field>

              <div class="mb-1">
                <label>New Profile Picture</label>
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
                @if ($image()) {
                <label class="mt-1 one-line">{{ $image() }}</label>
                } @if ($error()) {
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
            </form>
          </mat-card-content>
          <mat-card-actions align="end">
            <button
              [disabled]="form.invalid || $isLoading() || !$image()"
              mat-raised-button
              color="primary"
              type="submit"
              (click)="handleSubmit()"
            >
              Update
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProfileComponent {
  router = inject(Router);
  #authService = inject(AuthService);
  #title = inject(Title);
  form = inject(FormBuilder).nonNullable.group({
    fullname: ['', [Validators.required]],
  });
  $isLoading = signal(false);
  $error = signal('');
  $image = signal('');
  $imageSource = signal<File | null>(null);
  updateProfile$: Subscription | null = null;

  get fullName() {
    return this.form.controls.fullname;
  }

  constructor() {
    this.#title.setTitle('Profile');
  }

  handleReceiptBlur() {
    if (this.$imageSource() === null) {
      this.$error.set('Receipt is required!');
    }
  }

  handleReceiptChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.$image.set(target.files[0].name);
      this.$imageSource.set(target.files[0]);
      this.$error.set('');
    }
  }

  handleSubmit() {
    const formData = new FormData();
    formData.append('fullname', this.form.controls.fullname.value);
    formData.append('image', this.$imageSource()!, this.$image());
    this.$isLoading.set(true);
    this.$error.set('');
    this.updateProfile$?.unsubscribe();
    this.updateProfile$ = this.#authService
      .updateUser(formData)
      .pipe(
        catchError((e) => {
          this.$error.set(e.error.data);
          this.$isLoading.set(false);
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res: IResponse<number>) => {
        this.$isLoading.set(false);

        if (res.data > 0) {
          alert('User was updated successfully');
        } else {
          alert('Something bad happened; please try again later');
        }
      });
  }
}
