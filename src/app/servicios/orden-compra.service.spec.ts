import { TestBed } from '@angular/core/testing';

import { OrdenCompraService } from './orden-compra.service';

describe('OrdenCompraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrdenCompraService = TestBed.get(OrdenCompraService);
    expect(service).toBeTruthy();
  });
});
