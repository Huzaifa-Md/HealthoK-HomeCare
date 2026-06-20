const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://eufvamaiszpchwgvxpoq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZnZhbWFpc3pwY2h3Z3Z4cG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NzY5ODMsImV4cCI6MjA5MzU1Mjk4M30.vQIVKuNrro5HRasWaRukvN4iE0XLjnceQgwgQKK5QIc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'hiah.sadiq@gmail.com',
    password: 'PatientCareAdmin2026!',
  });
  if (error) {
    console.error('Error creating user:', error);
  } else {
    console.log('User created successfully:', data);
  }
}

createUser();
