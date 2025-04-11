import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://waavlckmkmsggtxzsuji.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXZsY2tta21zZ2d0eHpzdWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MjI2MTgsImV4cCI6MjA1OTE5ODYxOH0.lCFo2-xDxp039f2EsJesSV7A3K05idNtOtRQvfi50NI'

export const supabase = createClient(supabaseUrl, supabaseKey)
