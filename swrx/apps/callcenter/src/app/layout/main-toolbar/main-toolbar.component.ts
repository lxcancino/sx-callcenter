import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'swrx-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainToolbarComponent implements OnInit {
  @Input() title = 'SX CAT';

  @Output() toogle = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
