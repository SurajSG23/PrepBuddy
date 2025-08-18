# AI-Powered Chatbot for PrepBuddy

A comprehensive AI-powered chatbot system integrated into the PrepBuddy learning platform, providing instant help with practice problems, platform usage, and study concepts.

## 🚀 Features

### Core Functionality
- **Floating Chat Widget**: Bottom-right positioned chat interface with minimize/expand functionality
- **Multiple Chat Modes**: 
  - **FAQ Mode**: Platform navigation, account help, general questions
  - **Study Mode**: Programming concepts, problem explanations, learning guidance
  - **Mentor Mode**: Advanced guidance, career advice, complex problem solving
- **User-linked History**: All conversations saved per user account in MongoDB
- **Context Awareness**: Maintains conversation context for follow-up questions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Real-time Features
- **Typing Indicators**: Visual feedback when AI is processing
- **Message Timestamps**: Track conversation timing
- **Confidence Indicators**: AI confidence levels for responses
- **Escalation System**: Automatic escalation to human mentors when needed

### Advanced Features
- **Smart Mode Detection**: Automatically detects user intent and switches modes
- **Quick Prompts**: Suggested questions for each mode
- **Chat History**: Browse and search past conversations
- **Session Management**: Active session tracking and cleanup
- **Analytics Ready**: Built-in tracking for unanswered queries

## 🏗️ Architecture

### Backend Components
```
Server/
├── models/
│   └── chatSessionModel.js     # MongoDB schema for chat sessions
├── routes/
│   └── chatRouter.js           # API endpoints for chat functionality
├── utils/
│   ├── aiService.js            # OpenAI integration and AI logic
│   └── chatHelpers.js          # Session management and utilities
└── app.js                      # Main server with chat routes
```

### Frontend Components
```
Client/src/components/Chat/
├── ChatWidget.tsx              # Main chat interface
├── MessageList.tsx             # Chat history display
├── MessageInput.tsx            # User input handling
├── ModeSelector.tsx            # FAQ/Study/Mentor toggle
└── ChatHistory.tsx             # Past conversations viewer
```

## 🛠️ Setup Instructions

### 1. Environment Variables

Add the following to your `.env` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Chat Session Configuration
CHAT_SESSION_TIMEOUT=3600000
MAX_CONTEXT_MESSAGES=10
```

### 2. Install Dependencies

**Server Dependencies:**
```bash
cd Server
npm install openai uuid
```

**Client Dependencies:**
```bash
cd Client
npm install date-fns
```

### 3. Database Setup

The chatbot automatically creates the necessary MongoDB collections. Ensure your MongoDB connection is properly configured in `Server/config/db.js`.

### 4. API Endpoints

The chatbot adds the following API endpoints:

- `POST /api/chat/send` - Process user message
- `GET /api/chat/history/:userId` - Retrieve chat history
- `POST /api/chat/escalate` - Forward to human mentor
- `GET /api/chat/context/:sessionId` - Maintain conversation context
- `POST /api/chat/session/close` - Close active session
- `GET /api/chat/sessions/active` - Get user's active sessions
- `POST /api/chat/mode/switch` - Switch chat mode

## 🎯 Usage Guide

### For Users

1. **Starting a Chat**: Click the chat bubble in the bottom-right corner
2. **Selecting Mode**: Use the settings icon to switch between FAQ, Study, and Mentor modes
3. **Quick Prompts**: Click suggested questions to get started quickly
4. **Escalation**: Use the mentor icon to escalate complex questions
5. **History**: Click the clock icon to view past conversations

### For Developers

#### Adding New Chat Modes

1. Update the `SYSTEM_PROMPTS` in `aiService.js`
2. Add mode detection logic in `detectMode()` function
3. Update the `ModeSelector` component with new mode options
4. Add mode-specific styling and icons

#### Customizing AI Responses

Modify the system prompts in `Server/utils/aiService.js`:

```javascript
const SYSTEM_PROMPTS = {
  faq: `Your custom FAQ prompt here...`,
  study: `Your custom study prompt here...`,
  mentor: `Your custom mentor prompt here...`
};
```

#### Adding New Features

1. **New Message Types**: Extend the Message interface in TypeScript
2. **Additional Metadata**: Add fields to the message schema in MongoDB
3. **Custom UI Components**: Create new React components in the Chat directory

## 🔧 Configuration Options

### AI Model Configuration

In `Server/utils/aiService.js`:

```javascript
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',        // Change model here
  max_tokens: 500,               // Adjust response length
  temperature: 0.7,              // Adjust creativity (0-1)
  presence_penalty: 0.1,         // Reduce repetition
  frequency_penalty: 0.1         // Reduce repetition
});
```

### Session Management

In `Server/utils/chatHelpers.js`:

```javascript
// Session timeout (default: 1 hour)
const timeout = parseInt(process.env.CHAT_SESSION_TIMEOUT) || 3600000;

