import { SlicePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { GroupsService } from './services/groups.service';
import IMember from './types/member.interface';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, SlicePipe],
  template: `
    <mat-card class="align-center card__item">
      @if ($member().pending) {
      <mat-card class="badge">Pending</mat-card>
      } @if ($imageSrc()) {
      <img class="image" mat-card-image [src]="$imageSrc()" alt="user image" />
      } @else {
      <mat-icon aria-hidden="false" fontIcon="person"></mat-icon>
      }
      <mat-card-content>{{ $member().fullname }}</mat-card-content>
      <mat-card-content [title]="$member().email"
        >{{
          $member().email.length > 15
            ? ($member().email | slice : 0 : 15) + '...'
            : $member().email
        }}
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .badge {
        position: absolute;
        top: 5px;
        right: 5px;
        background: #ffd740;
        padding: 5px;
        width: 70px;
        height: 27px;
      }

      mat-icon {
        font-size: 100px !important;
        width: 100px !important;
        height: 100px !important;
      }

      mat-card {
        position: relative;
        width: 200px;
        height: 200px;
      }
      .image {
        width: 100px !important;
        height: 100px !important;
      }
    `,
  ],
})
export class MemberCardComponent implements OnInit {
  $member = input.required<IMember>();
  $imageSrc = signal('');
  $isLoading = signal(false);
  getUser$: Subscription | null = null;

  ngOnInit() {
    if (this.$member().image) {
      this.$imageSrc.set(
        `${environment.SERVER_URL}images/${this.$member().image?.filename}`
      );
    }

    console.log(this.$member());
  }
}
