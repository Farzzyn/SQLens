import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.VITE_SUPABASE_KEY);

async function listTables() {
    console.log("Listing all tables...");
    try {
        const { data, error } = await supabase.rpc('exec_sql', {
            query_text: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
        });

        if (error) {
            console.error("Error:", error);
            return;
        }

        console.log("Tables in your database:");
        data.forEach((row, i) => {
            console.log(`${i + 1}. "${row.table_name}" (length: ${row.table_name.length} chars)`);
        });
    } catch (e) {
        console.error("Unexpected error:", e);
    }
}

listTables();
