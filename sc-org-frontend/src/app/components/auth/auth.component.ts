import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Membership } from '../../models/personnel.model';
import { UserService } from '../../services/user.service';

export interface IdentityResponse {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private storage: LocalStorageService,

    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.code) {
          this.getAccessToken(params.code, params.state);
      }
    });
  }

  getAccessToken(code: string, state: string): Observable<object> {
    if (state !== this.storage.get('state')) {
      const observable = new Subject<object>();
      observable.error('invalid state');
      return observable;
    }
    const payload = new HttpParams()
      .append('grant_type', 'authorization_code')
      .append('code', code)
      .append('code_verifier', this.storage.get('codeVerifier'))
      .append('redirect_uri', environment.oauthCallbackUrl)
      .append('client_id', environment.oauthClientId);
    const observer = this.http.post(environment.oauthTokenUrl, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    observer.subscribe(response => {
      const tokenResponse = response as { access_token: string, refresh_token: string, token_type: string };
      this.storage.set('code', code);
      this.storage.set('access_token', tokenResponse.access_token);
      this.storage.set('refresh_token', tokenResponse.refresh_token);
      this.storage.set('token_type', tokenResponse.token_type);

      this.getUserInfo().subscribe(() => 
        this.userService.getMembership({
          username: this.identity.username,
          discriminator: this.identity.discriminator,
        })
        .subscribe(membership => {
          console.log(membership);
          if (membership && membership.length > 0) {
            this.storage.set('membership', membership[0]);
            window.location.href = '/';
          }
        }));
    });
    return observer;
  }

  getUserInfo(): Observable<object> {
    const observer = this.http.get(environment.userInfoUrl, {
      headers: {
        authorization: this.storage.get('token_type') + ' ' + this.storage.get('access_token'),
      },
    });
    observer.subscribe(response => {
      const identityResponse = response as IdentityResponse;
      this.storage.set('identity', identityResponse);
    });
    return observer;
  }

  get identity(): IdentityResponse {
    return this.storage.get('identity');
  }

  get membership(): Membership {
    return this.storage.get('membership');
  }
}
