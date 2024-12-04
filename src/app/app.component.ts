import {Component, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AuthService} from "./services/auth.service";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {GroupsService} from "./groups/services/groups.service";
import {MatDividerModule} from "@angular/material/divider";
import {MatBadge} from "@angular/material/badge";
import {NotificationComponent} from "./notification.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatToolbarModule, MatButton, RouterLink,
    HttpClientModule,
    MatDividerModule, MatBadge,
    NotificationComponent,
    MatFormFieldModule, MatInputModule, MatButtonModule

  ],
  template: `
    <mat-toolbar color="primary">
      <span class="one" (click)="router.navigate([''])">Track and Split</span>

      @if (!authService.$user()) {
        <div>
          <button mat-button class="m-2" [routerLink]="['', 'signin']">
            Sign in
          </button>
          <button mat-raised-button [routerLink]="['', 'signup']">
            Sign up
          </button>
        </div>
      } @else {
        <mat-icon
          [matBadge]="groupsService.$requests().length"
          [matBadgeHidden]="groupsService.$requests().length === 0"
          matBadgeColor="warn"
          [matMenuTriggerFor]="menu"
        >notifications
        </mat-icon
        >
        <button mat-button (click)="router.navigate(['/profile'])">
          Profile
        </button>
        <button mat-button class="m-2" (click)="authService.signOut()">
          Sign out
        </button>

        <mat-menu #menu>
          @if ($isLoading()) {
            <div class="fixed full-width">
              <mat-progress-bar mode="indeterminate"/>
            </div>
          }

          @if (groupsService.$requests().length !== 0) {
            <div>

              @for (group of groupsService.$requests(); track group._id;
                let index = $index;
                let last = $last) {
                <div>
                  <app-notification
                    [$group]="group"
                    [$index]="index"
                  />
                  @if (!last) {
                    <mat-divider/>
                  }
                </div>

              }
            </div>
          } @else {
            <span class="p-2">You have no pending requests!</span>
          }

        </mat-menu>

      }


    </mat-toolbar>

    <router-outlet></router-outlet>
<!--    @if(authService.$updateUser()){-->
<!--      <mat-form-field>-->
<!--        <mat-label>Message</mat-label>-->
<!--        <input matInput value="Disco party!" #message>-->
<!--      </mat-form-field>-->
<!--    }-->

  `,
  styles: `
  mat-form-field {
    margin-right: 12px;
  }
  `,
  providers: [HttpClient, Router]
})
export class AppComponent {
  router = inject(Router);
  groupsService = inject(GroupsService);
  authService = inject(AuthService);
  $isLoading = signal(false);


  handleSignOut() {
    this.authService.signOut();
  }
}
