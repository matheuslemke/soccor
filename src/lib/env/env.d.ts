interface ImportMetaEnv {
  readonly VITE_API_TOKEN: string
  readonly VITE_API_URL: string
  readonly VITE_APP_SUPABASE_URL: string
  readonly VITE_APP_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
