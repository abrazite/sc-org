import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RSICitizenSchema } from '../models/rsi-citizen.model';


@Injectable({
  providedIn: 'root'
})
export class RSICitizenService {
  constructor(private httpService: HttpClient) { }

  public getCitizen(handle: string): Observable<RSICitizenSchema> {
    return this.httpService.get<RSICitizenSchema>(`http://localhost:8081/rsi/citizen/${handle}`).pipe(
      map(record => {
        if (record.enlisted) {
          record.enlisted = new Date(record.enlisted);
        }
        return record;
      })
    );
  }
}
