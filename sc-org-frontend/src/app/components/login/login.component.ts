import { Component, OnInit } from '@angular/core';
import * as randomstring from 'randomstring';
import { LocalStorageService } from 'angular-2-local-storage';
import * as CryptoJS from 'crypto-js';

import { environment } from '../../../environments/environment';
import { User, UserSchema } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User | null = null;

  constructor(private storage: LocalStorageService) {
  }

  ngOnInit(): void {
    const userJson = this.storage.get('user') as UserSchema | null;
    if (userJson) {
      this.user = User.fromJson(userJson);
      console.log(this.user.activeRankRecord);
    }
  }

  redirectToLoginPage(): void {
    const state = randomstring.generate(40);
    const codeVerifier = randomstring.generate(128);
    this.storage.set('state', state);
    this.storage.set('codeVerifier', codeVerifier);
    const codeVerifierHash = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64);
    const codeChallenge = codeVerifierHash
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    const params = [
        'response_type=code',
        'state=' + state,
        'client_id=' + environment.oauthClientId,
        'scope=identify',
        'code_challenge=' + codeChallenge,
        'code_challenge_method=S256',
        'redirect_uri=' + encodeURIComponent(environment.oauthCallbackUrl),
    ];
    window.location.href = environment.oauthLoginUrl + '?' + params.join('&');
  }

  logout(): void {
    this.user = null;
    this.storage.set('user', null);
    window.location.href = '/login';
  }
}
