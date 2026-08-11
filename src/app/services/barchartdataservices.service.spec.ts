import { TestBed } from '@angular/core/testing';

import { BarchartdataservicesService } from './barchartdataservices.service';

describe('BarchartdataservicesService', () => {
  let service: BarchartdataservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarchartdataservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
