import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validators
} from '@angular/forms';

import { Cliente, Direccion, ClienteDireccion } from '@swrx/core-model';

import { ClienteUiService } from '../services/cliente-ui.service';
import { buildDireccionForm, getDireccionKey } from '@swrx/form-utils';
import { ClienteService } from '../services/cliente.service';
import { Update } from '@ngrx/entity';
import { MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';

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
    }
  }

  lookup() {
    this.clienteUi.lookup().subscribe(cte => {
      if (cte) {
        this.setCliente(cte);
      }
    });
  }

  private setCliente(cte: Cliente) {
    this.cliente = cte;
    console.log('Cliente: ', this.cliente);
    this.form.patchValue(this.cliente);
    this.setTelefonos(this.cliente);
    this.setDirecciones(cte);
    this.cd.markForCheck();
  }

  private setTelefonos(cliente: Cliente) {
    this.telefonos.clear();
    const telefonos = this.cliente.medios.filter(item => item.tipo === 'TEL');
    telefonos.forEach(element => {
      this.telefonos.push(
        this.fb.group({
          id: element.id,
          tipo: 'TEL',
          activo: true,
          descripcion: element.descripcion,
          cfdi: false
        })
      );
    });
  }

  private setDirecciones(cte: Cliente) {
    this.direcciones = cte.direccionesEntrega;
  }

  private buildForm() {
    this.form = this.fb.group({
      cfdiMail: [null, Validators.required],
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

  actualizarCfdiMail() {
    const cfdiMail = this.form.get('cfdiMail').value;
    const cfdi = this.cliente.medios.find(
      item => item.tipo === 'MAIL' && item.cfdi
    );
    if (cfdi) {
      cfdi.descripcion = cfdiMail;
      this.service
        .updateMedio(this.cliente.id, cfdi)
        .pipe(finalize(() => this.cd.markForCheck()))
        .subscribe(
          res => {
            this.snack.open('CFDI Mail actualizado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.form.get('cfdiMail').markAsPristine();
          },
          err => console.error('Error actualizando Cfdi Mail', err)
        );
    }
  }

  actualizar(cliente: Cliente) {
    const cfdiMail = this.form.get('cfdiMail').value;
    const medios = [];
    const cfdi = this.cliente.medios.find(
      item => item.tipo === 'MAIL' && item.cfdi
    );
    if (cfdi) {
      cfdi.descripcion = cfdiMail;
      medios.push(cfdi);
    } else {
      medios.push({
        tipo: 'MAIL',
        activo: true,
        cfdi: true,
        descripcion: cfdiMail
      });
    }
    const tels = this.telefonos.value.map(item => {
      return {
        tipo: 'TEL',
        activo: true,
        descripcion: item,
        cfdi: false
      };
    });
    const changes = { medios: [...medios, ...tels] };
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
        cliente: { id: cliente.id },
        tipo: 'TEL',
        activo: true,
        descripcion: value,
        cfdi: false
      };
      this.service
        .addMedio(cliente.id, medio)
        .pipe(finalize(() => this.newTelefono.reset()))
        .subscribe((res: any) => {
          const { id, tipo, activo, descripcion, cfdi } = res;
          this.telefonos.push(
            this.fb.group({
              id,
              tipo,
              activo,
              descripcion,
              cfdi
            })
          );
          this.cd.markForCheck();
        });
      /*
      const medios = [...this.cliente.medios, medio];
      const cb = () => {
        this.newTelefono.reset();
      };
      this.actualizarDatos(cliente.id, { medios }, cb, cb);
      */
    }
  }

  deleteTelefono(index: number, cliente: Cliente, medio: any) {
    this.service
      .deleteMedio(cliente.id, medio.id)
      .pipe(finalize(() => this.cd.markForCheck()))
      .subscribe(
        () => {
          this.telefonos.removeAt(index);
          this.form.markAsPristine();
          this.snack.open('Datos actualizados', 'Cerrar', { duration: 3000 });
        },
        err => {
          console.error('Error eliminando contacto ', err);
        }
      );
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
        // this.cliente = res;
        this.setCliente(res);
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
          cliente: { id: this.cliente.id },
          nombre: key,
          direccion: value
        };
        this.agregarDireccion(newDir);
      } else {
        const changes: Partial<ClienteDireccion> = {
          direccion: value
        };
        this.actualizarDireccion(this.direccionSelected.id, changes);
      }

      // if (!this.direccionSelected) {
      //   const key = getDireccionKey(value);
      //   const newDir: ClienteDireccion = {
      //     nombre: key,
      //     direccion: value
      //   };
      //   this.direcciones.push(newDir);
      // } else {
      //   this.direccionSelected.direccion = value;
      // }
      // const changes = { direcciones: this.direcciones };

      // this.actualizarDatos(this.cliente.id, changes, () => {
      //   this.direccionForm.markAsPristine();
      //   this.cd.markForCheck();
      // });
    }
  }

  private agregarDireccion(direccion: Partial<ClienteDireccion>) {
    this.service
      .addDireccion(this.cliente.id, direccion)
      .pipe(finalize(() => {}))
      .subscribe(
        res => {
          this.direcciones.push(res);
          this.direccionForm.markAsPristine();
          this.cd.markForCheck();
          this.snack.open('Direccion agregada', 'Cerrar', { duration: 3000 });
        },
        err => {}
      );
  }
  private actualizarDireccion(
    direccionId: string,
    changes: Partial<ClienteDireccion>
  ) {
    this.service
      .updateDireccion(this.cliente.id, direccionId, changes)
      .pipe(finalize(() => {}))
      .subscribe(
        res => {
          this.direcciones.push(res);
          this.direccionForm.markAsPristine();
          this.cd.markForCheck();
          this.snack.open('Direccion actualizada', 'Cerrar', {
            duration: 3000
          });
        },
        err => {}
      );
  }
}
