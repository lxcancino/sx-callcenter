import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/@data-access/services/producto.service';

@Component({
  selector: 'app-prods-browser',
  templateUrl: './prods-browser.page.html',
  styleUrls: ['./prods-browser.page.scss'],
})
export class ProdsBrowserPage implements OnInit {
  productos$ = this.service.productos$;
  constructor(private service: ProductoService) {}

  ngOnInit() {}
}
