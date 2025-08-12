
import  { useState, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { FiPlay, FiRotateCw, FiBookmark, FiSearch } from "react-icons/fi";

/**
 * JavaScriptPractice.tsx
 * Self-contained page component with 24 JS questions, CodeMirror editor per question,
 * run/reset functionality, search and difficulty filter, in-memory bookmarks.
 *
 * NOTE: This runs user code via Function/eval. Do NOT run untrusted code in production.
 */

type Level = "Beginner" | "Intermediate" | "Advanced";

type Q = {
  id: number;
  level: Level;
  title: string;
  code: string;
  explanation: string;
  tags?: string[];
};

const QUESTIONS: Q[] = [
  // BEGINNER
  {
    id: 1,
    level: "Beginner",
    title: "var vs let vs const",
    code: `// What's logged and why?
var a = 1;
if (true) {
  var a = 2;
  let b = 3;
  const c = 4;
}
console.log(a); // ?
`,
    explanation:
      "var is function-scoped and can be re-declared; let/const are block-scoped. So console.log(a) prints 2 because var inside the block reassigns the function-scoped variable.",
    tags: ["scope", "variables"],
  },
  {
    id: 2,
    level: "Beginner",
    title: "Template Literals",
    code: `const name = "Alice";
const greeting = \`Hello, \${name}!\`;
console.log(greeting);`,
    explanation: "Template literals (backticks) allow embedded expressions like ${name}.",
    tags: ["strings", "es6"],
  },
  {
    id: 3,
    level: "Beginner",
    title: "Array map vs forEach",
    code: `const arr = [1,2,3];
const mapped = arr.map(x => x * 2);
console.log('map:', mapped);
const forEachRes = arr.forEach(x => x * 2);
console.log('forEach:', forEachRes);`,
    explanation:
      "map returns a new array with the results; forEach returns undefined and is used for side effects.",
    tags: ["arrays"],
  },
  {
    id: 4,
    level: "Beginner",
    title: "Falsy Values",
    code: `const vals = [0, '', null, undefined, NaN, false, '0'];
console.log(vals.filter(Boolean));`,
    explanation: "Boolean filter removes falsy values (0, '', null, undefined, NaN, false). '0' is truthy.",
    tags: ["truthy-falsy"],
  },

  // INTERMEDIATE
  {
    id: 5,
    level: "Intermediate",
    title: "Closures (counter)",
    code: `function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  }
}
const c = makeCounter();
console.log(c());
console.log(c());
console.log(typeof c);`,
    explanation:
      "A closure captures the outer function's variables — count persists across calls.",
    tags: ["closures", "functions"],
  },
  {
    id: 6,
    level: "Intermediate",
    title: "Debounce (simple)",
    code: `// Simple debounce example - this prints once even if called repeatedly.
function debounce(fn, delay){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(()=> fn(...args), delay);
  };
}
const deb = debounce(()=> console.log('debounced'), 200);
deb(); deb(); deb(); // only one log after 200ms (when run in sequence)`,
    explanation: "Debounce ensures a function runs only after a pause in calls.",
    tags: ["performance", "timers"],
  },
  {
    id: 7,
    level: "Intermediate",
    title: "this behavior",
    code: `const obj = {
  x: 10,
  getX() { return this.x; }
};
const f = obj.getX;
console.log(obj.getX()); // ?
console.log(f()); // ?`,
    explanation:
      "When called as obj.getX(), this is obj. When the function reference is called standalone (f()), this is undefined (or global in non-strict).",
    tags: ["this", "context"],
  },
  {
    id: 8,
    level: "Intermediate",
    title: "Promise.all vs Promise.race",
    code: `const p1 = new Promise(res => setTimeout(()=>res('p1'), 300));
const p2 = new Promise(res => setTimeout(()=>res('p2'), 100));
Promise.all([p1, p2]).then(x=> console.log('all', x));
Promise.race([p1, p2]).then(x=> console.log('race', x));`,
    explanation:
      "Promise.all waits for all to fulfill (or any reject). Promise.race resolves/rejects with the first settled promise.",
    tags: ["promises", "async"],
  },
  {
    id: 9,
    level: "Intermediate",
    title: "Event delegation example",
    code: `// Simulate event delegation logic: find target's closest button text
const html = '<div><button>OK</button></div>';
console.log('Delegation concept - cannot run DOM here in Node-like eval');`,
    explanation:
      "Event delegation attaches a single listener higher up and inspects events for matching targets (useful for many children).",
    tags: ["dom", "events"],
  },

  // ADVANCED
  {
    id: 10,
    level: "Advanced",
    title: "Event Loop ordering",
    code: `console.log('start');
setTimeout(()=>console.log('timeout'), 0);
Promise.resolve().then(()=>console.log('promise'));
console.log('end');`,
    explanation:
      "Order: start, end, promise (microtask), timeout (macrotask). Microtasks run between macrotask steps.",
    tags: ["event-loop", "async"],
  },
  {
    id: 11,
    level: "Advanced",
    title: "Currying example",
    code: `function curryAdd(a) {
  return function(b) {
    return a + b;
  };
}
console.log(curryAdd(2)(3));`,
    explanation: "Currying transforms a function of multiple args into nested single-arg functions.",
    tags: ["functional"],
  },
  {
    id: 12,
    level: "Advanced",
    title: "Prototype vs __proto__",
    code: `function Person(name){ this.name = name;}
Person.prototype.greet = function(){ return 'hi ' + this.name; };
const p = new Person('Sam');
console.log(p.greet());`,
    explanation:
      "prototype is a property on constructor functions; __proto__ is the object's internal prototype link.",
    tags: ["prototype"],
  },
  {
    id: 13,
    level: "Advanced",
    title: "Throttle implementation",
    code: `function throttle(fn, wait){
  let last = 0;
  return function(...args){
    const now = Date.now();
    if(now - last >= wait){
      last = now;
      return fn(...args);
    }
  }
}
const t = throttle(()=> console.log('throttle'), 200);
t(); t(); t();`,
    explanation: "Throttle ensures a function runs at most once per interval.",
    tags: ["timers", "performance"],
  },

  // MORE QUESTIONS (mix)
  {
    id: 14,
    level: "Beginner",
    title: "String reverse",
    code: `function reverse(s){ return s.split('').reverse().join(''); }
console.log(reverse('abc'));`,
    explanation: "Simple method using split/reverse/join.",
    tags: ["strings"],
  },
  {
    id: 15,
    level: "Intermediate",
    title: "Flatten array (one level)",
    code: `const arr = [1, [2,3], 4];
console.log(arr.flat());`,
    explanation: "Array.flat() flattens nested arrays one level by default.",
    tags: ["arrays"],
  },
  {
    id: 16,
    level: "Intermediate",
    title: "Deep clone (JSON)",
    code: `const o = {a:1, b:{c:2}};
const clone = JSON.parse(JSON.stringify(o));
console.log(clone);`,
    explanation:
      "Quick deep clone using JSON but won't handle functions, undefined, or cyclic references.",
    tags: ["objects"],
  },
  {
    id: 17,
    level: "Advanced",
    title: "Implement simple Promise",
    code: `// Basic conceptual idea - not production-ready
function simplePromise(executor){
  let onResolve;
  let fulfilled = false;
  let value;
  function resolve(v){
    fulfilled = true;
    value = v;
    if(onResolve) onResolve(v);
  }
  return {
    then(cb){
      if(fulfilled) cb(value);
      else onResolve = cb;
    },
    _resolve: resolve
  };
}
const p = simplePromise();
p.then(v=> console.log('then', v));
p._resolve('ok');`,
    explanation: "Tiny conceptual example that stores a resolver and calls then when resolved.",
    tags: ["promises"],
  },
  {
    id: 18,
    level: "Beginner",
    title: "Array dedupe using Set",
    code: `const arr = [1,2,1,3];
console.log([...new Set(arr)]);`,
    explanation: "Using Set removes duplicates.",
    tags: ["arrays", "set"],
  },
  {
    id: 19,
    level: "Intermediate",
    title: "Find maximum subarray (Kadane's - short)",
    code: `function maxSub(arr){
  let max = -Infinity, sum = 0;
  for(let x of arr){
    sum = Math.max(x, sum + x);
    max = Math.max(max, sum);
  }
  return max;
}
console.log(maxSub([1,-2,3,4,-1]));`,
    explanation: "Kadane's algorithm for max contiguous subarray in O(n).",
    tags: ["algorithms"],
  },
  {
    id: 20,
    level: "Advanced",
    title: "WeakMap use-case",
    code: `const wm = new WeakMap();
(function(){
  const key = {};
  wm.set(key, 'meta');
  console.log(wm.has(key)); // true
  // when key is GC'd, entry is removed automatically (no demo for GC)
})();`,
    explanation: "WeakMap keys are weakly referenced; useful for attaching metadata without preventing GC.",
    tags: ["memory"],
  },
  {
    id: 21,
    level: "Intermediate",
    title: "Throttle vs Debounce (difference)",
    code: `console.log('Concept: throttle limits freq; debounce delays until silence');`,
    explanation: "Throttle: run at most once per interval. Debounce: wait until calls stop.",
    tags: ["timers"],
  },
  {
    id: 22,
    level: "Advanced",
    title: "Async/Await error handling",
    code: `async function f(){
  try {
    const r = await Promise.reject('fail');
    return r;
  } catch(e){
    return 'caught ' + e;
  }
}
f().then(console.log);`,
    explanation: "Use try/catch with async/await to handle rejections.",
    tags: ["async"],
  },
  {
    id: 23,
    level: "Beginner",
    title: "Array chunking",
    code: `function chunk(arr, size){
  const res = [];
  for(let i=0;i<arr.length;i+=size) res.push(arr.slice(i, i+size));
  return res;
}
console.log(chunk([1,2,3,4,5], 2));`,
    explanation: "Split an array into chunks of given size.",
    tags: ["arrays"],
  },
  {
    id: 24,
    level: "Intermediate",
    title: "Detect cycle in linked list (Floyd)",
    code: `// conceptual: using indexes to simulate pointers
function hasCycle(arr){
  let slow=0, fast=0;
  while(fast < arr.length && arr[fast] !== undefined){
    slow = arr[slow];
    fast = arr[arr[fast]];
    if(slow === fast) return true;
  }
  return false;
}
console.log('Example conceptual only');`,
    explanation: "Floyd's cycle detection uses two pointers (slow/fast). For actual linked lists use node.next.",
    tags: ["algorithms"],
  },
];

export default function JavaScriptPractice() {
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
        (q.tags || []).some((t) => t.toLowerCase().includes(low))
      );
    });
  }, [query, filter]);

  // execute code safely-ish and capture console logs
  const runCode = (id: number) => {
    const code = codeMap[id] || "";
    const logs: string[] = [];
    // custom console
    const customConsole = {
      log: (...args: unknown[]) => {
        try {
          logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
        } catch {
          logs.push(String(args));
        }
      },
      error: (...args: unknown[]) => {
        logs.push("Error: " + args.join(" "));
      },
      warn: (...args: unknown[]) => {
        logs.push("Warning: " + args.join(" "));
      },
    };

    try {
      // Run in a Function with console replaced
      // NOTE: running arbitrary code is unsafe - this is for practice/demo only.
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      // Prefer async wrapper so user code can use await
      const runner = new AsyncFunction("console", `"use strict";\n${code}`);
      const resPromise = runner(customConsole);
      Promise.resolve(resPromise)
        .then((res) => {
          if (res !== undefined) logs.push("Return: " + (typeof res === "object" ? JSON.stringify(res) : String(res)));
        })
        .catch((err) => {
          logs.push("Runtime Error: " + (err && err.message ? err.message : String(err)));
        })
        .finally(() => {
          setOutputs((prev) => ({ ...prev, [id]: logs.join("\n") || "No output" }));
        });
    } catch (err: unknown) {
      logs.push("Compile/Error: " + (err instanceof Error ? err.message : String(err)));
      setOutputs((prev) => ({ ...prev, [id]: logs.join("\n") }));
    }
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
        <h1 className="text-4xl font-extrabold text-indigo-300 mb-6 text-center">JavaScript Practice Hub</h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 w-full sm:w-auto">
            <FiSearch className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keyword, tag, or explanation..."
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
                      onClick={() => {
                        toggleBookmark(q.id);
                      }}
                      title={bookmarks.includes(q.id) ? "Remove Bookmark" : "Bookmark"}
                      className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
                    >
                      <FiBookmark className={bookmarks.includes(q.id) ? "text-yellow-400" : "text-gray-300"} />
                    </button>

                    <button
                      onClick={() => setExpandedId((id) => (id === q.id ? null : q.id))}
                      className="p-2 rounded-md bg-gray-800 hover:bg-gray-700"
                    >
                      {expandedId === q.id ? <FiRotateCw className="text-gray-200" /> : <FiRotateCw className="text-gray-200" />}
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
                      extensions={[javascript({ jsx: true })]}
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
