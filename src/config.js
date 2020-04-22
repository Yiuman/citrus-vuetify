export const API_BASE_PATH = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' )
    ? process.env.BASE_URL : '/devProxy';
