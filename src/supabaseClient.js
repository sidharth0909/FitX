import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hlrrtkyrtahcpqzepzhl.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhscnJ0a3lydGFoY3BxemVwemhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjA5MzEsImV4cCI6MjA1OTA5NjkzMX0.-1Sf4M4gqtYigyTVRuMQSCceW7iYmU_9es-h9b44EqY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)