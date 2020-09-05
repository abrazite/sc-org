import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';

import { Membership, Personnel, PersonnelSummary } from '../models/personnel.model';
import { environment } from 'src/environments/environment';
import { Auth, AuthDetails } from '../models/auth.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpService: HttpClient,
    private storage: LocalStorageService
  ) {}

  public getMembership(filterPairs: { [key: string]: string} ): Observable<Membership[]> {
    const auth = this.storage.get('auth') as Auth;
    const authDetails = this.storage.get('authDetails') as AuthDetails;
    return this.httpService.get<Membership[]>(`${environment.api}/membership?${UserService.createFilterStr(filterPairs)}&limit=1000`, {
      headers: {
        'authorization': `Bearer ${auth.accessToken}`,
        'x-org-manager-organization-id': authDetails.organizationId
      }
    });
  }

  public getAllPersonnel(): Observable<PersonnelSummary[]> {
    const auth = this.storage.get('auth') as Auth;
    const authDetails = this.storage.get('authDetails') as AuthDetails;
    return this.httpService.get<PersonnelSummary[]>(`${environment.api}/personnel?organizationId=${authDetails.organizationId}&limit=1000`, {
      headers: {
        'authorization': `Bearer ${auth.accessToken}`,
        'x-org-manager-organization-id': authDetails.organizationId
      }
    });
  }

  public getPersonnel(personnelId: string): Observable<Personnel> {
    const auth = this.storage.get('auth') as Auth;
    const authDetails = this.storage.get('authDetails') as AuthDetails;
    return this.httpService.get<Personnel>(`${environment.api}/personnel/${personnelId}?organizationId=${authDetails.organizationId}`, {
      headers: {
        'authorization': `Bearer ${auth.accessToken}`,
        'x-org-manager-organization-id': authDetails.organizationId
      }
    });
  }

  private static createFilterStr(filterPairs: { [key: string]: string}): string {
    const filterStrs: string[] = [];
    Object.keys(filterPairs).forEach(key => {
      filterStrs.push(`${key}=${filterPairs[key]}`);
    });
    return filterStrs.join('&');
  }
}
