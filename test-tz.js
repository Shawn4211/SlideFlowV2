const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function check() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { data } = await supabase.from('show').select('*').order('id', { ascending: false }).limit(2);
    console.log("Returned data from Supabase DB:", JSON.stringify(data, null, 2));
}

check();
