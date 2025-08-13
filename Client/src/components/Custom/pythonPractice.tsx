import React, { ChangeEvent, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { FiPlay, FiRotateCw, FiBookmark, FiSearch } from "react-icons/fi";

type Level = "Beginner" | "Intermediate" | "Advanced";

interface Question {
  id: number;
  title: string;
  explanation: string;
  level: Level;
  tags?: string[];
  code: string;
  expectedOutput?: string;
  topic?: string;
}
const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Hello World",
    explanation: "Print 'Hello World' to the console.",
    level: "Beginner",
    tags: ["basics", "output"],
    code: `print("Hello World")`,
    expectedOutput: "Hello World",
    topic: "Basics",
  },
  {
    id: 2,
    title: "Sum of Two Numbers",
    explanation: "Read two integers and print their sum.",
    level: "Beginner",
    tags: ["input", "arithmetic"],
    code: `a = int(input())
b = int(input())
print(a + b)`,
    expectedOutput: "If input is 3 and 5 → Output: 8",
    topic: "Basics",
  },
  {
    id: 3,
    title: "Even or Odd",
    explanation: "Check if a number is even or odd.",
    level: "Beginner",
    tags: ["conditionals", "modulus"],
    code: `n = int(input())
if n % 2 == 0:
    print("Even")
else:
    print("Odd")`,
    expectedOutput: "If input is 4 → Output: Even",
    topic: "Conditionals",
  },
  {
    id: 4,
    title: "Factorial",
    explanation: "Find the factorial of a number.",
    level: "Beginner",
    tags: ["loops", "math"],
    code: `n = int(input())
fact = 1
for i in range(1, n+1):
    fact *= i
print(fact)`,
    expectedOutput: "If input is 5 → Output: 120",
    topic: "Loops",
  },
  {
    id: 5,
    title: "Reverse String",
    explanation: "Reverse a given string.",
    level: "Beginner",
    tags: ["string", "slicing"],
    code: `s = input()
print(s[::-1])`,
    expectedOutput: "If input is hello → Output: olleh",
    topic: "Strings",
  },
  {
    id: 6,
    title: "Palindrome Check",
    explanation: "Check if a given string is a palindrome.",
    level: "Beginner",
    tags: ["string", "conditionals"],
    code: `s = input()
if s == s[::-1]:
    print("Palindrome")
else:
    print("Not Palindrome")`,
    expectedOutput: "If input is madam → Output: Palindrome",
    topic: "Strings",
  },
  {
    id: 7,
    title: "Fibonacci Series",
    explanation: "Print the Fibonacci series up to N terms.",
    level: "Beginner",
    tags: ["loops", "math"],
    code: `n = int(input())
a, b = 0, 1
for _ in range(n):
    print(a, end=" ")
    a, b = b, a + b`,
    expectedOutput: "If input is 5 → Output: 0 1 1 2 3",
    topic: "Loops",
  },
  {
    id: 8,
    title: "Largest Number",
    explanation: "Find the largest of three numbers.",
    level: "Beginner",
    tags: ["conditionals"],
    code: `a = int(input())
b = int(input())
c = int(input())
print(max(a, b, c))`,
    expectedOutput: "If input is 3, 9, 7 → Output: 9",
    topic: "Conditionals",
  },
  {
    id: 9,
    title: "Count Vowels",
    explanation: "Count the number of vowels in a string.",
    level: "Beginner",
    tags: ["strings", "loops"],
    code: `s = input().lower()
count = 0
for ch in s:
    if ch in "aeiou":
        count += 1
print(count)`,
    expectedOutput: "If input is hello → Output: 2",
    topic: "Strings",
  },
  {
    id: 10,
    title: "Sum of List Elements",
    explanation: "Find the sum of all elements in a list.",
    level: "Beginner",
    tags: ["lists", "loops"],
    code: `nums = list(map(int, input().split()))
print(sum(nums))`,
    expectedOutput: "If input is 1 2 3 → Output: 6",
    topic: "Lists",
  },
  {
    id: 11,
    title: "List Sorting",
    explanation: "Sort a list of integers in ascending order.",
    level: "Beginner",
    tags: ["lists", "sorting"],
    code: `nums = list(map(int, input().split()))
nums.sort()
print(nums)`,
    expectedOutput: "If input is 3 1 2 → Output: [1, 2, 3]",
    topic: "Lists",
  },
  {
    id: 12,
    title: "Unique Elements",
    explanation: "Print the unique elements from a list.",
    level: "Beginner",
    tags: ["sets", "lists"],
    code: `nums = list(map(int, input().split()))
print(list(set(nums)))`,
    expectedOutput: "If input is 1 2 2 3 → Output: [1, 2, 3] (order may vary)",
    topic: "Sets",
  },
  {
    id: 13,
    title: "Dictionary Word Count",
    explanation: "Count word frequency in a given sentence.",
    level: "Beginner",
    tags: ["dict", "strings"],
    code: `sentence = input().split()
freq = {}
for word in sentence:
    freq[word] = freq.get(word, 0) + 1
print(freq)`,
    expectedOutput: `If input is "hi hi hello" → Output: {'hi': 2, 'hello': 1}`,
    topic: "Dictionaries",
  },
  {
    id: 14,
    title: "Check Prime",
    explanation: "Check if a number is prime.",
    level: "Beginner",
    tags: ["math", "loops"],
    code: `n = int(input())
if n > 1:
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            print("Not Prime")
            break
    else:
        print("Prime")
else:
    print("Not Prime")`,
    expectedOutput: "If input is 7 → Output: Prime",
    topic: "Math",
  },
  {
    id: 15,
    title: "List Comprehension",
    explanation: "Generate squares of numbers from 1 to N.",
    level: "Beginner",
    tags: ["lists", "comprehension"],
    code: `n = int(input())
squares = [i**2 for i in range(1, n+1)]
print(squares)`,
    expectedOutput: "If input is 5 → Output: [1, 4, 9, 16, 25]",
    topic: "Lists",
  },
  {
    id: 16,
    title: "Lambda Sort by Length",
    explanation: "Sort strings by their length.",
    level: "Intermediate",
    tags: ["lambda", "sorting"],
    code: `words = input().split()
words.sort(key=lambda x: len(x))
print(words)`,
    expectedOutput: "If input is apple bat a → Output: ['a', 'bat', 'apple']",
    topic: "Functions",
  },
  {
    id: 17,
    title: "Find Second Largest",
    explanation: "Find the second largest number in a list.",
    level: "Intermediate",
    tags: ["lists", "sorting"],
    code: `nums = list(map(int, input().split()))
nums = list(set(nums))
nums.sort()
print(nums[-2])`,
    expectedOutput: "If input is 3 1 4 4 2 → Output: 3",
    topic: "Lists",
  },
  {
    id: 18,
    title: "List Flattening",
    explanation: "Flatten a nested list using recursion.",
    level: "Intermediate",
    tags: ["recursion", "lists"],
    code: `def flatten(lst):
    result = []
    for i in lst:
        if isinstance(i, list):
            result.extend(flatten(i))
        else:
            result.append(i)
    return result

nested = [1, [2, [3, 4]], 5]
print(flatten(nested))`,
    expectedOutput: "[1, 2, 3, 4, 5]",
    topic: "Recursion",
  },
  {
    id: 19,
    title: "File Reading",
    explanation: "Read and print the contents of a file named 'data.txt'.",
    level: "Intermediate",
    tags: ["file", "io"],
    code: `with open("data.txt", "r") as f:
    print(f.read())`,
    expectedOutput: "Contents of data.txt",
    topic: "File Handling",
  },
  {
    id: 20,
    title: "Map Filter Example",
    explanation: "Print squares of even numbers from a given list.",
    level: "Intermediate",
    tags: ["map", "filter", "lambda"],
    code: `nums = list(map(int, input().split()))
result = list(map(lambda x: x**2, filter(lambda x: x % 2 == 0, nums)))
print(result)`,
    expectedOutput: "If input is 1 2 3 4 → Output: [4, 16]",
    topic: "Functional Programming",
  }
];

