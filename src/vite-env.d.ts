/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOGIN_ENDPOINT: string;
  readonly VITE_LOGOUT_ENDPOINT: string;
  readonly VITE_REFRESH_ENDPOINT: string;
  readonly VITE_REGISTER_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}