import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';

import { Membership, Personnel, PersonnelSummary } from '../models/personnel.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpService: HttpClient,
    private storage: LocalStorageService
  ) {}

  public getMembership(filterPairs: { [key: string]: string} ): Observable<Membership[]> {
    return this.httpService.get<Membership[]>(`${environment.api}/membership?${UserService.createFilterStr(filterPairs)}&limit=1000`);
  }

  public getAllPersonnel(): Observable<PersonnelSummary[]> {
    const membership = this.storage.get('membership') as Personnel;
    return this.httpService.get<PersonnelSummary[]>(`${environment.api}/personnel?organizationId=${membership.organizationId}&limit=1000`);
  }

  public getPersonnel(personnelId: string): Observable<Personnel> {
    const membership = this.storage.get('membership') as Personnel;
    return this.httpService.get<Personnel>(`${environment.api}/personnel/${personnelId}?organizationId=${membership.organizationId}`);
  }

  private static createFilterStr(filterPairs: { [key: string]: string}): string {
    const filterStrs: string[] = [];
    Object.keys(filterPairs).forEach(key => {
      filterStrs.push(`${key}=${filterPairs[key]}`);
    });
    return filterStrs.join('&');
  }
}
