import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://waolvlckinxsgtxzsiul.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhb2x2bGNraW54c2d0enNpdWwiLCJpYXQiOjE3MTA4MjU5NzgsImV4cCI6MjAyMjQwMTk3OH0.4nH7Y9mPIkUwsc5VaBqNSMCC5FhKcmVKH40avwI0VRo'

export const supabase = createClient(supabaseUrl, supabaseKey)
