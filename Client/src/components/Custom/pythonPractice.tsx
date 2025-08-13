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
    explanation: "Take two numbers and print their sum.",
    level: "Beginner",
    tags: ["basics", "input", "math"],
    code: `a = 5
b = 3
print(a + b)`,
    expectedOutput: "8",
    topic: "Basics",
  },
  {
    id: 3,
    title: "Check Even or Odd",
    explanation: "Check if a number is even or odd.",
    level: "Beginner",
    tags: ["conditionals", "basics"],
    code: `n = 4
if n % 2 == 0:
    print("Even")
else:
    print("Odd")`,
    expectedOutput: "Even",
    topic: "Conditionals",
  },
  {
    id: 4,
    title: "Factorial",
    explanation: "Find the factorial of a number using recursion.",
    level: "Intermediate",
    tags: ["recursion", "math"],
    code: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
    expectedOutput: "120",
    topic: "Recursion",
  },
  {
    id: 5,
    title: "Fibonacci Series",
    explanation: "Print first 5 Fibonacci numbers.",
    level: "Intermediate",
    tags: ["loops", "math"],
    code: `a, b = 0, 1
for _ in range(5):
    print(a, end=" ")
    a, b = b, a + b`,
    expectedOutput: "0 1 1 2 3 ",
    topic: "Loops",
  },
  {
    id: 6,
    title: "List Comprehension",
    explanation: "Create a list of squares from 1 to 5 using list comprehension.",
    level: "Intermediate",
    tags: ["lists", "comprehension"],
    code: `squares = [x**2 for x in range(1, 6)]
print(squares)`,
    expectedOutput: "[1, 4, 9, 16, 25]",
    topic: "Lists",
  },
  {
    id: 7,
    title: "Reverse String",
    explanation: "Reverse a given string.",
    level: "Beginner",
    tags: ["strings", "slicing"],
    code: `text = "Python"
print(text[::-1])`,
    expectedOutput: "nohtyP",
    topic: "Strings",
  },
  {
    id: 8,
    title: "Count Characters",
    explanation: "Count frequency of each character in a string.",
    level: "Intermediate",
    tags: ["strings", "dictionary"],
    code: `text = "banana"
freq = {}
for ch in text:
    freq[ch] = freq.get(ch, 0) + 1
print(freq)`,
    expectedOutput: "{'b': 1, 'a': 3, 'n': 2}",
    topic: "Strings",
  },
  {
    id: 9,
    title: "Prime Check",
    explanation: "Check if a number is prime.",
    level: "Intermediate",
    tags: ["math", "loops"],
    code: `n = 7
is_prime = True
for i in range(2, int(n**0.5) + 1):
    if n % i == 0:
        is_prime = False
        break
print("Prime" if is_prime else "Not Prime")`,
    expectedOutput: "Prime",
    topic: "Math",
  },
  {
    id: 10,
    title: "Palindrome Check",
    explanation: "Check if a given string is a palindrome.",
    level: "Beginner",
    tags: ["strings", "conditionals"],
    code: `text = "madam"
print("Palindrome" if text == text[::-1] else "Not Palindrome")`,
    expectedOutput: "Palindrome",
    topic: "Strings",
  },
  {
    id: 11,
    title: "Merge Dictionaries",
    explanation: "Merge two dictionaries into one.",
    level: "Intermediate",
    tags: ["dictionary", "merge"],
    code: `dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}
merged = {**dict1, **dict2}
print(merged)`,
    expectedOutput: "{'a': 1, 'b': 3, 'c': 4}",
    topic: "Dictionary",
  },
  {
    id: 12,
    title: "Lambda Function",
    explanation: "Square a number using lambda.",
    level: "Beginner",
    tags: ["lambda", "functions"],
    code: `square = lambda x: x**2
print(square(5))`,
    expectedOutput: "25",
    topic: "Functions",
  },
  {
    id: 13,
    title: "Map Function",
    explanation: "Use map to square numbers from 1 to 3.",
    level: "Intermediate",
    tags: ["map", "lambda"],
    code: `nums = [1, 2, 3]
squares = list(map(lambda x: x**2, nums))
print(squares)`,
    expectedOutput: "[1, 4, 9]",
    topic: "Functional Programming",
  },
  {
    id: 14,
    title: "Filter Function",
    explanation: "Use filter to find even numbers from 1 to 5.",
    level: "Intermediate",
    tags: ["filter", "lambda"],
    code: `nums = [1, 2, 3, 4, 5]
evens = list(filter(lambda x: x % 2 == 0, nums))
print(evens)`,
    expectedOutput: "[2, 4]",
    topic: "Functional Programming",
  },
  {
    id: 15,
    title: "List Flatten",
    explanation: "Flatten a list of lists using list comprehension.",
    level: "Intermediate",
    tags: ["lists", "nested"],
    code: `nested = [[1, 2], [3, 4]]
flat = [num for sublist in nested for num in sublist]
print(flat)`,
    expectedOutput: "[1, 2, 3, 4]",
    topic: "Lists",
  },
  {
    id: 16,
    title: "Decorator Example",
    explanation: "Use a decorator to log function execution.",
    level: "Advanced",
    tags: ["decorators", "functions"],
    code: `def log(func):
    def wrapper():
        print("Function is running")
        func()
    return wrapper

@log
def hello():
    print("Hello")

hello()`,
    expectedOutput: "Function is running\nHello",
    topic: "Decorators",
  },
  {
    id: 17,
    title: "Class Example",
    explanation: "Create a class and an object.",
    level: "Intermediate",
    tags: ["oop", "class"],
    code: `class Person:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print(f"Hello, {self.name}")

p = Person("Alice")
p.greet()`,
    expectedOutput: "Hello, Alice",
    topic: "OOP",
  },
  {
    id: 18,
    title: "List to Set",
    explanation: "Convert a list to a set to remove duplicates.",
    level: "Beginner",
    tags: ["set", "list"],
    code: `nums = [1, 2, 2, 3]
unique_nums = set(nums)
print(unique_nums)`,
    expectedOutput: "{1, 2, 3}",
    topic: "Sets",
  },
  {
    id: 19,
    title: "JSON Handling",
    explanation: "Convert dictionary to JSON string.",
    level: "Advanced",
    tags: ["json", "serialization"],
    code: `import json
data = {'name': 'Bob', 'age': 25}
json_str = json.dumps(data)
print(json_str)`,
    expectedOutput: '{"name": "Bob", "age": 25}',
    topic: "JSON",
  },
  {
    id: 20,
    title: "File Read",
    explanation: "Read the contents of a file (sample.txt).",
    level: "Advanced",
    tags: ["file", "io"],
    code: `with open("sample.txt", "w") as f:
    f.write("Hello File")

with open("sample.txt", "r") as f:
    print(f.read())`,
    expectedOutput: "Hello File",
    topic: "File Handling",
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
