/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYLOAD_API_URL: string;
  readonly VITE_PAYLOAD_TOKEN: string;
  readonly VITE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
