import { prisma } from './lib/prisma';
import { supabase } from './lib/supabase';

async function testConnections() {
    console.log("=== Testing Supabase JS Client ===");
    try {
        const { data, error } = await supabase.from('show').select('id').limit(1);
        if (error) {
            console.error("❌ Supabase Error:", error);
        } else {
            console.log("✅ Supabase Connection: SUCCESS. Found shows:", data?.length);
        }
    } catch (e) {
        console.error("❌ Supabase Exception:", e);
    }

    console.log("\n=== Testing Prisma Client ===");
    try {
        const shows = await prisma.show.findFirst({ select: { id: true } });
        console.log("✅ Prisma Connection: SUCCESS. Found show ID:", shows?.id);
    } catch (e) {
        console.error("❌ Prisma Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testConnections();
