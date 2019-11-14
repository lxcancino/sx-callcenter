import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'swrx-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
