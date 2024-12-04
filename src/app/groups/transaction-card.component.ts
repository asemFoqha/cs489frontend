import {Component, inject, input, OnInit, signal} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {environment} from "../../environments/environment";
import ITransaction from "./types/transaction.interface";
import {MatDialog} from "@angular/material/dialog";
import {ImageViewerDialogComponent} from "./image-viewer-dialog.component";
import {CurrencyPipe, DatePipe, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-transaction-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    TitleCasePipe,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <mat-card>
      <img
        [src]="$receiptSrc()"
        alt="receipt"
        class="receipt-image"
        (click)="openImageDialog()"
      />
      <div class="mt-2">
        <div class="card-header">
          <mat-card-content class="title">{{
              $transaction().title | titlecase
            }}</mat-card-content>

          <mat-card-content>{{
              $transaction().amount | currency : 'USD'
            }}</mat-card-content>
        </div>
        <mat-divider />
        <div class="mt-1">
          <mat-card-content>{{
              $transaction().category | titlecase
            }}</mat-card-content>
          <mat-card-content
          ><label
            class="one-line"
            [matTooltip]="$transaction().description"
            matTooltipPosition="above"
          >
            {{ $transaction().description }}
          </label></mat-card-content
          >
          <div class="flex justify-end">
            <mat-card-content
            ><label class="date">
              {{ $transaction().date | date }}
            </label></mat-card-content
            >
          </div>
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .receipt-image {
        width: 100%;
        height: 250px;
        object-fit: contain;
      }

      .title {
        font-size: 20px;
        font-weight: 500;
        text-transform: capitalize;
      }

      .card-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }

      .date {
        color: #8d8d8d;
        font-size: 14px;
      }
    `,
  ],
})
export class TransactionCardComponent implements OnInit {
   #dialog = inject(MatDialog);
  $transaction = input.required<ITransaction>();
  $receiptSrc = signal("");

  ngOnInit() {
    this.$receiptSrc.set(`${environment.SERVER_URL}receipts/${this.$transaction().receipt.filename}`)
  }

  openImageDialog() {
    this.#dialog.open(ImageViewerDialogComponent, {
      data: this.$receiptSrc(),
    });
  }
}
