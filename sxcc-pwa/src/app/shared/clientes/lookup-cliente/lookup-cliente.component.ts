import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientesService } from 'src/app/@data-access/services/clientes.service';
import { Cliente } from 'src/app/models';

@Component({
  selector: 'app-lookup-cliente',
  templateUrl: './lookup-cliente.component.html',
  styleUrls: ['./lookup-cliente.component.scss'],
})
export class LookupClienteComponent implements OnInit {
  filter$ = new BehaviorSubject('');
  clientes$ = this.service.clientes$;

  filteredClientes$ = combineLatest([this.filter$, this.clientes$]).pipe(
    map(([term, clientes]) =>
      clientes.filter((item) =>
        item.nombre.toLowerCase().includes(term.toLowerCase())
      )
    )
  );
  constructor(
    private service: ClientesService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  close() {}

  search({ target: { value } }) {
    console.log('Search: ', value);
    this.filter$.next(value);
  }

  select(c: Partial<Cliente>) {
    this.modalCtrl.dismiss(c);
  }
}
