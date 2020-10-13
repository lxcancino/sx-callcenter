import { Component } from '@angular/core';
import { ProductoService } from '../@data-access/services/producto.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  productos$ = this.service.productos$;
  constructor(private service: ProductoService) {}

  ionViewDidEnter() {
    // this.service.fetch();
  }
}
