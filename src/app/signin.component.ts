import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Title } from '@angular/platform-browser';
import { catchError, Subscription, throwError } from 'rxjs';
import ISignIn from './types/sign-in.interface';
import { jwtDecode } from 'jwt-decode';
import IUser from './types/user.interface';

@Component({
  selector: 'app-signin',
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
  templateUrl: 'signin.template.html',
  styles: ``,
})
export class SigninComponent implements OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private title = inject(Title);
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    isRemember: false,
  });
  $isLoading = signal(false);
  $error = signal('');
  signIn$: Subscription | null = null;

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  constructor() {
    this.title.setTitle('Sign in');
  }

  handleSubmit() {
    const { isRemember, ...values } = this.form.value;
    this.signIn$?.unsubscribe();
    this.$error.set('');
    this.$isLoading.set(true);
    this.signIn$ = this.authService
      .signIn(values as ISignIn)
      .pipe(
        catchError((e) => {
          this.$error.set(e.error.data);
          this.$isLoading.set(false);
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        const user = jwtDecode(res.data) as IUser;
        const storage = isRemember ? localStorage : sessionStorage;
        this.authService.$token.set(res.data);
        this.authService.$user.set(user);
        this.$isLoading.set(false);
        storage.setItem('TOKEN_KEY', res.data);
        storage.setItem('USER_KEY', JSON.stringify(user));
        this.router.navigate(['']);
      });
  }

  ngOnDestroy() {
    this.signIn$?.unsubscribe();
  }
}
