import { concatMap, tap } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from 'angular-2-local-storage';

import { Auth, AuthDetails } from '../../models/auth.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  auth?: Auth;
  authDetails?: AuthDetails;
  error?: string;

  constructor(
    private storage: LocalStorageService,
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.auth = this.storage.get('auth') as Auth;
    this.authDetails = this.storage.get('authDetails') as AuthDetails;
    if (!this.auth || !this.authDetails) {
      this.updateAuth();
    }
  }

  updateAuth(): void {
    delete this.error;
    this.httpClient.head('/validate', { observe: 'response' }).pipe(
      tap(res => {
        if (!res.ok) {
          throw new Error(((res as unknown) as HttpErrorResponse).message);
        }
        this.auth = {
          accessToken: res.headers.get('x-vouch-idp-accesstoken') as string,
        };
      }),
      concatMap(() => this.httpClient.head('/api/validate', {
        observe: 'response',
        headers: { 'authorization': `Bearer ${this.auth!.accessToken}` }
      })),
      tap(res => {
        if (!res.ok) {
          throw new Error(((res as unknown) as HttpErrorResponse).message);
        }
        this.authDetails = {
          citizenRecord: res.headers.has('x-org-manager-citizen-record') ? parseInt(res.headers.get('x-org-manager-citizen-record') as string) : undefined,
          citizenName: res.headers.get('x-org-manager-citizen-name') as string,
          handleName: res.headers.get('x-org-manager-handle-name') as string,
          organizationId: res.headers.get('x-org-manager-organization-id') as string,
          organizationIds: (res.headers.get('x-org-manager-organization-ids') as string).split(','),
          personnelId: res.headers.get('x-org-manager-personnel-id') as string,
          getSecurityLevel: parseInt(res.headers.get('x-org-manager-get-security-level') as string),
          postSecurityLevel: parseInt(res.headers.get('x-org-manager-post-security-level') as string),
          putSecurityLevel: parseInt(res.headers.get('x-org-manager-put-security-level') as string),
          delSecurityLevel: parseInt(res.headers.get('x-org-manager-del-security-level') as string),
          proxySecurityLevel: parseInt(res.headers.get('x-org-manager-proxy-security-level') as string),
        };
      }),
    ).subscribe(res => {
      this.storage.set('auth', this.auth);
      this.storage.set('authDetails', this.authDetails);

      if (this.route.snapshot.queryParamMap.has('url')) {
        window.location.href = this.route.snapshot.queryParamMap.get('url') as string;
      } else {
        window.location.href = '/';
      }
    }, (e: Error) => this.error = e.message);
  }

  login(): void {
    window.location.href = 'https://login.org-manager.space/login?url=https://app.org-manager.space/auth';
  }

  logout(): void {
    delete this.auth;
    delete this.authDetails;

    this.storage.remove('auth');
    this.storage.remove('authDetails');
    window.location.href = 'https://login.org-manager.space/logout?url=https://app.org-manager.space';
  }
}
