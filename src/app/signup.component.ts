import {Component, inject, OnDestroy, signal} from '@angular/core';
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
import { Subscription, catchError, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import ISignUp from './types/sign-up.interface';
import { HttpClientModule } from '@angular/common/http';
import {jwtDecode} from "jwt-decode";
import IUser from "./types/user.interface";

@Component({
  selector: 'app-signup',
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
  ],
  template: `
    @if ($isLoading()) {
    <div class="fixed full-width">
      <mat-progress-bar mode="indeterminate" />
    </div>
    }

    <div class="flex justify-center screen-margin">
      <mat-card class="form-container">
        <mat-card-content>
          <form
            class="flex column"
            [formGroup]="form"
            (ngSubmit)="handleSubmit()"
          >
            <mat-form-field class="mb-1">
              <mat-label>Full name</mat-label>
              <input matInput type="text" formControlName="fullname" />

              @if(fullname.errors?.['minlength'] &&
              !fullname.errors?.['required']){
              <mat-error>
                Please enter a valid <strong>fullname</strong>
              </mat-error>
              } @if(fullname.errors?.['required']){
              <mat-error> Full name is <strong>required</strong> </mat-error>
              }
            </mat-form-field>
            <mat-form-field class="mb-1">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="Ex. pat@example.com"
              />
              @if(email.errors?.['email'] && !email.errors?.['required']){
              <mat-error>
                Please enter a valid <strong>email address</strong>
              </mat-error>
              } @if(email.errors?.['required']){
              <mat-error> Email is <strong>required</strong> </mat-error>
              }
            </mat-form-field>
            <mat-form-field>
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" />
              {{ form.errors }}
              @if(password.errors?.['minlength'] &&
              !password.errors?.['required']){
              <mat-error>
                The minimum length for the password is <strong>6</strong>
              </mat-error>
              } @if(password.errors?.['required']){

              <mat-error> Password is <strong>required</strong> </mat-error>
              }
            </mat-form-field>
            <div class="flex justify-center">
              @if($error()){
              <mat-error>
                {{ $error() }}
              </mat-error>
              }
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button
            [disabled]="form.invalid || $isLoading()"
            mat-raised-button
            color="primary"
            type="submit"
            (click)="handleSubmit()"
          >
            Sign up
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: ``,
})
export class SignupComponent implements OnDestroy{
   #router = inject(Router);
   #authService = inject(AuthService);
   #title = inject(Title);

  form = inject(FormBuilder).nonNullable.group({
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  $isLoading = signal(false)
  $error = signal("")
  signUp$: Subscription | null = null;

  get fullname() {
    return this.form.controls.fullname;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  constructor() {
    this.#title.setTitle('Sign up');
  }

  handleSubmit() {
    this.signUp$?.unsubscribe();
    this.$error.set("")
    this.$isLoading.set(true);
    this.signUp$ = this.#authService
      .signUp(this.form.value as ISignUp)
      .pipe(
        catchError((e) => {
          this.$error.set( e.error.data)
          this.$isLoading.set(false);
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        const user = jwtDecode(res.data) as IUser;
        this.#authService.$token.set(res.data);
        this.#authService.$user.set(user);
        this.$isLoading.set(false);
        sessionStorage.setItem('TOKEN_KEY', res.data);
        this.#router.navigate(['']);
      });
  }

  ngOnDestroy() {
    this.signUp$?.unsubscribe();
  }
}
