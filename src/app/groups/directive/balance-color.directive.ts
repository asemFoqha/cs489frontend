import {Directive, ElementRef, inject, input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[balanceColor]',
  standalone: true
})
export class BalanceColorDirective implements OnInit {
$balance= input.required<number>()
#element = inject(ElementRef);
#renderer = inject(Renderer2);

  ngOnInit() {
    this.#renderer.setStyle(
      this.#element.nativeElement,
      'color',
      this.$balance() >= 0 ? '#00FF00' : '#f44336'
    );
  }
}
