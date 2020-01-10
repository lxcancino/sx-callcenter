import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

import { CLIENTE_DUMMY } from './domy.data';
import { Cliente, Direccion, ClienteDireccion } from '@swrx/core-model';

import { ClienteUiService } from '../services/cliente-ui.service';
import { buildDireccionForm, getDireccionKey } from '@swrx/form-utils';
import { ClienteService } from '../services/cliente.service';
import { Update } from '@ngrx/entity';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'swrx-cliente-page',
  templateUrl: './cliente-page.component.html',
  styleUrls: ['./cliente-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClientePageComponent implements OnInit {
  cliente;
  direcciones: ClienteDireccion[];
  form: FormGroup;
  direccionForm: FormGroup;
  direccionSelected: ClienteDireccion;
  newTelefono = new FormControl(null, { updateOn: 'blur' });
  constructor(
    private clienteUi: ClienteUiService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private service: ClienteService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.buildForm();
    if (!this.cliente) {
      this.lookup();
      // this.cliente = CLIENTE_DUMMY;
      // this.form.patchValue(this.cliente);
    }
    this.newTelefono.valueChanges.subscribe(tel => console.log('Tel: ', tel));
  }

  lookup() {
    this.clienteUi.lookup().subscribe(cte => {
      if (cte) {
        this.cliente = cte;
        console.log('Cliente: ', this.cliente);
        this.form.patchValue(this.cliente);
        if (this.cliente.medios) {
          const telefonos = this.cliente.medios.filter(
            item => item.tipo === 'TEL'
          );
          telefonos.forEach(element => {
            this.telefonos.push(new FormControl(element.descripcion));
          });
        }
        this.setDirecciones(cte);
        this.cd.markForCheck();
      }
    });
  }

  private setDirecciones(cte: Cliente) {
    // Direcciones de entrega
    this.direcciones = cte.direccionesEntrega;
  }

  private buildForm() {
    this.form = this.fb.group({
      cfdiMail: [null],
      direccion: buildDireccionForm(this.fb),
      telefonos: this.fb.array([])
    });
    this.form.get('direccion').disable();

    this.direccionForm = this.fb.group({
      direccion: buildDireccionForm(this.fb)
    });
  }

  get telefonos(): FormArray {
    if (this.form) {
      return this.form.get('telefonos') as FormArray;
    } else {
      return null;
    }
  }

  actualizar(cliente: Cliente) {
    const cfdiMail = this.form.get('cfdiMail').value;
    const medios = this.cliente.medios;
    const cfdi = medios.find(item => item.tipo === 'MAIL' && item.cfdi);
    if (cfdi) {
      cfdi.descripcion = cfdiMail;
    } else {
      medios.push({
        tipo: 'MAIL',
        activo: true,
        cfdi: true,
        descripcion: cfdiMail
      });
    }
    const changes = { medios: [...medios] };
    this.actualizarDatos(cliente.id, changes);
  }

  get direccion(): FormGroup {
    if (this.form) {
      return this.form.get('direccion') as FormGroup;
    } else {
      return null;
    }
  }

  agregarTelefono(cliente: Partial<Cliente>) {
    if (this.newTelefono.valid) {
      const value = this.newTelefono.value;
      const medio = {
        tipo: 'TEL',
        activo: true,
        descripcion: value,
        cfdi: false
      };
      const medios = [...this.cliente.medios, medio];
      this.actualizarDatos(cliente.id, { medios });
    }
  }

  deleteTelefono(index: number) {
    this.telefonos.removeAt(index);
    const control = this.telefonos.at(index);
    const tels = this.telefonos.value.map(item => {
      return {
        tipo: 'TEL',
        activo: true,
        descripcion: item,
        cfdi: false
      };
    });
    const medios = [
      ...this.cliente.medios.filter(item => item.tipo !== 'TEL'),
      ...tels
    ];
    this.actualizarDatos(this.cliente.id, { medios });
  }

  actualizarDatos(
    id: string,
    changes: Partial<Cliente>,
    successCallbak?: Function,
    errorCallback?: Function
  ) {
    const update: Update<Cliente> = { id, changes };
    this.service.update(update).subscribe(
      res => {
        this.cliente = res;
        this.form.markAsPristine();
        this.snack.open('Datos actualizados', 'Cerrar', { duration: 3000 });
        console.log('Cliente actualizado: ', res);
        if (successCallbak) {
          successCallbak();
        }
      },
      response => console.error('HttpError: ', response)
    );
  }

  seleccionarDireccion(event: any) {
    this.direccionSelected = event;
    if (event) {
      const value = this.direccionSelected.direccion;
      this.direccionForm
        .get('direccion')
        .patchValue(value, { emitEvent: true });
    } else {
      this.direccionForm.reset();
    }
  }

  actualizarDireccionEntrega() {
    if (this.direccionForm.valid) {
      const value = this.direccionForm.get('direccion').value;
      if (!this.direccionSelected) {
        const key = getDireccionKey(value);
        const newDir: ClienteDireccion = {
          nombre: key,
          direccion: value
        };
        this.direcciones.push(newDir);
      } else {
        this.direccionSelected.direccion = value;
      }
      const changes = { direcciones: this.direcciones };

      this.actualizarDatos(this.cliente.id, changes, () => {
        this.direccionForm.markAsPristine();
        this.cd.markForCheck();
      });
    }
  }
}
