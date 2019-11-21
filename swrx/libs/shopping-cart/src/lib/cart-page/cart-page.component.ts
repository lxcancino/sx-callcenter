import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'swrx-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
