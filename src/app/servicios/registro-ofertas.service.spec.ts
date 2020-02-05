import { TestBed } from '@angular/core/testing';

import { RegistroOfertasService } from './registro-ofertas.service';

describe('RegistroOfertasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistroOfertasService = TestBed.get(RegistroOfertasService);
    expect(service).toBeTruthy();
  });
});
