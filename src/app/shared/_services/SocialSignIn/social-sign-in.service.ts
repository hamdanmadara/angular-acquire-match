import { Injectable, NgZone } from '@angular/core';

// import { AuthService } from '../Auth/auth.service';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// // declare const google:any;
// declare const gapi: any;


@Injectable({
  providedIn: 'root'
})
export class SocialSignInService {
  // google_client_id:any = '497303743191-v23hp6hs508m8sgeerbhc7k83aj1ij0g.apps.googleusercontent.com';
  // signInLoading:boolean=false
  
  constructor
  (
    // private ngZone: NgZone,
    // private authService: AuthService,
    // private http: HttpClient

  ) { }


  // private clientId = '497303743191-v23hp6hs508m8sgeerbhc7k83aj1ij0g.apps.googleusercontent.com';
  // private backendUrl = 'http://localhost:7002/google-login'; // Replace with your backend URL
  // private authInstance: any;

  // initializeGoogleAuth(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     gapi.load('auth2', () => {
  //       this.authInstance = gapi.auth2.init({
  //         client_id: this.clientId,
  //         cookiepolicy: 'single_host_origin',
  //       });
  //       resolve();
  //     });
  //   });
  // }

  // async googleSignIn(): Promise<any> {
  //   try {
  //     const googleUser = await this.authInstance.signIn();
  //     const idToken = googleUser.getAuthResponse().id_token;
  //     return this.backendLogin(idToken);
  //   } catch (error) {
  //     console.error('Google sign-in error:', error);
  //     throw error;
  //   }
  // }

  // backendLogin(token: string): Observable<any> {
  //   return this.http.post(this.backendUrl, { token });
  // }  
  
}
