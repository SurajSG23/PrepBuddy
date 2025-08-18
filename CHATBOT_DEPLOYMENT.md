# Chatbot Deployment Guide

This guide provides step-by-step instructions for deploying the AI-powered chatbot feature to production.

## 🚀 Pre-Deployment Checklist

### 1. Environment Setup

Create a `.env` file in the `Server` directory with the following variables:

```env
# Required for Chatbot
OPENAI_API_KEY=your_openai_api_key_here
CHAT_SESSION_TIMEOUT=3600000
MAX_CONTEXT_MESSAGES=10

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Server
PORT=3000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://your-domain.com
```

### 2. OpenAI API Setup

1. **Get API Key**: Sign up at [OpenAI Platform](https://platform.openai.com/)
2. **Add Credits**: Ensure your account has sufficient credits
3. **Set Usage Limits**: Configure usage limits to control costs
4. **Test API**: Verify the API key works with a test request

### 3. Database Preparation

1. **MongoDB Atlas Setup** (Recommended):
   - Create a MongoDB Atlas cluster
   - Set up database user with read/write permissions
   - Configure network access (IP whitelist)
   - Get connection string

2. **Local MongoDB** (Development):
   - Install MongoDB locally
   - Create database and user
   - Configure authentication

### 4. Dependencies Installation

**Server:**
```bash
cd Server
npm install
npm install openai uuid
```

**Client:**
```bash
cd Client
npm install
npm install date-fns
```

## 🏗️ Deployment Options

### Option 1: Vercel Deployment (Recommended)

#### Backend Deployment

1. **Create Vercel Project**:
   ```bash
   cd Server
   vercel init
   ```

2. **Configure vercel.json**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "app.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/app.js"
       }
     ]
   }
   ```

3. **Set Environment Variables**:
   - Go to Vercel Dashboard
   - Navigate to your project
   - Add all environment variables from `.env`

4. **Deploy**:
   ```bash
   vercel --prod
   ```

#### Frontend Deployment

1. **Build the Project**:
   ```bash
   cd Client
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

3. **Update API Base URL**:
   - Set `VITE_API_BASE_URL` in environment variables
   - Point to your backend Vercel URL

### Option 2: Heroku Deployment

#### Backend Deployment

1. **Create Heroku App**:
   ```bash
   cd Server
   heroku create your-app-name
   ```

2. **Set Environment Variables**:
   ```bash
   heroku config:set OPENAI_API_KEY=your_key
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy chatbot backend"
   git push heroku main
   ```

#### Frontend Deployment

1. **Build and Deploy**:
   ```bash
   cd Client
   npm run build
   # Deploy build folder to your preferred hosting
   ```

### Option 3: Docker Deployment

#### Create Dockerfile for Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### Create Dockerfile for Frontend

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Deploy with Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./Server
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production

  frontend:
    build: ./Client
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🔧 Production Configuration

### 1. Security Hardening

#### CORS Configuration
```javascript
// In Server/app.js
app.use(cors({
  origin: ['https://your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Rate Limiting
```javascript
// Add to Server/app.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/chat', limiter);
```

#### Helmet Security
```javascript
// Add to Server/app.js
import helmet from 'helmet';

app.use(helmet());
```

### 2. Performance Optimization

#### Database Indexing
```javascript
// In Server/models/chatSessionModel.js
chatSessionSchema.index({ userId: 1, isActive: 1 });
chatSessionSchema.index({ sessionId: 1 });
chatSessionSchema.index({ lastActivity: 1 });
```

#### Caching (Optional)
```javascript
// Add Redis caching for sessions
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache session data
static async getSessionWithCache(sessionId) {
  const cached = await redis.get(`session:${sessionId}`);
  if (cached) return JSON.parse(cached);
  
  const session = await ChatSession.findOne({ sessionId });
  if (session) {
    await redis.setex(`session:${sessionId}`, 3600, JSON.stringify(session));
  }
  return session;
}
```

### 3. Monitoring Setup

#### Error Logging
```javascript
// Add to Server/app.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

#### Health Check Endpoint
```javascript
// Add to Server/app.js
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 📊 Monitoring & Analytics

### 1. OpenAI API Monitoring

```javascript
// Add to Server/utils/aiService.js
static async trackAPICall(userId, tokens, cost) {
  // Log API usage for monitoring
  console.log(`API Call - User: ${userId}, Tokens: ${tokens}, Cost: $${cost}`);
}
```

### 2. Chat Analytics

```javascript
// Add to Server/utils/chatHelpers.js
static async trackChatMetrics(sessionId, action, metadata) {
  // Track chat usage patterns
  const metrics = {
    sessionId,
    action,
    metadata,
    timestamp: new Date()
  };
  
  // Store in analytics collection
  await Analytics.create(metrics);
}
```

## 🔍 Testing

### 1. API Testing

```bash
# Test chat endpoints
curl -X POST https://your-api.com/chat/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "Hello", "mode": "faq"}'
```

### 2. Load Testing

```bash
# Install artillery
npm install -g artillery

# Create load test
artillery quick --count 100 --num 10 https://your-api.com/chat/send
```

### 3. End-to-End Testing

```javascript
// Test complete chat flow
describe('Chat Flow', () => {
  test('should handle complete conversation', async () => {
    // Test user login
    // Test chat initiation
    // Test message sending
    // Test AI response
    // Test session persistence
  });
});
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check CORS configuration
   - Verify frontend URL is in allowed origins

2. **OpenAI API Errors**:
   - Verify API key is correct
   - Check account has sufficient credits
   - Monitor rate limits

3. **Database Connection Issues**:
   - Verify MongoDB connection string
   - Check network access
   - Ensure database user has proper permissions

4. **Session Persistence Issues**:
   - Check session timeout settings
   - Verify session cleanup is working
   - Monitor database indexes

### Debug Commands

```bash
# Check server logs
heroku logs --tail

# Check environment variables
heroku config

# Test database connection
heroku run node -e "require('./config/db.js').connectDB()"

# Monitor API usage
heroku run node -e "console.log(process.env.OPENAI_API_KEY ? 'API Key Set' : 'API Key Missing')"
```

## 📈 Scaling Considerations

### 1. Horizontal Scaling

- Use load balancer for multiple server instances
- Implement session sharing with Redis
- Use MongoDB replica sets for database scaling

### 2. Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement connection pooling

### 3. Cost Optimization

- Monitor OpenAI API usage
- Implement usage quotas per user
- Use caching to reduce API calls
- Consider alternative AI providers for cost-sensitive deployments

## 🔄 Maintenance

### Regular Tasks

1. **Database Maintenance**:
   - Clean up old sessions
   - Optimize indexes
   - Monitor storage usage

2. **API Monitoring**:
   - Track OpenAI usage and costs
   - Monitor response times
   - Check error rates

3. **Security Updates**:
   - Update dependencies regularly
   - Rotate API keys
   - Review access logs

### Backup Strategy

1. **Database Backups**:
   - Set up automated MongoDB backups
   - Test restore procedures
   - Store backups securely

2. **Configuration Backups**:
   - Backup environment variables
   - Document configuration changes
   - Version control configuration files

---

**Note**: Always test thoroughly in a staging environment before deploying to production. Monitor the system closely after deployment and be prepared to rollback if issues arise.
