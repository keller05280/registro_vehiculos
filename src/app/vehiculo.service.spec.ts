import { TestBed } from '@angular/core/testing';

import { VehiculosService } from './vehiculo.service';

describe('VehiculoService', () => {
  let service: VehiculosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiculosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
