# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Railway (Backend + Database)
1. Go to [Railway](https://railway.app)
2. Create a new project
3. Add PostgreSQL database
4. Deploy from GitHub (server directory)
5. Add environment variables:
   - `DATABASE_URL` (auto-filled by Railway)
   - `PORT=3000`
6. Run seed command in Railway terminal: `npm run seed`
7. Note your backend URL

#### Vercel (Frontend)
1. Go to [Vercel](https://vercel.com)
2. Import your repository
3. Set root directory to `client`
4. Add environment variable:
   - `VITE_API_URL=your-railway-backend-url`
5. Deploy

### Option 2: Render (Full Stack)

1. Go to [Render](https://render.com)
2. Create a PostgreSQL database
3. Create a Web Service for backend:
   - Root directory: `server`
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Add DATABASE_URL from PostgreSQL instance
4. Create a Static Site for frontend:
   - Root directory: `client`
   - Build: `npm run build`
   - Publish directory: `dist`
5. Run seed script in backend shell

### Option 3: Fly.io (Full Stack)

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Deploy backend
cd server
fly launch
fly postgres create
fly postgres attach <postgres-app-name>
fly deploy

# Deploy frontend
cd ../client
fly launch
fly deploy
```

## Embedding in Your Portfolio

### Option 1: iframe
```html
<iframe 
  src="https://your-app-url.com" 
  width="100%" 
  height="800px"
  frameborder="0"
  style="border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
</iframe>
```

### Option 2: Direct Link
```html
<a href="https://your-app-url.com" target="_blank">
  View Workout Generator →
</a>
```

### Option 3: Embed in React Portfolio
```jsx
<div className="portfolio-item">
  <h3>Workout Generator</h3>
  <iframe src="https://your-app-url.com" />
</div>
```

## Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:3000
# or in production:
VITE_API_URL=https://your-backend.railway.app
```

### Server (.env)
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=3000
NODE_ENV=production
```

## Post-Deployment

1. Test all API endpoints
2. Verify database connection
3. Check CORS settings
4. Test responsive design
5. Verify iframe embedding works

## Troubleshooting

### CORS Issues
Add to server/src/index.ts:
```typescript
app.use(cors({
  origin: ['https://your-frontend-url.com'],
  credentials: true
}));
```

### Database Connection Issues
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Ensure database is seeded
- Check network/firewall settings

### Build Failures
- Ensure all dependencies are installed
- Check Node version compatibility
- Verify TypeScript compilation
- Check for syntax errors

