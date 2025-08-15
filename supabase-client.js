import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Remplacez par vos propres informations Supabase
const supabaseUrl = 'https://uiraepbmqeuqkaxpupct.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcmFlcGJtcWV1cWtheHB1cGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjI4MDAsImV4cCI6MjA3MDgzODgwMH0.RtbVxvVfT0OFq209lPMvHR7k4_h2weAfnig7ahrFFpw';

export const supabase = createClient(supabaseUrl, supabaseKey);
