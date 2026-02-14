# Yoga Master

Learn yoga from expert instructors. Full-stack yoga class platform with React frontend and Express backend.

## Project Structure

- `client/` - React + Vite frontend
- `server/` - Express + MongoDB backend

## Run Locally

```bash
# Install dependencies
npm run install:all

# Run client (dev server)
npm run client

# Run server (in another terminal)
npm run server
```

Client: http://localhost:5173  
Server: http://localhost:5000

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Root directory: leave as default (vercel.json configures build)
4. Add env vars in Vercel dashboard if needed:
   - `VITE_API_URL` - Backend API URL (for production)
   - `VITE_FIREBASE_*` - Firebase config for auth
   - `VITE_STRIPE_PK` - Stripe publishable key

5. Deploy - Vercel will build the client automatically

## Environment

- `client/.env.example` - Frontend env template
- `server/.env.example` - Backend env template
