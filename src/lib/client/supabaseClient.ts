import { createClient } from '@supabase/supabase-js'
import { environment } from '$lib/env/env'

const supabaseUrl = environment.databaseUrl as string
const supabaseAnonKey = environment.databaseKey as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
