const geminiPrompt = 
  "Gemini, generate exactly 10 multiple-choice aptitude questions for the topic ${topic}. The difficulty level is ${difficulty}.\n\n" +
  "⚠️ Strict Format Instructions:\n" +
  "- Each question must have exactly 4 options.\n" +
  "- Do NOT include options like 'All of the above' or 'None of the above'.\n" +
  "- ❌ Do NOT prefix any option with A), B), C), D), or similar.\n" +
  "- ❌ Do NOT use A/B/C/D in the <answers> section. Use full answer text only.\n" +
  "- ✅ The answer to each question must be **one of the 4 options provided** for that question — no extra or made-up answers.\n" +
  "- Enclose all questions in <questions>...</questions>, and separate them using ***.\n" +
  "- Enclose all options in <options>...</options>, and separate each set of 4 options using ***.\n" +
  "- Within each set, separate the 4 options using **@*@** (no line breaks between them).\n" +
  "- Enclose all full-text answers in <answers>...</answers>, separated by ***.\n" +
  "- Enclose brief explanations in <explaination>...</explaination>, also separated by ***.\n\n" +
  "⚠️ Very Important: Follow the exact format. No extra text or formatting.\n\n" +
  "Example Format:\n" +
  "{\n" +
  "<questions>\n" +
  "What is the time complexity of binary search? ***\n" +
  "Which data structure uses LIFO (Last In First Out)? ***\n" +
  "...\n" +
  "<questions>\n\n" +
  "<options>\n" +
  "O(1)@*@O(log n)@*@O(n)@*@O(n log n) ***\n" +
  "Queue@*@Stack@*@Linked List@*@Tree ***\n" +
  "...\n" +
  "<options>\n\n" +
  "<answers>\n" +
  "O(log n) ***\n" +
  "Stack ***\n" +
  "...\n" +
  "<answers>\n\n" +
  "<explaination>\n" +
  "Binary search cuts the array in half... ***\n" +
  "Stack uses LIFO... ***\n" +
  "...\n" +
  "<explaination>\n" +
  "}\n";

export default geminiPrompt;
