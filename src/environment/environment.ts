const env = (window as any)['__env'] || {};

export const environment = {
  production: env.production ?? false,
  apiUrl: 'https://warwold-be-7.onrender.com/api/', // URL จริงของ backend
  firebase: {
    apiKey: env.firebaseApiKey ?? 'AIzaSyAm7Krlxn1ylDH_KbKDrAwmEXfWefhkoTk',
    authDomain: env.firebaseAuthDomain ?? 'wanderworld-project.firebaseapp.com',
    projectId: env.firebaseProjectId ?? 'wanderworld-project',
    storageBucket:
      env.firebaseStorageBucket ?? 'wanderworld-project.firebasestorage.app',
    messagingSenderId: env.firebaseMessagingSenderId ?? '723882338298',
    appId: env.firebaseAppId ?? '1:723882338298:web:85f56033ff0f42068ce643',
    measurementId: env.firebaseMeasurementId ?? 'G-1L00ZJXMPB',
  },
};
