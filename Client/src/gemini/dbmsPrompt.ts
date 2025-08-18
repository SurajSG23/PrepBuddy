const dbmsPrompt = 
  `Generate exactly 10 multiple-choice Database Management Systems (DBMS) questions covering core database concepts.

Topics to cover:
- Relational Model (tables, keys, relationships, normalization)
- SQL Queries (SELECT, INSERT, UPDATE, DELETE, JOINs)
- Database Design (ER diagrams, functional dependencies)
- Normalization (1NF, 2NF, 3NF, BCNF)
- Transactions (ACID properties, concurrency control)
- Indexing and Query Optimization
- NoSQL Databases (MongoDB, document stores)
- Database Security and Integrity Constraints

🧠 Your task:
- Generate 10 distinct multiple-choice questions covering various DBMS topics above.
- Each question must have exactly 4 plausible answer options.
- Select one correct answer **from those 4 options**.
- Also provide a short explanation for each answer.
- Questions should be at interview/exam level difficulty.

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

export default dbmsPrompt;
