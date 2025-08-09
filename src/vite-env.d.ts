/// <reference types="vite/client" />

// Add any custom VITE_* vars you use so TS knows them
interface ImportMetaEnv {
    readonly VITE_AUTH_MODE?: 'apikey' | 'cognito';
    readonly VITE_USE_API_KEY?: 'true' | 'false';
    readonly VITE_ASSETS_BASE_URL?: string;
    readonly VITE_DEFAULT_PROFILE?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }  