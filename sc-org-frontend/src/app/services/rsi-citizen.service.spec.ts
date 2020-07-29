import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import { RSICitizenService } from './rsi-citizen.service';

describe('RSICitizenService', () => {
  let service: RSICitizenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(RSICitizenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCitizen', () => {
    it('should parse', (done) => {
      service.getCitizen('abrazite').subscribe(() => done());
    });
  });
});
