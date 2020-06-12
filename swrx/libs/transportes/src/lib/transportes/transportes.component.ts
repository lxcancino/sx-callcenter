import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { Observable } from 'rxjs';
import { TransportesService } from '../transporte.service';
import { Transporte } from '../transporte';
import { MatDialog } from '@angular/material';
import { TransporteFormComponent } from '../transporte-form/transporte-form.component';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'swrx-transportes',
  templateUrl: './transportes.component.html',
  styleUrls: ['./transportes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportesComponent implements OnInit {
  partidas$: Observable<Transporte[]>;

  constructor(
    private service: TransportesService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.partidas$ = this.service.list();
    this.cd.markForCheck();
  }

  onCreate() {
    this.dialog
      .open(TransporteFormComponent, {
        data: {},
        width: '650px'
        // height: '700px'
      })
      .afterClosed()
      .subscribe((res: Partial<Transporte>) => {
        if (res) {
          this.service.save(res).subscribe(
            t => {
              console.log('Updated: ', t);
              this.load();
            },
            error => console.error('Error actualizando transporte: ', error)
          );
        }
      });
  }

  onEdit(transporte: Transporte) {
    this.dialog
      .open(TransporteFormComponent, { data: { transporte }, width: '650px' })
      .afterClosed()
      .subscribe((res: Partial<Transporte>) => {
        if (res) {
          const update: Update<Transporte> = {
            id: transporte.id,
            changes: res
          };
          this.service.update(update).subscribe(
            t => {
              console.log('Updated: ', t);
              this.load();
            },
            error => console.error('Error actualizando transporte: ', error)
          );
        }
      });
  }
}
