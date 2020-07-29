import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../models/user.model';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private storage: LocalStorageService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.storage.get('user') as User | null;
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}
