import { TestBed } from '@angular/core/testing';

import { RegisterShortcutService } from './register-shortcut.service';

describe('RegisterShortcutService', () => {
  let service: RegisterShortcutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterShortcutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
