const technicalPrompt = 
  `Generate exactly 10 multiple-choice technical interview questions covering various computer science topics.

Topics to include (mix them randomly):
- Data Structures & Algorithms
- Operating Systems
- Computer Networks
- Database Management Systems
- Computer Architecture
- Java Programming
- C++ Programming
- JavaScript
- HTML/CSS
- Python Programming
- C Programming

🧠 Your task:
- Generate 10 distinct multiple-choice questions from different topics above.
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
6. ❌ Do NOT include "All of the above" or "None of the above" as any option.
7. ✅ All answers must be chosen from the given 4 options per question.

📌 Output format:
{
<questions>
Question 1 ***
Question 2 ***
...
</questions>

<options>
Option1@*@Option2@*@Option3@*@Option4 ***
Option1@*@Option2@*@Option3@*@Option4 ***
...
</options>

<answers>
Correct Answer 1 ***
Correct Answer 2 ***
...
</answers>

<explanations>
Brief explanation for Q1 ***
Brief explanation for Q2 ***
...
</explanations>
}

⚠️ Important: Return only the formatted output — no extra commentary, no markdown, no bullet points. Stick exactly to the structure.`;

export default technicalPrompt;
