import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { BarchartdataservicesService } from './barchartdataservices.service';

describe('BarchartdataservicesService', () => {
  let service: BarchartdataservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(BarchartdataservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
