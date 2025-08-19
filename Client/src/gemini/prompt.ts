const geminiPrompt = 
<<<<<<< HEAD
  `Gemini, generate exactly 10 multiple-choice aptitude questions for the topic: **\${topic}**.
The difficulty level is: **\${difficulty}**.

🧠 Your task:
- Generate 10 distinct multiple-choice questions.
- Each question must have exactly 4 plausible answer options.
- Select one correct answer **from those 4 options**.
- Also provide a short explanation for each answer.

⚠️ Strict Format Instructions (follow **exactly**):

1. Enclose all questions within: <questions>...</questions>
   - Separate each question using three asterisks: ***

2. Enclose all options within: <options>...</options>
   - Each group of 4 options is separated by ***.
   - Within each group, separate the 4 options using: **@*@** (no line breaks)

3. Enclose all full-text correct answers within: <answers>...</answers>
   - Each answer separated by *** (no bullet points or prefixes)

4. Enclose short 1-line explanations within: <explanations>...</explanations>
   - Each explanation separated by ***

5. ❌ Do NOT use A), B), C), D) or any labels in options or answers.
6. ❌ Do NOT include “All of the above” or “None of the above” as any option.
7. ✅ All answers must be chosen from the given 4 options per question.

📌 Output format:
{
<questions>
Question 1 ***
Question 2 ***
...
<questions>

<options>
Option1@*@Option2@*@Option3@*@Option4 ***
Option1@*@Option2@*@Option3@*@Option4 ***
...
<options>

<answers>
Correct Answer 1 ***
Correct Answer 2 ***
...
<answers>

<explanations>
Brief explanation for Q1 ***
Brief explanation for Q2 ***
...
<explanations>
}

⚠️ Important: Return only the formatted output — no extra commentary, no markdown, no bullet points. Stick exactly to the structure.`;

export default geminiPrompt;
=======
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
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e
