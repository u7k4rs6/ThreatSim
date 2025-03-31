// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxupgkzprrbkzapufdpu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dXBna3pwcnJia3phcHVmZHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTUyODIsImV4cCI6MjA1ODU5MTI4Mn0.CCaUd4sqk_NN9N19-pglJa-B4JiSZTTVR_Mwj4pMcWk';

export const supabase = createClient(supabaseUrl, supabaseKey);
