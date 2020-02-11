import { TestBed } from '@angular/core/testing';

import { RegistroRequerimientosService } from './registro-requerimientos.service';

describe('RegistroRequerimientosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistroRequerimientosService = TestBed.get(RegistroRequerimientosService);
    expect(service).toBeTruthy();
  });
});
