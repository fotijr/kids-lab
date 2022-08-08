/// <reference types="vite/client" />

import axios from 'axios';

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const ApiBase = import.meta.env.VITE_API_URL;

const axiosBase = axios.create({
  baseURL: ApiBase,
  // needed so API serves 401 instead of attempting to redirect to login page
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  },
  // including cookie for auth status
  withCredentials: true
});

export default axiosBase;
