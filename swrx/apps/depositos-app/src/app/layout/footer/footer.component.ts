import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'swrx-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  faUser = faUser;

  constructor() {}

  ngOnInit() {}
}
