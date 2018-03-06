import { TestBed, inject } from '@angular/core/testing';

import { GkCommonServiceService } from './gk-common-service.service';

describe('GkCommonServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GkCommonServiceService]
    });
  });

  it('should ...', inject([GkCommonServiceService], (service: GkCommonServiceService) => {
    expect(service).toBeTruthy();
  }));
});
