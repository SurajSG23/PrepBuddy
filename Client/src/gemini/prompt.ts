const geminiPrompt = 
`Gemini, generate **exactly 10 multiple-choice aptitude questions** for the topic: "\${topic}".  
The difficulty level should be: "\${difficulty}".

---

### ⚠️ Strict Format Instructions (Must Follow Exactly):

1. Each question must have exactly 4 distinct and meaningful options.
2. ❌ Do NOT include any options like "All of the above", "None of the above", or other catch-all responses.
3. ❌ Do NOT prefix any options with A), B), C), D), 1., 2., etc.
4. ❌ Do NOT use A/B/C/D or option numbers in the 'answers' section.  
   ✅ Only use the exact full text of the correct option.
5. ✅ Each answer must be one of the 4 options provided — no external or made-up answers.
6. ✅ Explanations must be clear, concise, and accurate — one per question.
7. ❌ Do NOT include duplicate questions, options, or answers.
8. ✅ Maintain diversity of subtopics within the given topic (e.g., for "Data Structures", include Stack, Queue, Trees, etc.).
9. ✅ Use academically appropriate language. Questions should be unambiguous and relevant to real-world aptitude tests.
10. ❌ Do NOT include any extra instructions, comments, or output formatting.

---

### 📦 Output Format (Strict Block — Return Only This):

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
Correct answer for Q1 ***
Correct answer for Q2 ***
...
<answers>

<explanation>
Explanation for Q1 ***
Explanation for Q2 ***
...
<explanation>
}
`;

export default geminiPrompt;
