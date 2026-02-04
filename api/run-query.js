const { createClient } = require('@supabase/supabase-js');

let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://your-project-url.supabase.co') {
    supabase = createClient(process.env.SUPABASE_URL, process.env.VITE_SUPABASE_KEY);
}

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let { query } = req.body;

        if (!supabase) {
            return res.status(503).json({ error: "Supabase not configured. Please add SUPABASE_URL to environment variables" });
        }

        // Security check
        const upperQuery = query.toUpperCase();
        if (upperQuery.includes('DROP ') || upperQuery.includes('DELETE ') || upperQuery.includes('UPDATE ') || upperQuery.includes('INSERT ')) {
            return res.status(403).json({ error: "Write operations are restricted in this sandbox." });
        }

        // Strip trailing semicolon
        query = query.trim().replace(/;$/, '');

        const { data, error } = await supabase.rpc('exec_sql', { query_text: query });

        if (error) {
            throw error;
        }

        res.status(200).json({ data });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: error.message });
    }
};
