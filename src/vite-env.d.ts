/// <reference types="vite/client" />

// Add any custom VITE_* environment variables you use so TypeScript knows them
interface ImportMetaEnv {
    readonly VITE_ASSETS_BASE_URL?: string;
    readonly VITE_DEFAULT_PROFILE?: string;
    readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}  