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
    code: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`,
    expectedOutput: "Hello World",
    topic: "Basics",
  },
  {
    id: 2,
    title: "Sum of Two Numbers",
    explanation: "Add two integers and print the sum.",
    level: "Beginner",
    tags: ["math", "basics"],
    code: `public class Main {
  public static void main(String[] args) {
    int a = 5, b = 7;
    System.out.println(a + b);
  }
}`,
    expectedOutput: "12",
    topic: "Math",
  },
  {
    id: 3,
    title: "Factorial (Iterative)",
    explanation: "Calculate factorial of a number using iteration.",
    level: "Intermediate",
    tags: ["loops", "math"],
    code: `public class Main {
  public static int factorial(int n) {
    int result = 1;
    for(int i = 2; i <= n; i++) result *= i;
    return result;
  }
  public static void main(String[] args) {
    System.out.println(factorial(5));
  }
}`,
    expectedOutput: "120",
    topic: "Math",
  },
  {
    id: 4,
    title: "Check Prime Number",
    explanation: "Check if a number is prime.",
    level: "Intermediate",
    tags: ["math", "conditionals"],
    code: `public class Main {
  public static boolean isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
      if (n % i == 0) return false;
    }
    return true;
  }
  public static void main(String[] args) {
    System.out.println(isPrime(13));
  }
}`,
    expectedOutput: "true",
    topic: "Math",
  },
  {
    id: 5,
    title: "Fibonacci Series",
    explanation: "Print first N Fibonacci numbers.",
    level: "Intermediate",
    tags: ["loops", "recursion"],
    code: `public class Main {
  public static void fibonacci(int n) {
    int a = 0, b = 1;
    for(int i = 0; i < n; i++) {
      System.out.print(a + " ");
      int next = a + b;
      a = b;
      b = next;
    }
  }
  public static void main(String[] args) {
    fibonacci(7);
  }
}`,
    expectedOutput: "0 1 1 2 3 5 8 ",
    topic: "Math",
  },
  {
    id: 6,
    title: "Reverse String",
    explanation: "Reverse a given string.",
    level: "Beginner",
    tags: ["strings"],
    code: `public class Main {
  public static String reverse(String s) {
    return new StringBuilder(s).reverse().toString();
  }
  public static void main(String[] args) {
    System.out.println(reverse("hello"));
  }
}`,
    expectedOutput: "olleh",
    topic: "Strings",
  },
  {
    id: 7,
    title: "Palindrome Check",
    explanation: "Check if a string is palindrome.",
    level: "Intermediate",
    tags: ["strings", "conditionals"],
    code: `public class Main {
  public static boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
      if (s.charAt(left) != s.charAt(right)) return false;
      left++; right--;
    }
    return true;
  }
  public static void main(String[] args) {
    System.out.println(isPalindrome("madam"));
  }
}`,
    expectedOutput: "true",
    topic: "Strings",
  },
  {
    id: 8,
    title: "Find Max Element",
    explanation: "Find max element in an array.",
    level: "Beginner",
    tags: ["arrays"],
    code: `public class Main {
  public static int maxElement(int[] arr) {
    int max = arr[0];
    for(int num : arr) if(num > max) max = num;
    return max;
  }
  public static void main(String[] args) {
    System.out.println(maxElement(new int[]{3, 5, 1, 9, 2}));
  }
}`,
    expectedOutput: "9",
    topic: "Arrays",
  },
  {
    id: 9,
    title: "Bubble Sort",
    explanation: "Sort an array using bubble sort.",
    level: "Advanced",
    tags: ["sorting", "arrays"],
    code: `public class Main {
  public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for(int i=0; i<n-1; i++) {
      for(int j=0; j<n-i-1; j++) {
        if(arr[j] > arr[j+1]) {
          int temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;
        }
      }
    }
  }
  public static void main(String[] args) {
    int[] arr = {5,3,8,4,2};
    bubbleSort(arr);
    for(int num : arr) System.out.print(num + " ");
  }
}`,
    expectedOutput: "2 3 4 5 8 ",
    topic: "Sorting",
  },
  {
    id: 10,
    title: "Factorial (Recursive)",
    explanation: "Calculate factorial using recursion.",
    level: "Intermediate",
    tags: ["recursion", "math"],
    code: `public class Main {
  public static int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  }
  public static void main(String[] args) {
    System.out.println(factorial(6));
  }
}`,
    expectedOutput: "720",
    topic: "Math",
  },
  {
    id: 11,
    title: "Count Vowels",
    explanation: "Count vowels in a string.",
    level: "Beginner",
    tags: ["strings"],
    code: `public class Main {
  public static int countVowels(String s) {
    int count = 0;
    for(char c : s.toLowerCase().toCharArray()) {
      if("aeiou".indexOf(c) != -1) count++;
    }
    return count;
  }
  public static void main(String[] args) {
    System.out.println(countVowels("hello world"));
  }
}`,
    expectedOutput: "3",
    topic: "Strings",
  },
  {
    id: 12,
    title: "Check Even or Odd",
    explanation: "Check if a number is even or odd.",
    level: "Beginner",
    tags: ["conditionals"],
    code: `public class Main {
  public static String evenOrOdd(int n) {
    return (n % 2 == 0) ? "Even" : "Odd";
  }
  public static void main(String[] args) {
    System.out.println(evenOrOdd(7));
  }
}`,
    expectedOutput: "Odd",
    topic: "Conditionals",
  },
  {
    id: 13,
    title: "Sum Array Elements",
    explanation: "Sum all elements in an integer array.",
    level: "Beginner",
    tags: ["arrays"],
    code: `public class Main {
  public static int sumArray(int[] arr) {
    int sum = 0;
    for(int n : arr) sum += n;
    return sum;
  }
  public static void main(String[] args) {
    System.out.println(sumArray(new int[]{1, 2, 3, 4}));
  }
}`,
    expectedOutput: "10",
    topic: "Arrays",
  },
  {
    id: 14,
    title: "Find Min Element",
    explanation: "Find the minimum element in an array.",
    level: "Beginner",
    tags: ["arrays"],
    code: `public class Main {
  public static int minElement(int[] arr) {
    int min = arr[0];
    for(int n : arr) if(n < min) min = n;
    return min;
  }
  public static void main(String[] args) {
    System.out.println(minElement(new int[]{4, 2, 8, 1}));
  }
}`,
    expectedOutput: "1",
    topic: "Arrays",
  },
  {
    id: 15,
    title: "Calculate Power",
    explanation: "Calculate x^y (x to the power y).",
    level: "Intermediate",
    tags: ["math", "recursion"],
    code: `public class Main {
  public static int power(int x, int y) {
    if (y == 0) return 1;
    return x * power(x, y - 1);
  }
  public static void main(String[] args) {
    System.out.println(power(2, 4));
  }
}`,
    expectedOutput: "16",
    topic: "Math",
  },
  {
    id: 16,
    title: "Check Armstrong Number",
    explanation: "Check if a number is an Armstrong number.",
    level: "Advanced",
    tags: ["math"],
    code: `public class Main {
  public static boolean isArmstrong(int num) {
    int original = num, sum = 0;
    while(num > 0) {
      int digit = num % 10;
      sum += digit * digit * digit;
      num /= 10;
    }
    return sum == original;
  }
  public static void main(String[] args) {
    System.out.println(isArmstrong(153));
  }
}`,
    expectedOutput: "true",
    topic: "Math",
  },
  {
    id: 17,
    title: "Merge Two Arrays",
    explanation: "Merge two integer arrays into one.",
    level: "Intermediate",
    tags: ["arrays"],
    code: `import java.util.Arrays;
