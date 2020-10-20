import { Component, OnDestroy, OnInit } from '@angular/core';

import { ProductoService } from '../@data-access/services/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit, OnDestroy {
  productos$ = this.service.productos$;
  constructor(private service: ProductoService) {}

  ngOnInit() {}

  ngOnDestroy() {}

  ionViewDidEnter() {}

  ionViewDidLeave() {}
}
