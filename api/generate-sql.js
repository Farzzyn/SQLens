import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize OpenAI client for OpenRouter
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

// Initialize Supabase
let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://your-project-url.supabase.co') {
    supabase = createClient(process.env.SUPABASE_URL, process.env.VITE_SUPABASE_KEY);
}

// Helper to fetch schema
async function getDatabaseSchema() {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase.rpc('exec_sql', {
            query_text: "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public'"
        });
        if (error) {
            console.warn("Schema fetch failed:", error);
            return null;
        }

        const tables = {};
        if (Array.isArray(data)) {
            data.forEach(row => {
                if (!tables[row.table_name]) tables[row.table_name] = [];
                tables[row.table_name].push(`${row.column_name} (${row.data_type})`);
            });
        }

        return Object.entries(tables).map(([table, cols]) => `Table: ${table} \nColumns: ${cols.join(', ')}`).join('\n\n');
    } catch (e) {
        console.error("Schema fetch error:", e);
        return null;
    }
}

export default async function handler(req, res) {
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
        const { prompt, schema } = req.body;

        let activeSchema = schema;
        if (!activeSchema) {
            const realSchema = await getDatabaseSchema();
            if (realSchema) {
                activeSchema = "Here is the active database schema:\n" + realSchema;
            }
        }

        const systemPrompt = `
      You are an expert SQL assistant. Your goal is to translate natural language questions into valid, ready-to-run PostgreSQL queries.
      
      Rules:
      1. Return ONLY a JSON object with two fields: "sql" (the SQL query string) and "explanation" (a brief 1-sentence explanation).
      2. Do NOT use markdown formatting (no \`\`\`).
      3. Use PostgreSQL syntax ONLY. Do NOT use backticks (\`) - use double quotes (") for identifiers if needed, or preferably use lowercase unquoted identifiers.
      4. If the user asks for dangerous operations (DROP, DELETE, UPDATE), return an error message in the explanation and set sql to null.
      5. Default to read-only queries (SELECT statements only).
      6. CRITICAL: Only query tables that exist in the provided schema. Do NOT make up table names.
      7. If no schema is provided, or if the user's question is unclear, set sql to null and provide a helpful explanation asking for clarification.
      8. Table and column names should be lowercase and unquoted unless they contain special characters.
      
      Context/Schema:
      ${activeSchema || "No database schema available. Please ask the user which tables they want to query, or suggest they run a query to list all tables using: SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"}
    `;

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0].message.content;

        try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonResponse = JSON.parse(cleanText);
            res.status(200).json(jsonResponse);
        } catch (e) {
            console.error("Failed to parse LLM response:", text);
            res.status(500).json({ error: "Failed to generate valid JSON from LLM", raw: text });
        }
    } catch (error) {
        console.error("OpenRouter Error:", error);
        res.status(500).json({ error: error.message });
    }
}
