const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function testConnections() {
    console.log("Testing Supabase JS Client...");
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: sbData, error: sbError } = await supabase.from('show').select('id').limit(1);
    if (sbError) {
        console.error("Supabase Error:", sbError);
    } else {
        console.log("Supabase Connection: SUCCESS");
    }

    console.log("Testing Prisma Client...");
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        const shows = await prisma.show.findFirst();
        console.log("Prisma Connection: SUCCESS");
    } catch (e) {
        console.error("Prisma Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testConnections();
