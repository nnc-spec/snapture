# Deployment Guide - Snapture

This guide covers deploying Snapture to various platforms.

## Quick Deploy Options

### 1. Replit (Recommended for Development)
- Fork the repository on Replit
- Set environment variables in Replit Secrets
- Database automatically provisioned
- One-click deployment

### 2. Vercel + Neon
- Connect GitHub repository to Vercel
- Provision PostgreSQL with Neon
- Set environment variables in Vercel dashboard
- Automatic deployments on push

### 3. Railway
- Connect GitHub repository
- Add PostgreSQL plugin
- Configure environment variables
- Deploy with zero configuration

## Production Deployment

### Environment Variables Required
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
OPENAI_API_KEY=sk-...
OPENROUTER_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
NODE_ENV=production
```

### Database Setup
1. Create PostgreSQL database
2. Run schema migration:
   ```bash
   npm run db:push
   ```

### Build Process
```bash
npm install
npm run build
npm start
```

### Health Checks
- Endpoint: `GET /api/health`
- Database: Verify connection to PostgreSQL
- AI Services: Test OpenRouter API
- Payments: Verify Stripe webhook

### Security Checklist
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Database connections encrypted
- [ ] API keys rotated regularly
- [ ] Stripe webhook signatures verified

## Mobile App Deployment

### iOS App Store
1. Complete Apple Developer Program enrollment
2. Configure app signing certificates
3. Update `mobile-app/eas.json` with credentials
4. Build: `eas build --platform ios --profile production`
5. Submit: `eas submit --platform ios --profile production`

### Testing
- TestFlight for iOS beta testing
- Internal testing with development builds

## Monitoring and Maintenance

### Performance Monitoring
- Image generation response times
- Database query performance
- Payment processing success rates

### Error Tracking
- API endpoint error rates
- Image generation failures
- Payment processing issues

### Backup Strategy
- Daily database backups
- Environment configuration backups
- Code repository backups

## Scaling Considerations

### Database
- Connection pooling for high traffic
- Read replicas for heavy queries
- Indexing optimization

### API Rate Limits
- OpenRouter API quotas
- Pollinations.ai limits
- Stripe API limits

### Caching
- Image URL caching
- Generated memory caching
- Static asset optimization