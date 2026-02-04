# SQLens

**Your Data Through a Lens** 🔍

SQLens is a modern, AI-powered SQL query interface that translates natural language into SQL queries. Query your database by simply asking questions in plain English.

## Features

- 🤖 **AI-Powered Translation**: Convert natural language to SQL using state-of-the-art AI models
- 🎯 **Dual Mode Interface**: 
  - **Beginner Mode**: Read-only SQL preview with explanations
  - **Expert Mode**: Edit and customize generated queries
- 🎨 **Beautiful UI**: Premium dark mode with glassmorphism design
- 🔒 **Secure**: Read-only by default, blocks dangerous operations
- ⚡ **Fast**: Real-time query generation and execution
- 🎨 **Syntax Highlighting**: Professional SQL code highlighting

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenRouter API (Gemini 2.0 Flash)
- **Styling**: Vanilla CSS with modern design principles

## Setup

### Prerequisites
- Node.js 18+
- Supabase account
- OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Farzzyn/SQLens.git
cd SQLens
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_SUPABASE_KEY=your_supabase_publishable_key
OPENROUTER_API_KEY=your_openrouter_api_key
SUPABASE_URL=https://your-project.supabase.co
```

4. Set up Supabase function (run in Supabase SQL Editor):
```sql
create or replace function exec_sql(query_text text)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  execute 'select json_agg(t) from (' || query_text || ') t' into result;
  
  if result is null then
    result := '[]'::json;
  end if;
  
  return result;
exception when others then
  return json_build_object('error', SQLERRM);
end;
$$;
```

5. Run the application:
```bash
# Terminal 1 - Backend
node server.js

# Terminal 2 - Frontend
npm run dev
```

6. Open `http://localhost:5173`

## Usage

### Beginner Mode
1. Type a natural language question (e.g., "Show me all users")
2. Click "Generate"
3. View the SQL query and explanation
4. See results automatically

### Expert Mode
1. Type your question
2. Click "Generate"
3. Edit the generated SQL if needed
4. Click "Run SQL" to execute

## Security

- Read-only queries by default
- Blocks DROP, DELETE, UPDATE, INSERT operations
- Secure RPC function for query execution
- Environment variables for sensitive data

## License

MIT

## Author

Built with ❤️ by Farzzyn
