import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'swrx-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {
  @Input() title = 'TOOLBAR';
  constructor() {}

  ngOnInit() {}
}
