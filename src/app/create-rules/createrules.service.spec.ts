import { TestBed, inject } from '@angular/core/testing';

import { CreaterulesService } from './createrules.service';

describe('CreaterulesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreaterulesService]
    });
  });

  it('should ...', inject([CreaterulesService], (service: CreaterulesService) => {
    expect(service).toBeTruthy();
  }));
});