// Maximum context messages (default: 10)
const MAX_CONTEXT_MESSAGES = parseInt(process.env.MAX_CONTEXT_MESSAGES) || 10;
```

## 📊 Analytics & Monitoring

### Built-in Metrics

The system tracks:
- Message count per session
- Mode usage statistics
- Escalation frequency
- User engagement patterns
- Response confidence levels

### Adding Custom Analytics

Extend the `ChatHelpers` class to add custom tracking:

```javascript
static async trackUserEngagement(userId, action, metadata) {
  // Add your analytics logic here
  console.log(`User ${userId} performed ${action}`, metadata);
}
```

## 🔒 Security Considerations

### Authentication
- All chat endpoints require JWT authentication
- User sessions are isolated per user ID
- API rate limiting should be implemented

### Data Privacy
- Chat messages are stored in MongoDB with user association
- Consider implementing message encryption for sensitive data
- Implement data retention policies

### OpenAI API Security
- API keys are stored in environment variables
- Consider implementing API key rotation
- Monitor API usage and costs

## 🚀 Deployment

### Production Checklist

- [ ] Set up environment variables
- [ ] Configure MongoDB connection
- [ ] Set up OpenAI API key
- [ ] Test all chat modes
- [ ] Verify session cleanup
- [ ] Monitor API usage
- [ ] Set up error logging
- [ ] Configure CORS settings

### Performance Optimization

1. **Database Indexing**: Ensure proper indexes on chat collections
2. **Caching**: Implement Redis for session caching
3. **Rate Limiting**: Add API rate limiting for chat endpoints
4. **CDN**: Serve static assets through CDN

## 🐛 Troubleshooting

### Common Issues

1. **Chat not loading**: Check MongoDB connection and JWT authentication
2. **AI responses failing**: Verify OpenAI API key and quota
3. **Session persistence issues**: Check session timeout settings
4. **Mode switching not working**: Verify API endpoints and frontend state

### Debug Mode

Enable debug logging by setting:

```javascript
// In aiService.js
console.log('AI Response:', response);
console.log('Confidence:', confidence);
```

## 📝 API Documentation

### Message Format

```javascript
{
  id: string,
  text: string,
  sender: 'user' | 'bot',
  timestamp: Date,
  metadata: {
    mode?: 'faq' | 'study' | 'mentor',
    confidence?: number,
    escalated?: boolean
  }
}
```

### Session Format

```javascript
{
  sessionId: string,
  userId: ObjectId,
  mode: 'faq' | 'study' | 'mentor',
  messages: Message[],
  isActive: boolean,
  escalated: boolean,
  createdAt: Date,
  lastActivity: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This chatbot feature is part of the PrepBuddy project and follows the same licensing terms.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Open an issue in the repository
4. Contact the development team

---

**Note**: This chatbot feature requires an active OpenAI API key and MongoDB database connection to function properly.
