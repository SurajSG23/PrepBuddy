import express from 'express';
import { AIService } from '../utils/aiService.js';
import { ChatHelpers } from '../utils/chatHelpers.js';
import ChatSession from '../models/chatSessionModel.js';

const router = express.Router();

// POST /api/chat/send - Process user message
router.post('/send', async (req, res) => {
  try {
    const { message, mode, sessionId } = req.body;
    const userId = req.user.id; // From JWT middleware

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create session
    const session = await ChatHelpers.getOrCreateSession(userId, mode);
    
    // Get user context
    const userContext = await ChatHelpers.getUserContext(userId);
    
    // Get conversation context
    const context = await ChatHelpers.getSessionContext(session.sessionId);
    
    // Detect mode if not provided
    const detectedMode = mode || AIService.detectMode(message);
    
    // Generate AI response
    const aiResponse = await AIService.generateResponse(
      message,
      detectedMode,
      context,
      userContext
    );

    // Add user message to session
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
      metadata: {
        mode: detectedMode,
        confidence: 1,
        escalated: false
      }
    };

    await ChatHelpers.addMessageToSession(session.sessionId, userMessage);

    // Add AI response to session
    const assistantMessage = {
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date(),
      metadata: {
        mode: aiResponse.mode,
        confidence: aiResponse.confidence,
        escalated: aiResponse.shouldEscalate
      }
    };

    await ChatHelpers.addMessageToSession(session.sessionId, assistantMessage);

    // Handle escalation if needed
    if (aiResponse.shouldEscalate) {
      session.escalated = true;
      await session.save();
    }

    res.json({
      success: true,
      response: aiResponse.content,
      sessionId: session.sessionId,
      mode: aiResponse.mode,
      confidence: aiResponse.confidence,
      escalated: aiResponse.shouldEscalate,
      messageId: assistantMessage._id
    });

  } catch (error) {
    console.error('Chat send error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: error.message 
    });
  }
});

// GET /api/chat/history/:userId - Retrieve chat history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    // Verify user can access this history
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to chat history' });
    }

    const history = await ChatHelpers.getChatHistory(userId, parseInt(limit));
    
    res.json({
      success: true,
      history
    });

  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve chat history',
      details: error.message 
    });
  }
});

// POST /api/chat/escalate - Forward to human mentor
router.post('/escalate', async (req, res) => {
  try {
    const { sessionId, reason } = req.body;
    const userId = req.user.id;

    const session = await ChatSession.findOne({ sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Mark session as escalated
    session.escalated = true;
    session.mode = 'mentor';
    await session.save();

    // Generate escalation message
    const escalationMessage = await AIService.escalateToMentor(
      reason || 'User requested mentor assistance',
      await ChatHelpers.getSessionContext(sessionId),
      await ChatHelpers.getUserContext(userId)
    );

    // Add escalation message to session
    const mentorMessage = {
      role: 'assistant',
      content: escalationMessage,
      timestamp: new Date(),
      metadata: {
        mode: 'mentor',
        confidence: 1,
        escalated: true
      }
    };

    await ChatHelpers.addMessageToSession(sessionId, mentorMessage);

    res.json({
      success: true,
      message: 'Request escalated to mentor',
      response: escalationMessage
    });

  } catch (error) {
    console.error('Escalation error:', error);
    res.status(500).json({ 
      error: 'Failed to escalate request',
      details: error.message 
    });
  }
});

// GET /api/chat/context/:sessionId - Maintain conversation context
router.get('/context/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await ChatSession.findOne({ sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const context = await ChatHelpers.getSessionContext(sessionId);
    const userContext = await ChatHelpers.getUserContext(userId);

    res.json({
      success: true,
      context,
      userContext,
      session: {
        sessionId: session.sessionId,
        mode: session.mode,
        isActive: session.isActive,
        escalated: session.escalated,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity
      }
    });

  } catch (error) {
    console.error('Context error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve context',
      details: error.message 
    });
  }
});

// POST /api/chat/session/close - Close active session
router.post('/session/close', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    const session = await ChatSession.findOne({ sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await ChatHelpers.closeSession(sessionId);

    res.json({
      success: true,
      message: 'Session closed successfully'
    });

  } catch (error) {
    console.error('Close session error:', error);
    res.status(500).json({ 
      error: 'Failed to close session',
      details: error.message 
    });
  }
});

// GET /api/chat/sessions/active - Get user's active sessions
router.get('/sessions/active', async (req, res) => {
  try {
    const userId = req.user.id;

    const activeSessions = await ChatSession.find({
      userId,
      isActive: true
    }).sort({ lastActivity: -1 });

    res.json({
      success: true,
      sessions: activeSessions.map(session => ({
        sessionId: session.sessionId,
        mode: session.mode,
        messageCount: session.messages.length,
        lastActivity: session.lastActivity,
        escalated: session.escalated
      }))
    });

  } catch (error) {
    console.error('Active sessions error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve active sessions',
      details: error.message 
    });
  }
});

// POST /api/chat/mode/switch - Switch chat mode
router.post('/mode/switch', async (req, res) => {
  try {
    const { sessionId, mode } = req.body;
    const userId = req.user.id;

    if (!['faq', 'study', 'mentor'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    const session = await ChatSession.findOne({ sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.mode = mode;
    await session.save();

    const modeMessages = {
      faq: "I'm now in FAQ mode. I can help you with platform navigation, account questions, and general usage.",
      study: "I'm now in Study mode. I can help explain programming concepts, solve practice problems, and provide educational guidance.",
      mentor: "I'm now in Mentor mode. I can handle complex technical questions and provide in-depth guidance."
    };

    res.json({
      success: true,
      mode,
      message: modeMessages[mode]
    });

  } catch (error) {
    console.error('Mode switch error:', error);
    res.status(500).json({ 
      error: 'Failed to switch mode',
      details: error.message 
    });
  }
});

export default router;
