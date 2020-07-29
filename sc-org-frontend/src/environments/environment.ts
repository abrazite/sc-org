// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  oauthClientId: '737809908681932842',
  oauthLoginUrl: 'https://discord.com/api/oauth2/authorize',
  oauthTokenUrl: 'https://discord.com/api/oauth2/token',
  oauthRevokeUrl: 'https://discord.com/api/oauth2/token/revoke',
  oauthCallbackUrl: 'http://localhost:4200/oauth/callback',
  userInfoUrl: 'https://discord.com/api/users/@me'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
