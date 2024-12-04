import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';
import {environment as env} from '../../environments/environment.development';

import IResponse from '../types/response.inteface';
import ISignIn from '../types/sign-in.interface';
import ISignUp from '../types/sign-up.interface';
import IUser from '../types/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #http = inject(HttpClient);
  private router = inject(Router);
  $token = signal('');
  $user = signal<IUser | null>(null);
  $updateUser = signal(false)

  signIn(data: ISignIn) {
    return this.#http.post<IResponse<string>>(
      `${env.SERVER_URL}users/signin`,
      data
    );
  }

  signUp(data: ISignUp) {
    return this.#http.post<IResponse<string>>(
      `${env.SERVER_URL}users/signup`,
      data
    );
  }

  updateUser(data:any){
    return this.#http.put<IResponse<number>>(`${env.SERVER_URL}users`,data)
  }

  successfulUpdating(){
    this.$updateUser.set(true)
  }

  signOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.$token.set('');
    this.$user.set(null);
    this.router.navigate(['signin']);
  }
}
