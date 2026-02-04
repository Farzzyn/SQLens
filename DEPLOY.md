# Deploying SQLens to Vercel

## Quick Deploy

### 1. Vercel Configuration

**Build Settings:**
- **Framework Preset**: Vite
- **Build Command**: `npm run build` or `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install` (auto-detected)

### 2. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_KEY=your_supabase_publishable_key
OPENROUTER_API_KEY=your_openrouter_api_key
SUPABASE_URL=https://your-project.supabase.co
```

### 3. Deploy Steps

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure settings as above
6. Add environment variables
7. Click "Deploy"

### 4. After Deployment

Your app will be live at: `https://your-app.vercel.app`

The serverless functions will automatically handle:
- `/api/generate-sql` - AI SQL generation
- `/api/run-query` - Query execution

## Local Testing

Test the production build locally:
```bash
npm run build
npm run preview
```

## Notes

- Frontend and backend are both deployed as a single Vercel project
- API routes use Vercel Serverless Functions
- No need to deploy backend separately
- CORS is configured automatically