public class Main {
  public static int[] mergeArrays(int[] a, int[] b) {
    int[] result = new int[a.length + b.length];
    System.arraycopy(a, 0, result, 0, a.length);
    System.arraycopy(b, 0, result, a.length, b.length);
    return result;
  }
  public static void main(String[] args) {
    int[] merged = mergeArrays(new int[]{1,2}, new int[]{3,4});
    System.out.println(Arrays.toString(merged));
  }
}`,
    expectedOutput: "[1, 2, 3, 4]",
    topic: "Arrays",
  },
  {
    id: 18,
    title: "Remove Duplicates from Array",
    explanation: "Remove duplicates from a sorted array.",
    level: "Advanced",
    tags: ["arrays"],
    code: `import java.util.Arrays;
public class Main {
  public static int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int i = 0;
    for (int j = 1; j < nums.length; j++) {
      if (nums[j] != nums[i]) {
        i++;
        nums[i] = nums[j];
      }
    }
    return i + 1;
  }
  public static void main(String[] args) {
    int[] nums = {1,1,2,2,3};
    int len = removeDuplicates(nums);
    System.out.print("[");
    for(int i=0; i<len; i++) {
      System.out.print(nums[i] + (i<len-1 ? ", " : ""));
    }
    System.out.println("]");
  }
}`,
    expectedOutput: "[1, 2, 3]",
    topic: "Arrays",
  },
  {
    id: 19,
    title: "Binary Search",
    explanation: "Perform binary search on sorted array.",
    level: "Advanced",
    tags: ["searching", "arrays"],
    code: `public class Main {
  public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while(left <= right) {
      int mid = left + (right - left) / 2;
      if(arr[mid] == target) return mid;
      else if(arr[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
  public static void main(String[] args) {
    System.out.println(binarySearch(new int[]{1,2,3,4,5}, 3));
  }
}`,
    expectedOutput: "2",
    topic: "Searching",
  },
  {
    id: 20,
    title: "Check Anagram",
    explanation: "Check if two strings are anagrams.",
    level: "Intermediate",
    tags: ["strings"],
    code: `import java.util.Arrays;
public class Main {
  public static boolean isAnagram(String s1, String s2) {
    char[] a = s1.toCharArray();
    char[] b = s2.toCharArray();
    Arrays.sort(a);
    Arrays.sort(b);
    return Arrays.equals(a, b);
  }
  public static void main(String[] args) {
    System.out.println(isAnagram("listen", "silent"));
  }
}`,
    expectedOutput: "true",
    topic: "Strings",
  },
];

export default function JavaPractice(): React.ReactElement {
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
        <h1 className="text-4xl font-extrabold text-indigo-300 mb-6 text-center">Java Practice Hub</h1>

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