export default function PythonPractice(): React.ReactElement {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<"All" | Level>("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [codeMap, setCodeMap] = useState<Record<number, string>>(
    QUESTIONS.reduce((acc, q) => {
      acc[q.id] = q.code;
      return acc;
    }, {} as Record<number, string>)
  );
  const [outputs, setOutputs] = useState<Record<number, string>>({});

  const levels: ("All" | Level)[] = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = useMemo(() => {
    const low = query.trim().toLowerCase();
    return QUESTIONS.filter((q) => {
      if (filter !== "All" && q.level !== filter) return false;
      if (!low) return true;
      return (
        q.title.toLowerCase().includes(low) ||
        q.explanation.toLowerCase().includes(low) ||
        (q.tags || []).some((t) => t.toLowerCase().includes(low)) ||
        (q.topic || "").toLowerCase().includes(low)
      );
    });
  }, [query, filter]);

  const runCode = (id: number) => {
    const q = QUESTIONS.find((x) => x.id === id);
    if (!q) {
      setOutputs((prev) => ({ ...prev, [id]: "No question found." }));
      return;
    }
    setOutputs((prev) => ({
      ...prev,
      [id]: `> Running (simulated)\n${q.expectedOutput || "No output"}`
    }));
  };

  const resetCode = (id: number) => {
    const q = QUESTIONS.find((x) => x.id === id);
    if (!q) return;
    setCodeMap((prev) => ({ ...prev, [id]: q.code }));
    setOutputs((prev) => ({ ...prev, [id]: "" }));
  };

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-300 mb-6 text-center">Python Practice Hub</h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 w-full sm:w-auto">
            <FiSearch className="text-gray-400" />
            <input
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search by keyword, topic, or tag..."
              className="bg-transparent outline-none text-sm text-gray-100 w-64"
            />
          </div>

          <div className="flex gap-2">
            {levels.map((lv) => (
              <button
                key={lv}
                onClick={() => setFilter(lv)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === lv ? "bg-indigo-600 text-white shadow-md" : "bg-gray-800 text-gray-200"
                }`}
              >
                {lv}
              </button>
            ))}
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {filtered.length === 0 && <div className="text-center text-gray-400 py-8">No questions found.</div>}

          {filtered.map((q) => (
            <div
              key={q.id}
              className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 p-4 rounded-2xl border border-gray-600 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-semibold text-indigo-200">{q.title}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        q.level === "Beginner"
                          ? "bg-green-600"
                          : q.level === "Intermediate"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      {q.level}
                    </span>
                    {q.topic && (
                      <span className="text-xs text-gray-300 bg-gray-800/50 px-2 py-0.5 rounded">{q.topic}</span>
                    )}
                    {q.tags && q.tags.length > 0 && (
                      <div className="ml-2 flex flex-wrap gap-2">
                        {q.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-xs text-gray-300 bg-gray-800/50 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">{q.explanation}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      title={bookmarks.includes(q.id) ? "Remove Bookmark" : "Bookmark"}
                      className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
                    >
                      <FiBookmark className={bookmarks.includes(q.id) ? "text-yellow-400" : "text-gray-300"} />
                    </button>

                    <button
                      onClick={() => setExpandedId((id) => (id === q.id ? null : q.id))}
                      className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
                    >
                      <FiRotateCw className="text-gray-200" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expand area */}
              {expandedId === q.id && (
                <div className="mt-4">
                  <div className="border border-gray-700 rounded-lg overflow-hidden">
                    <CodeMirror
                      value={codeMap[q.id]}
                      height="200px"
                      extensions={[java()]}
                      theme="dark"
                      onChange={(v) => setCodeMap((prev) => ({ ...prev, [q.id]: v || "" }))}
                    />
                  </div>

                  {/* Run / Reset */}
                  <div className="flex flex-wrap gap-3 items-center mt-3">
                    <button
                      onClick={() => runCode(q.id)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 rounded-md text-white font-semibold"
                    >
                      <FiPlay /> Run Code
                    </button>

                    <button
                      onClick={() => resetCode(q.id)}
                      className="inline-flex items-center gap-2 bg-gray-800 border border-gray-600 px-3 py-2 rounded-md text-gray-200"
                    >
                      <FiRotateCw /> Reset
                    </button>

                    <div className="ml-auto text-sm text-gray-400">Question ID: {q.id}</div>
                  </div>

                  {/* Output / Console */}
                  <div className="mt-3 bg-black bg-opacity-50 border border-gray-800 rounded-md p-3 text-sm text-gray-100">
                    <div className="font-medium text-gray-300 mb-2">Output</div>
                    <pre className="whitespace-pre-wrap text-xs leading-5">{outputs[q.id] || "— No output yet —"}</pre>
                  </div>

                  {/* Explanation */}
                  <div className="mt-3 text-sm text-gray-300">
                    <strong className="text-indigo-200">Explanation:</strong>
                    <p className="mt-1">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
