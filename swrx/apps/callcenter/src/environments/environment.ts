// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const firebaseDevConfig = {
  apiKey: 'AIzaSyDEYis_Sg_-zgvkc_IFypRYEmuxwyyHuvo',
  authDomain: 'sx-callcenter-dev.firebaseapp.com',
  databaseURL: 'https://sx-callcenter-dev.firebaseio.com',
  projectId: 'sx-callcenter-dev',
  storageBucket: 'sx-callcenter-dev.appspot.com',
  messagingSenderId: '445916721702',
  appId: '1:445916721702:web:31fad5b5dd66082d9e6ce7',
  measurementId: 'G-VWXFNTBD0B'
};

export const environment = {
  apiUrl: 'http://localhost:8080/callcener/api',
  production: false,
  firebase: {
    apiKey: 'AIzaSyC4cYX9eZN4XqsX2EuYwN2GLPtb6R3r7RU',
    authDomain: 'siipapx-436ce.firebaseapp.com',
    databaseURL: 'https://siipapx-436ce.firebaseio.com',
    projectId: 'siipapx-436ce',
    storageBucket: 'siipapx-436ce.appspot.com',
    messagingSenderId: '84446617594',
    appId: '1:84446617594:web:e4a97a6edc5957446dce43'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
