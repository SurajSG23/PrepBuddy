import React, { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { FiPlay, FiRotateCw, FiBookmark,  FiSearch } from "react-icons/fi";

/**
 * CppPractice.tsx
 * - Tailwind-styled practice page similar to JavaScriptPractice.
 * - Run Code shows pre-defined expectedOutput for each question (simulation).
 * - Uses CodeMirror with C++ language support for syntax highlighting.
 */

type Level = "Beginner" | "Intermediate" | "Advanced";

type CppQ = {
  id: number;
  level: Level;
  title: string;
  topic: string;
  code: string;
  explanation: string;
  expectedOutput: string;
  tags?: string[];
};

const QUESTIONS: CppQ[] = [
  // BEGINNER
  {
    id: 1,
    level: "Beginner",
    topic: "Basics",
    title: "Hello World",
    code: `#include <iostream>
int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    explanation: "The classic program printing Hello, World! using std::cout.",
    expectedOutput: "Hello, World!\n",
    tags: ["io", "basics"],
  },
  {
    id: 2,
    level: "Beginner",
    topic: "Variables",
    title: "Swap two numbers (using temp)",
    code: `#include <iostream>
int main() {
    int a = 5, b = 7, tmp;
    tmp = a; a = b; b = tmp;
    std::cout << a << " " << b << std::endl;
    return 0;
}`,
    explanation: "Simple swap using a temporary variable.",
    expectedOutput: "7 5\n",
    tags: ["variables"],
  },
  {
    id: 3,
    level: "Beginner",
    topic: "Control Flow",
    title: "Check prime (simple)",
    code: `#include <iostream>
bool isPrime(int n){
  if(n<=1) return false;
  for(int i=2;i*i<=n;i++) if(n%i==0) return false;
  return true;
}
int main(){ std::cout << isPrime(7) << std::endl; }`,
    explanation: "Basic prime check — prints 1 for true, 0 for false.",
    expectedOutput: "1\n",
    tags: ["loops", "math"],
  },
  {
    id: 4,
    level: "Beginner",
    topic: "Arrays",
    title: "Reverse an array",
    code: `#include <bits/stdc++.h>
using namespace std;
int main(){
  vector<int> a = {1,2,3};
  reverse(a.begin(), a.end());
  for(auto x: a) cout<<x<<" ";
  cout<<endl;
}`,
    explanation: "Uses std::reverse to reverse a vector.",
    expectedOutput: "3 2 1 \n",
    tags: ["stl", "arrays"],
  },

  // INTERMEDIATE
  {
    id: 5,
    level: "Intermediate",
    topic: "Strings",
    title: "Check palindrome",
    code: `#include <bits/stdc++.h>
using namespace std;
bool isPal(string s){ string r=s; reverse(r.begin(), r.end()); return s==r; }
int main(){ cout<<isPal(\"radar\")<<endl; }`,
    explanation: "Compare string with its reverse; prints 1 if palindrome.",
    expectedOutput: "1\n",
    tags: ["strings"],
  },
  {
    id: 6,
    level: "Intermediate",
    topic: "STL",
    title: "Count frequency using map",
    code: `#include <bits/stdc++.h>
using namespace std;
int main(){
  vector<int> a = {1,2,2,3,2};
  unordered_map<int,int> m;
  for(int x:a) m[x]++;
  cout<<m[2]<<endl;
}`,
    explanation: "Counts occurrences of 2 using unordered_map.",
    expectedOutput: "3\n",
    tags: ["stl", "hashmap"],
  },
  {
    id: 7,
    level: "Intermediate",
    topic: "Pointers",
    title: "Pointer basics",
    code: `#include <iostream>
using namespace std;
int main(){
  int x=10;
  int *p=&x;
  cout<<*p<<endl;
}`,
    explanation: "Prints value via pointer dereference.",
    expectedOutput: "10\n",
    tags: ["pointers"],
  },
  {
    id: 8,
    level: "Intermediate",
    topic: "Algorithms",
    title: "Binary search (STL)",
    code: `#include <bits/stdc++.h>
using namespace std;
int main(){
  vector<int> a={1,3,5,7};
  cout<<binary_search(a.begin(), a.end(), 5)<<endl;
}`,
    explanation: "binary_search returns true (1) if element found.",
    expectedOutput: "1\n",
    tags: ["search", "stl"],
  },

  // ADVANCED
  {
    id: 9,
    level: "Advanced",
    topic: "Memory",
    title: "Smart pointer unique_ptr",
    code: `#include <iostream>
#include <memory>
using namespace std;
int main(){
  unique_ptr<int> p = make_unique<int>(42);
  cout<<*p<<endl;
}`,
    explanation: "Demonstrates unique_ptr usage; prints stored int.",
    expectedOutput: "42\n",
    tags: ["memory", "smart-ptr"],
  },
  {
    id: 10,
    level: "Advanced",
    topic: "Concurrency",
    title: "Thread example (concept)",
    code: `// Concept only (threading output may vary on environment)
#include <iostream>
#include <thread>
using namespace std;
void f(){ cout<<\"hello from thread\\n\"; }
int main(){ thread t(f); t.join(); }`,
    explanation: "Spawns a thread and joins — prints message from thread.",
    expectedOutput: "hello from thread\n",
    tags: ["threads", "concurrency"],
  },
  {
    id: 11,
    level: "Advanced",
    topic: "STL",
    title: "Custom comparator (sort pair by second)",
    code: `#include <bits/stdc++.h>
using namespace std;
int main(){
  vector<pair<int,int>> v={{1,3},{2,1},{3,2}};
  sort(v.begin(), v.end(), [](auto &a, auto &b){ return a.second < b.second; });
  for(auto &p: v) cout<<p.first<<\" \";
  cout<<endl;
}`,
    explanation: "Sorts pairs by second element using lambda comparator.",
    expectedOutput: "2 3 1 \n",
    tags: ["stl", "lambda"],
  },

  // MORE (mix of difficulties/topics)
  {
    id: 12,
    level: "Beginner",
    topic: "Math",
    title: "Factorial (iterative)",
    code: `#include <iostream>
using namespace std;
int main(){ int n=5; long long f=1; for(int i=1;i<=n;i++) f*=i; cout<<f<<endl; }`,
    explanation: "Iterative factorial for n=5.",
    expectedOutput: "120\n",
    tags: ["math"],
  },
  {
    id: 13,
    level: "Intermediate",
    topic: "Recursion",
    title: "Fibonacci (recursive)",
    code: `#include <iostream>
using namespace std;
int fib(int n){ return n<=1?n:fib(n-1)+fib(n-2); }
int main(){ cout<<fib(6)<<endl; }`,
    explanation: "Recursive Fibonacci for n=6 => 8.",
    expectedOutput: "8\n",
    tags: ["recursion"],
  },
  {
    id: 14,
    level: "Intermediate",
    topic: "Pointers",
    title: "Swap using pointers",
    code: `#include <iostream>
using namespace std;
void swapv(int *a,int *b){ int t=*a; *a=*b; *b=t; }
int main(){ int x=3,y=4; swapv(&x,&y); cout<<x<<\" \"<<y<<endl; }`,
    explanation: "Swaps values using pointer parameters.",
    expectedOutput: "4 3\n",
    tags: ["pointers"],
  },
  {
    id: 15,
    level: "Advanced",
    topic: "Templates",
    title: "Function template example",
    code: `#include <iostream>
using namespace std;
template<typename T> T add(T a, T b){ return a+b; }
int main(){ cout<<add<int>(2,3)<<endl; }`,
    explanation: "Shows a simple function template.",
    expectedOutput: "5\n",
    tags: ["templates"],
  },
  {
    id: 16,
    level: "Beginner",
    topic: "Vectors",
    title: "Push/pop vector",
    code: `#include <bits/stdc++.h>
using namespace std;
int main(){ vector<int> v; v.push_back(1); v.push_back(2); cout<<v.back()<<endl; v.pop_back(); cout<<v.size()<<endl; }`,
    explanation: "Pushes two elements, prints last element, pops and prints size.",
    expectedOutput: "2\n1\n",
    tags: ["stl", "vectors"],
  },
  {
    id: 17,
    level: "Intermediate",
    topic: "Sorting",
    title: "Sort descending",
    code: `#include <bits/stdc++.h>
using namespace std;
int main(){ vector<int> a={3,1,2}; sort(a.begin(), a.end(), greater<int>()); for(int x:a) cout<<x; cout<<endl; }`,
    explanation: "Sorts vector in descending order using greater comparator.",
    expectedOutput: "321\n",
    tags: ["sort"],
  },
  {
    id: 18,
    level: "Advanced",
    topic: "Move semantics",
    title: "Move constructor concept",
    code: `#include <bits/stdc++.h>
using namespace std;
struct S{ vector<int> v; S(){} S(vector<int>&& x):v(move(x)){} };
int main(){ vector<int> tmp={1,2,3}; S s(move(tmp)); cout<<s.v.size()<<endl; }`,
    explanation: "Demonstrates move semantics where tmp is moved into member v.",
    expectedOutput: "3\n",
    tags: ["move", "rvalue"],
  },
  {
    id: 19,
    level: "Intermediate",
    topic: "Strings",
    title: "Substring search (find)",
    code: `#include <iostream>
#include <string>
using namespace std;
int main(){ string s=\"hello world\"; cout<<s.find(\"world\")<<endl; }`,
    explanation: "find returns starting index of substring or npos.",
    expectedOutput: "6\n",
    tags: ["strings"],
  },
  {
    id: 20,
    level: "Advanced",
    topic: "Smart pointers",
    title: "shared_ptr refcount",
    code: `#include <iostream>
#include <memory>
using namespace std;
int main(){ auto p = make_shared<int>(5); auto q = p; cout<<p.use_count()<<endl; }`,
    explanation: "shared_ptr keeps reference count; use_count prints 2 after copy.",
    expectedOutput: "2\n",
    tags: ["smart-ptr"],
  },
  {
    id: 21,
    level: "Intermediate",
    topic: "Maps",
    title: "Iterate map keys",
    code: `#include <bits/stdc++.h>
using namespace std;
int main(){ map<string,int> m={{\"a\",1},{\"b\",2}}; for(auto &kv: m) cout<<kv.first; cout<<endl; }`,
    explanation: "Iterates ordered map keys.",
    expectedOutput: "ab\n",
    tags: ["maps"],
  },
  {
    id: 22,
    level: "Advanced",
    topic: "Lambda",
    title: "Capture by value vs ref",
    code: `#include <bits/stdc++.h>
using namespace std;
int main(){ int x=1; auto f=[x](){ cout<<x<<endl; }; x=2; f(); }`,
    explanation: "Capture by value copies x, so prints original value (1).",
    expectedOutput: "1\n",
    tags: ["lambda"],
  },
];

export default function CppPractice(): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<"All" | Level | "All">("All");
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
        q.topic.toLowerCase().includes(low) ||
        (q.tags || []).some((t) => t.toLowerCase().includes(low))
      );
    });
  }, [query, filter]);

  // "Run" shows the stored expected output (simulation)
  const runCode = (id: number) => {
    const q = QUESTIONS.find((x) => x.id === id);
    if (!q) {
      setOutputs((prev) => ({ ...prev, [id]: "No question found." }));
      return;
    }
    // Simulate runtime by returning the expectedOutput. Could add small delay to mimic compile.
    setOutputs((prev) => ({ ...prev, [id]: `> Running (simulated)\n${q.expectedOutput}` }));
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
        <h1 className="text-4xl font-extrabold text-indigo-300 mb-6 text-center">C++ Practice Hub</h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 w-full sm:w-auto">
            <FiSearch className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
          {filtered.map((q) => (
            <div
              key={q.id}
              className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 p-4 rounded-2xl border border-gray-600 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-indigo-200">{q.title}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        q.level === "Beginner" ? "bg-green-600" : q.level === "Intermediate" ? "bg-yellow-600" : "bg-red-600"
                      }`}
                    >
                      {q.level}
                    </span>
                    <span className="text-xs text-gray-300 bg-gray-800/50 px-2 py-0.5 rounded">{q.topic}</span>
                    {q.tags && q.tags.length > 0 && (
                      <div className="ml-2 flex flex-wrap gap-2">
                        {q.tags!.slice(0, 3).map((t) => (
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
  onClick={() => toggleBookmark(q.title)}
  className={`transition ${bookmarks.includes(q.title) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`}
  title="Bookmark"
>
  <FiBookmark
    size={20}
    className={bookmarks.includes(q.title) ? 'fill-yellow-400' : 'fill-none'}
  />
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
                      height="220px"
                      extensions={[cpp()]}
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
                      <FiPlay /> Run (simulate)
                    </button>

                    <button
                      onClick={() => resetCode(q.id)}
                      className="inline-flex items-center gap-2 bg-gray-800 border border-gray-600 px-3 py-2 rounded-md text-gray-200"
                    >
                      <FiRotateCw /> Reset
                    </button>

                    <div className="ml-auto text-sm text-gray-400">Example ID: {q.id}</div>
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

          {filtered.length === 0 && <div className="text-center text-gray-400 py-8">No questions found.</div>}
        </div>
      </div>
    </div>
  );
}
