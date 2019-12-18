import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';

@Component({
  selector: 'swrx-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnvioComponent implements OnInit {
  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<EnvioComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({});
  }

  doSubmit() {
    if (this.form.valid) {
      const data = { ...this.form.value };
      this.dialogRef.close(data);
    }
  }
}
