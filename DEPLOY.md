# Pet Tag Deployment (Render Blueprint)

## Local Development

```bash
# Install dependencies
cd backend && npm install
cd ../web && npm install

# Start backend
cd backend && npm run dev

# Start web (in another terminal)
cd web && npm run dev
```

## Deploy to Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → New → Blueprint
3. Connect your repo containing `render.yaml`
4. Click Deploy Blueprint

This will create:
- `pawtag-db` - PostgreSQL database
- `pawtag-backend` - API server
- `pawtag-web` - Frontend

## Environment Variables

On first deploy, you'll need to set:
- `SESSION_SECRET` - A secure random string (can be generated with `openssl rand -base64 32`)

## Important Notes

- Backend binds to `0.0.0.0:10000` (Render's default port)
- CORS allows `http://localhost:5173` - update `backend/src/index.ts` for production domains if needed
- Health check: `https://your-backend.onrender.com/api/health`