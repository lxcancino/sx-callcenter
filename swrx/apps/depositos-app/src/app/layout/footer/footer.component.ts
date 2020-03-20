import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { User } from '@swrx/core-model';

@Component({
  selector: 'swrx-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  faUser = faUser;

  @Input() user: User;

  constructor() {}

  ngOnInit() {}
}
