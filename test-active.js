const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function testFetch() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const tomorrowStart = new Date();
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(tomorrowEnd.getHours() + 1);

    const { data: insertData, error: insertError } = await supabase.from('show').insert({
        name: "Future Mock Show",
        start_time: tomorrowStart.toISOString(),
        finish_time: tomorrowEnd.toISOString()
    }).select().single();

    console.log("Inserted Mock Show Start:", insertData.start_time);
    console.log("Inserted Mock Show End  :", insertData.finish_time);

    const now = new Date().toISOString();
    console.log("Current ISO 'now':", now);

    const { data: activeShows } = await supabase
        .from("show")
        .select("*")
        .lte("start_time", now)
        .gte("finish_time", now)
        .order("start_time", { ascending: true })
        .limit(1);

    console.log("Query Active Shows length:", activeShows.length);
    if (activeShows.length > 0) console.log("Active Show Name:", activeShows[0].name);

    const { data: upcomingShows } = await supabase
        .from("show")
        .select("*")
        .gt("start_time", now)
        .order("start_time", { ascending: true })
        .limit(1);

    console.log("Query Upcoming Shows length:", upcomingShows.length);
    if (upcomingShows.length > 0) console.log("Upcoming Show Name:", upcomingShows[0].name);

    await supabase.from('show').delete().eq('id', insertData.id);
}

testFetch();
