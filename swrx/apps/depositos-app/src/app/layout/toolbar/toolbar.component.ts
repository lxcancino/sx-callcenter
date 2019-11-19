import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { NAVIGATION } from '../navigation';

@Component({
  selector: 'swrx-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {
  @Input() title = 'TOOLBAR';
  @Input() routes: any[] = NAVIGATION;
  @Output() toogle = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
