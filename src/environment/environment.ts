const env = (window as any)['__env'] || {};

export const environment = {
  production: env.production || false,
  apiUrl: env.apiUrl,
};
