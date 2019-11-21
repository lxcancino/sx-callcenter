import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'swrx-cart-footer',
  templateUrl: './cart-footer.component.html',
  styleUrls: ['./cart-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartFooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
