const env = (window as any)['__env'] || {};

export const environment = {
  production: env.production ?? false,
  apiUrl: 'https://warwold-be-6.onrender.com/', // URL จริงของ backend
  firebase: {
    apiKey: env.firebaseApiKey ?? 'AIzaSyBeT7WnlRwQUxlcO-h7QLIusu8kjwSkTlU',
    authDomain: env.firebaseAuthDomain ?? 'waderworld-project.firebaseapp.com',
    projectId: env.firebaseProjectId ?? 'waderworld-project',
    storageBucket:
      env.firebaseStorageBucket ?? 'waderworld-project.firebasestorage.app',
    messagingSenderId: env.firebaseMessagingSenderId ?? '579694320386',
    appId: env.firebaseAppId ?? '1:579694320386:web:161091c931fdebd586401b',
    measurementId: env.firebaseMeasurementId ?? 'G-9FLYP90RCB',
  },
};
