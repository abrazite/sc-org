import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

import { LocalStorageService } from 'angular-2-local-storage';
import { Personnel } from '../models/personnel.model';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private storage: LocalStorageService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const membership = this.storage.get('membership') as Personnel | null;
    if (!membership) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}
