import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Auth, AuthDetails } from '../models/auth.model';
import { LocalStorageService } from 'angular-2-local-storage';
import { Membership } from '../models/personnel.model';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private storage: LocalStorageService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const auth = this.storage.get('auth') as Auth;
    const authDetails = this.storage.get('authDetails') as AuthDetails;

    if (!auth || !authDetails) {
      window.location.href = `/auth?url=${escape(location.href)}`;
      return false;
    } else {
      return true;
    }
  }
}
