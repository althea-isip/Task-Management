import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
//import {AuthenticationService} from 'app/services';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    //private authenticationService: AuthenticationService
  ){
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      /* const user = this.authenticationService.userValue;
      if (user) {
     
          return true;
      } */

     
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
  }
  
}
