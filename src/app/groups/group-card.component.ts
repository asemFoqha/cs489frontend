import {Component, inject, input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import IGroup from "./types/group.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [MatCardModule,MatButtonModule],
  template: `
    <mat-card>
      <mat-card-content>
        <span class="flex align-center justify-between capitalize"
        >{{ $group().title }}
          <button
            mat-raised-button
            color="primary"
            (click)="this.router.navigate(['groups', $group()._id])"
          >
            Open
          </button>
        </span>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``
})
export class GroupCardComponent {
  $group = input.required<IGroup>()
  router = inject(Router);
}
