import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mode-specific system prompts
const SYSTEM_PROMPTS = {
  faq: `You are PrepBuddy's helpful assistant. You help users with platform navigation, account questions, and general usage. 
  Be friendly, concise, and helpful. If you don't know something specific about PrepBuddy, suggest they contact support.`,
  
  study: `You are PrepBuddy's study assistant. You help explain programming concepts, solve practice problems, and provide educational guidance.
  Focus on:
  - Clear, step-by-step explanations
  - Code examples when relevant
  - Best practices and common pitfalls
  - Encouraging learning and practice
  If a question is too complex or you're not confident, suggest escalating to a mentor.`,
  
  mentor: `You are PrepBuddy's mentor assistant. You handle complex technical questions and provide in-depth guidance.
  You can:
  - Explain advanced concepts
  - Provide detailed problem-solving approaches
  - Give career and interview advice
  - Suggest learning resources
  If you cannot help effectively, escalate to human support.`
};

// Context management
const MAX_CONTEXT_MESSAGES = parseInt(process.env.MAX_CONTEXT_MESSAGES) || 10;

export class AIService {
  static async generateResponse(userMessage, mode = 'faq', context = [], userContext = {}) {
    try {
      const systemPrompt = SYSTEM_PROMPTS[mode];
      
      // Build conversation history
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.buildContextMessages(context, mode, userContext),
        { role: 'user', content: userMessage }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0].message.content;
      
      // Analyze confidence and determine if escalation is needed
      const confidence = this.analyzeConfidence(userMessage, response, mode);
      
      return {
        content: response,
        confidence,
        shouldEscalate: confidence < 0.6 && mode !== 'mentor',
        mode
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        content: "I'm having trouble processing your request right now. Please try again or contact support if the issue persists.",
        confidence: 0,
        shouldEscalate: false,
        mode
      };
    }
  }

  static buildContextMessages(context, mode, userContext) {
    const messages = [];
    
    // Add user context if available
    if (userContext.currentTopic) {
      messages.push({
        role: 'system',
        content: `Current topic: ${userContext.currentTopic}`
      });
    }
    
    if (userContext.difficulty) {
      messages.push({
        role: 'system',
        content: `Difficulty level: ${userContext.difficulty}`
      });
    }

    // Add recent conversation context
    const recentMessages = context.slice(-MAX_CONTEXT_MESSAGES);
    messages.push(...recentMessages);

    return messages;
  }

  static analyzeConfidence(userMessage, response, mode) {
    // Simple confidence analysis based on response characteristics
    let confidence = 0.8; // Base confidence
    
    // Lower confidence for certain patterns
    if (response.toLowerCase().includes("i'm not sure") || 
        response.toLowerCase().includes("i don't know") ||
        response.toLowerCase().includes("contact support")) {
      confidence -= 0.3;
    }
    
    // Higher confidence for specific, detailed responses
    if (response.length > 100 && mode === 'study') {
      confidence += 0.1;
    }
    
    // Lower confidence for very short responses to complex questions
    if (userMessage.length > 50 && response.length < 50) {
      confidence -= 0.2;
    }
    
    return Math.max(0, Math.min(1, confidence));
  }

  static detectMode(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Study mode indicators
    if (lowerMessage.includes('explain') || 
        lowerMessage.includes('how to') ||
        lowerMessage.includes('problem') ||
        lowerMessage.includes('code') ||
        lowerMessage.includes('algorithm') ||
        lowerMessage.includes('concept') ||
        lowerMessage.includes('practice')) {
      return 'study';
    }
    
    // Mentor mode indicators
    if (lowerMessage.includes('complex') ||
        lowerMessage.includes('advanced') ||
        lowerMessage.includes('career') ||
        lowerMessage.includes('interview') ||
        lowerMessage.includes('mentor') ||
        lowerMessage.includes('human')) {
      return 'mentor';
    }
    
    // Default to FAQ mode
    return 'faq';
  }

  static async escalateToMentor(userMessage, context, userContext) {
    try {
      const escalationPrompt = `A user needs mentor assistance. Please provide a professional response indicating that their request has been escalated to a human mentor who will respond shortly. Be encouraging and assure them their question is important.

User's question: ${userMessage}

Context: ${JSON.stringify(userContext)}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: escalationPrompt }
        ],
        max_tokens: 200,
        temperature: 0.5
      });

      return completion.choices[0].message.content;
    } catch (error) {
      return "Your question has been escalated to a human mentor. They will respond to you shortly. Thank you for your patience!";
    }
  }
}
