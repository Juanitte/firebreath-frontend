import { TestBed } from '@angular/core/testing';

import { ThemeUpdateService } from './theme-update.service';

describe('ThemeUpdateService', () => {
  let service: ThemeUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
