import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyfjwxukqlrovqtdcqbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Zmp3eHVrcWxyb3ZxdGRjcWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMTY5MTMsImV4cCI6MjA1MjY5MjkxM30.jSk2-qUIErrSAnQi-vvQ0GvNTQrb-AIHRO_2FObmlts';

export const supabase = createClient(supabaseUrl, supabaseKey);

  
