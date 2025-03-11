import { TestBed } from '@angular/core/testing';

import { SocialSignInService } from './social-sign-in.service';

describe('SocialSignInService', () => {
  let service: SocialSignInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialSignInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
