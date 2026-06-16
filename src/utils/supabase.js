import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zomhijuchbctksafnsze.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_G4WOQSPfBRfvWr5acrpBhQ_lWLt78zM'

export const supabase = createClient(supabaseUrl, supabaseKey)
