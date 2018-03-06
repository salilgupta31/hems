import { TestBed, inject } from '@angular/core/testing';

import { HierarchyService } from './hierarchy.service';

describe('HierarchyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HierarchyService]
    });
  });

  it('should be created', inject([HierarchyService], (service: HierarchyService) => {
    expect(service).toBeTruthy();
  }));
});
