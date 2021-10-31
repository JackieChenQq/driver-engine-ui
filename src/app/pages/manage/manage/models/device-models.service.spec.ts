import { TestBed } from '@angular/core/testing';

import { DeviceModelsService } from './device-models.service';

describe('DeviceModelsService', () => {
  let service: DeviceModelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceModelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
