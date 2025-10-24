/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_BACKEND_HOST: string
  readonly VITE_BACKEND_PORT: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}