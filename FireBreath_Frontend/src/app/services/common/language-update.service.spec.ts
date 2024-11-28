import { TestBed } from '@angular/core/testing';

import { LanguageUpdateService } from './language-update.service';

describe('LanguageUpdateService', () => {
  let service: LanguageUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
