import { v4 as uuidv4 } from 'uuid';
import ChatSession from '../models/chatSessionModel.js';

export class ChatHelpers {
  static generateSessionId() {
    return `session_${uuidv4()}`;
  }

  static async getOrCreateSession(userId, mode = 'faq') {
    try {
      // Check for existing active session
      let session = await ChatSession.findOne({
        userId,
        isActive: true
      });

      if (!session) {
        // Create new session
        session = new ChatSession({
          userId,
          sessionId: this.generateSessionId(),
          mode,
          messages: []
        });
        await session.save();
      } else {
        // Update mode if different
        if (session.mode !== mode) {
          session.mode = mode;
          await session.save();
        }
      }

      return session;
    } catch (error) {
      console.error('Error getting/creating session:', error);
      throw error;
    }
  }

  static async addMessageToSession(sessionId, message) {
    try {
      const session = await ChatSession.findOne({ sessionId });
      if (!session) {
        throw new Error('Session not found');
      }

      session.messages.push(message);
      await session.save();
      return session;
    } catch (error) {
      console.error('Error adding message to session:', error);
      throw error;
    }
  }

  static async getSessionContext(sessionId) {
    try {
      const session = await ChatSession.findOne({ sessionId });
      if (!session) {
        return [];
      }

      // Return recent messages for context
      return session.messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    } catch (error) {
      console.error('Error getting session context:', error);
      return [];
    }
  }

  static async getUserContext(userId) {
    try {
      // Get user's recent activity and preferences
      const recentSessions = await ChatSession.find({
        userId,
        isActive: false
      })
      .sort({ lastActivity: -1 })
      .limit(5);

      const context = {
        recentTopics: [],
        preferredMode: 'faq',
        activityLevel: 'low'
      };

      if (recentSessions.length > 0) {
        // Analyze recent topics
        const topics = recentSessions
          .flatMap(session => session.messages)
          .filter(msg => msg.role === 'user')
          .map(msg => this.extractTopics(msg.content))
          .flat();

        context.recentTopics = [...new Set(topics)].slice(0, 5);
        
        // Determine preferred mode
        const modeCounts = {};
        recentSessions.forEach(session => {
          modeCounts[session.mode] = (modeCounts[session.mode] || 0) + 1;
        });
        
        context.preferredMode = Object.keys(modeCounts).reduce((a, b) => 
          modeCounts[a] > modeCounts[b] ? a : b
        );

        // Activity level
        const recentActivity = recentSessions.filter(session => 
          new Date() - session.lastActivity < 24 * 60 * 60 * 1000 // Last 24 hours
        ).length;
        
        if (recentActivity > 3) context.activityLevel = 'high';
        else if (recentActivity > 1) context.activityLevel = 'medium';
      }

      return context;
    } catch (error) {
      console.error('Error getting user context:', error);
      return {
        recentTopics: [],
        preferredMode: 'faq',
        activityLevel: 'low'
      };
    }
  }

  static extractTopics(message) {
    const topics = [];
    const lowerMessage = message.toLowerCase();
    
    // Programming languages
    const languages = ['javascript', 'python', 'java', 'cpp', 'c++', 'c#', 'php', 'ruby', 'go', 'rust'];
    languages.forEach(lang => {
      if (lowerMessage.includes(lang)) topics.push(lang);
    });

    // CS topics
    const csTopics = ['algorithm', 'data structure', 'database', 'operating system', 'networking', 'machine learning'];
    csTopics.forEach(topic => {
      if (lowerMessage.includes(topic)) topics.push(topic);
    });

    // PrepBuddy specific topics
    const prepTopics = ['test', 'practice', 'score', 'badge', 'leaderboard', 'interview'];
    prepTopics.forEach(topic => {
      if (lowerMessage.includes(topic)) topics.push(topic);
    });

    return topics;
  }

  static async closeSession(sessionId) {
    try {
      await ChatSession.findOneAndUpdate(
        { sessionId },
        { isActive: false }
      );
    } catch (error) {
      console.error('Error closing session:', error);
    }
  }

  static async cleanupOldSessions() {
    try {
      const timeout = parseInt(process.env.CHAT_SESSION_TIMEOUT) || 3600000; // 1 hour default
      const cutoffTime = new Date(Date.now() - timeout);
      
      await ChatSession.updateMany(
        { 
          lastActivity: { $lt: cutoffTime },
          isActive: true 
        },
        { isActive: false }
      );
    } catch (error) {
      console.error('Error cleaning up old sessions:', error);
    }
  }

  static formatMessageForDisplay(message) {
    return {
      id: message._id || Date.now(),
      text: message.content,
      sender: message.role === 'user' ? 'user' : 'bot',
      timestamp: message.timestamp,
      metadata: message.metadata || {}
    };
  }

  static async getChatHistory(userId, limit = 50) {
    try {
      const sessions = await ChatSession.find({ userId })
        .sort({ lastActivity: -1 })
        .limit(limit)
        .populate('userId', 'name email');

      return sessions.map(session => ({
        sessionId: session.sessionId,
        mode: session.mode,
        messages: session.messages.map(msg => this.formatMessageForDisplay(msg)),
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        isActive: session.isActive,
        escalated: session.escalated
      }));
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }
}
