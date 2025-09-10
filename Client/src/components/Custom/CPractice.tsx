import React, { ChangeEvent, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import {
  FiPlay,
  FiRotateCw,
  FiBookmark,
  FiSearch,
  FiClock,
  FiPause,
} from "react-icons/fi";
import { usePracticeTimer } from "../../hooks/usePracticeTimer";
import { useDarkMode } from "../Custom/DarkModeContext";
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
  // ---------- BEGINNER ----------
  {
    id: 1,
    title: "Hello World",
    explanation: "Print 'Hello World' to the console.",
    level: "Beginner",
    tags: ["basics", "output"],
    code: `#include <stdio.h>
int main() {
    printf("Hello World\\n");
    return 0;
}`,
    expectedOutput: "Hello World",
    topic: "Basics",
  },
  {
    id: 2,
    title: "Sum of Two Numbers",
    explanation: "Read two integers from the user and print their sum.",
    level: "Beginner",
    tags: ["input", "sum", "basics"],
    code: `#include <stdio.h>
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}`,
    expectedOutput: "If input is 3 and 4, output will be: 7",
    topic: "Basics",
  },
  {
    id: 3,
    title: "Even or Odd",
    explanation: "Check if a given number is even or odd.",
    level: "Beginner",
    tags: ["conditionals"],
    code: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    if(n % 2 == 0)
        printf("Even\\n");
    else
        printf("Odd\\n");
    return 0;
}`,
    expectedOutput: "If input is 5 → Odd",
    topic: "Conditionals",
  },
  {
    id: 4,
    title: "Factorial",
    explanation: "Find factorial of a number using loop.",
    level: "Beginner",
    tags: ["loops", "math"],
    code: `#include <stdio.h>
int main() {
    int n, i;
    unsigned long long fact = 1;
    scanf("%d", &n);
    for(i = 1; i <= n; ++i)
        fact *= i;
    printf("%llu\\n", fact);
    return 0;
}`,
    expectedOutput: "If input is 5 → 120",
    topic: "Loops",
  },
  {
    id: 5,
    title: "Fibonacci Series",
    explanation: "Print first n Fibonacci numbers.",
    level: "Beginner",
    tags: ["loops", "series"],
    code: `#include <stdio.h>
int main() {
    int n, t1 = 0, t2 = 1, nextTerm;
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) {
        printf("%d ", t1);
        nextTerm = t1 + t2;
        t1 = t2;
        t2 = nextTerm;
    }
    return 0;
}`,
    expectedOutput: "If input is 5 → 0 1 1 2 3",
    topic: "Loops",
  },

  // ---------- INTERMEDIATE ----------
  {
    id: 6,
    title: "Palindrome String",
    explanation: "Check if a string is a palindrome.",
    level: "Intermediate",
    tags: ["strings"],
    code: `#include <stdio.h>
#include <string.h>
int main() {
    char str[100];
    scanf("%s", str);
    int len = strlen(str);
    int isPal = 1;
    for(int i = 0; i < len/2; i++) {
        if(str[i] != str[len-i-1]) {
            isPal = 0;
            break;
        }
    }
    if(isPal) printf("Palindrome\\n");
    else printf("Not Palindrome\\n");
    return 0;
}`,
    expectedOutput: "If input is madam → Palindrome",
    topic: "Strings",
  },
  {
    id: 7,
    title: "Reverse an Array",
    explanation: "Reverse the elements of an array.",
    level: "Intermediate",
    tags: ["arrays"],
    code: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    for(int i = 0; i < n; i++)
        scanf("%d", &arr[i]);
    for(int i = n-1; i >= 0; i--)
        printf("%d ", arr[i]);
    return 0;
}`,
    expectedOutput: "If input is 1 2 3 4 → 4 3 2 1",
    topic: "Arrays",
  },
  {
    id: 8,
    title: "Prime Number Check",
    explanation: "Check if a number is prime.",
    level: "Intermediate",
    tags: ["math"],
    code: `#include <stdio.h>
int main() {
    int n, i, flag = 0;
    scanf("%d", &n);
    for(i = 2; i <= n/2; i++) {
        if(n % i == 0) {
            flag = 1;
            break;
        }
    }
    if(n <= 1) flag = 1;
    if(flag == 0) printf("Prime\\n");
    else printf("Not Prime\\n");
    return 0;
}`,
    expectedOutput: "If input is 7 → Prime",
    topic: "Math",
  },
  {
    id: 9,
    title: "Matrix Addition",
    explanation: "Add two matrices.",
    level: "Intermediate",
    tags: ["matrices"],
    code: `#include <stdio.h>
int main() {
    int a[2][2], b[2][2], sum[2][2];
    for(int i=0;i<2;i++)
        for(int j=0;j<2;j++)
            scanf("%d",&a[i][j]);
    for(int i=0;i<2;i++)
        for(int j=0;j<2;j++)
            scanf("%d",&b[i][j]);
    for(int i=0;i<2;i++)
        for(int j=0;j<2;j++) {
            sum[i][j] = a[i][j] + b[i][j];
            printf("%d ", sum[i][j]);
        }
    return 0;
}`,
    expectedOutput: "Matrix sum printed row-wise",
    topic: "Matrices",
  },
  {
    id: 10,
    title: "Count Vowels",
    explanation: "Count the number of vowels in a string.",
    level: "Intermediate",
    tags: ["strings"],
    code: `#include <stdio.h>
#include <string.h>
#include <ctype.h>
int main() {
    char str[100];
    scanf("%s", str);
    int count = 0;
    for(int i = 0; i < strlen(str); i++) {
        char c = tolower(str[i]);
        if(c=='a'||c=='e'||c=='i'||c=='o'||c=='u') count++;
    }
    printf("%d\\n", count);
    return 0;
}`,
    expectedOutput: "If input is hello → 2",
    topic: "Strings",
  },

  // ---------- ADVANCED ----------
  {
    id: 11,
    title: "Binary Search",
    explanation: "Perform binary search on a sorted array.",
    level: "Advanced",
    tags: ["searching", "arrays"],
    code: `#include <stdio.h>
int main() {
    int n, key;
    scanf("%d", &n);
    int arr[n];
    for(int i = 0; i < n; i++)
        scanf("%d", &arr[i]);
    scanf("%d", &key);
    int low = 0, high = n - 1, mid;
    while(low <= high) {
        mid = (low + high) / 2;
        if(arr[mid] == key) {
            printf("Found at index %d\\n", mid);
            return 0;
        } else if(arr[mid] < key)
            low = mid + 1;
        else
            high = mid - 1;
    }
    printf("Not Found\\n");
    return 0;
}`,
    expectedOutput: "If array is 1 2 3 4 5 and key=4 → Found at index 3",
    topic: "Searching",
  },
  {
    id: 12,
    title: "Merge Sort",
    explanation: "Sort an array using merge sort.",
    level: "Advanced",
    tags: ["sorting", "recursion"],
    code: `#include <stdio.h>
void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for(int i=0;i<n1;i++) L[i]=arr[l+i];
    for(int j=0;j<n2;j++) R[j]=arr[m+1+j];
    int i=0,j=0,k=l;
    while(i<n1 && j<n2) {
        if(L[i]<=R[j]) arr[k++]=L[i++];
        else arr[k++]=R[j++];
    }
    while(i<n1) arr[k++]=L[i++];
    while(j<n2) arr[k++]=R[j++];
}
void mergeSort(int arr[], int l, int r) {
    if(l<r) {
        int m=(l+r)/2;
        mergeSort(arr,l,m);
        mergeSort(arr,m+1,r);
        merge(arr,l,m,r);
    }
}
int main() {
    int n;
    scanf("%d",&n);
    int arr[n];
    for(int i=0;i<n;i++) scanf("%d",&arr[i]);
    mergeSort(arr,0,n-1);
    for(int i=0;i<n;i++) printf("%d ",arr[i]);
    return 0;
}`,
    expectedOutput: "Sorted array",
    topic: "Sorting",
  },
  {
    id: 13,
    title: "Linked List Insertion",
    explanation: "Insert a node at the end of a linked list.",
    level: "Advanced",
    tags: ["linked list", "data structures"],
    code: `#include <stdio.h>
#include <stdlib.h>
struct Node {
    int data;
    struct Node* next;
};
void insertEnd(struct Node** head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = NULL;
    if(*head == NULL) {
        *head = newNode;
        return;
    }
    struct Node* temp = *head;
    while(temp->next != NULL) temp = temp->next;
    temp->next = newNode;
}
void printList(struct Node* node) {
    while(node != NULL) {
        printf("%d ", node->data);
        node = node->next;
    }
}
int main() {
    struct Node* head = NULL;
    insertEnd(&head, 10);
    insertEnd(&head, 20);
    insertEnd(&head, 30);
    printList(head);
    return 0;
}`,
    expectedOutput: "10 20 30",
    topic: "Data Structures",
  },
  {
    id: 14,
    title: "DFS Graph Traversal",
    explanation: "Perform DFS traversal on a graph.",
    level: "Advanced",
    tags: ["graphs", "recursion"],
    code: `#include <stdio.h>
#define V 4
void dfs(int graph[V][V], int visited[V], int node) {
    printf("%d ", node);
    visited[node] = 1;
    for(int i = 0; i < V; i++)
        if(graph[node][i] && !visited[i])
            dfs(graph, visited, i);
}
int main() {
    int graph[V][V] = {
        {0,1,1,0},
        {1,0,1,1},
        {1,1,0,0},
        {0,1,0,0}
    };
    int visited[V] = {0};
    dfs(graph, visited, 0);
    return 0;
}`,
    expectedOutput: "0 1 2 3 (order may vary)",
    topic: "Graphs",
  },
  {
    id: 15,
    title: "Dynamic Memory Allocation",
    explanation: "Allocate memory dynamically for an array.",
    level: "Advanced",
    tags: ["memory", "pointers"],
    code: `#include <stdio.h>
#include <stdlib.h>
int main() {
    int n;
    scanf("%d", &n);
    int *arr = (int*)malloc(n * sizeof(int));
    for(int i = 0; i < n; i++) {
        arr[i] = i + 1;
        printf("%d ", arr[i]);
    }
    free(arr);
    return 0;
}`,
    expectedOutput: "If input is 5 → 1 2 3 4 5",
    topic: "Pointers",
  },
];

export default function CPractice(): React.ReactElement {
  const { darkMode } = useDarkMode();
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

  // Timer hook - 30 minutes for code practice
  const {
    remainingTime,
    isRunning,
    isExpired,
    formatTime,
    startTimer,
    pauseTimer,
  } = usePracticeTimer({
    duration: 1800, // 30 minutes
    autoStart: true, // Start automatically
    onTimeUp: () => {
      alert(
        "Practice time is up! You can continue practicing or take a break."
      );
    },
  });

  const levels: ("All" | Level)[] = [
    "All",
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

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
    // Simulate running code and show expectedOutput (you can replace this with real runner if you want)
    setOutputs((prev) => ({
      ...prev,
      [id]: `> Running (simulated)\n${q.expectedOutput || "No output"}`,
    }));
  };

  const resetCode = (id: number) => {
    const q = QUESTIONS.find((x) => x.id === id);
    if (!q) return;
    setCodeMap((prev) => ({ ...prev, [id]: q.code }));
    setOutputs((prev) => ({ ...prev, [id]: "" }));
  };

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const bgPage = darkMode
    ? "bg-gradient-to-b from-gray-900 to-black text-white"
    : "bg-white text-gray-900";
  const inputBg = darkMode
    ? "bg-gray-800 text-gray-100"
    : "bg-gray-100 text-gray-900";
  const btnBg = darkMode
    ? "bg-gray-800 text-gray-200"
    : "bg-gray-200 text-gray-900";
  const borderGray = darkMode ? "border-gray-700" : "border-gray-300";
  const outputBg = darkMode
    ? "bg-black bg-opacity-50 border-gray-800 text-gray-100"
    : "bg-gray-100 border-gray-300 text-gray-900";

  const explanationText = darkMode ? "text-gray-300" : "text-gray-700";
  return React.createElement(
    "div",
    { className: `min-h-screen p-6 ` }, // ✅ dynamic page bg
    React.createElement(
      "div",
      { className: "max-w-5xl mx-auto" },
      React.createElement(
        "h1",
        {
          className: `text-4xl font-extrabold mb-4 text-center ${
            darkMode ? "text-indigo-300" : "text-indigo-600"
          }`,
        },
        "C Practice Hub"
      ),

      // Timer Display
      React.createElement(
        "div",
        { className: "flex items-center justify-center gap-4 mb-6" },

        // Timer Display
        React.createElement(
          "div",
          {
            className: `flex items-center gap-2 px-4 py-2 rounded-lg ${
              remainingTime <= 600
                ? darkMode
                  ? "bg-red-900/30 text-red-400"
                  : "bg-red-100 text-red-600"
                : remainingTime <= 1200
                ? darkMode
                  ? "bg-yellow-900/30 text-yellow-500"
                  : "bg-yellow-100 text-yellow-600"
                : darkMode
                ? "bg-green-900/30 text-green-400"
                : "bg-green-100 text-green-600"
            }`,
          },
          React.createElement(FiClock, { size: 18 }),
          React.createElement(
            "span",
            { className: "font-mono text-lg" },
            formatTime()
          )
        ),

        // Start/Pause Button
        React.createElement(
          "button",
          {
            onClick: isRunning ? pauseTimer : startTimer,
            className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              darkMode
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`,
            disabled: isExpired,
          },
          React.createElement(isRunning ? FiPause : FiPlay, { size: 16 }),
          React.createElement("span", {}, isRunning ? "Pause" : "Resume")
        ),

        // Expired Notice
        isExpired &&
          React.createElement(
            "div",
            {
              className: darkMode
                ? "text-red-400 font-semibold"
                : "text-red-600 font-semibold",
            },
            "⏰ Practice time is up!"
          )
      ),
      // Controls container

      React.createElement(
        "div",
        {
          className:
            "flex flex-col sm:flex-row gap-3 items-center justify-between mb-6",
        },
        // Search input with icon
        React.createElement(
          "div",
          {
            className: `flex items-center gap-2 px-3 py-2 rounded-lg border w-full sm:w-auto transition-colors duration-500 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300 shadow-sm"
            }`,
          },
          React.createElement(FiSearch, {
            className: darkMode ? "text-gray-400" : "text-gray-500",
          }),
          React.createElement("input", {
            value: query,
            onChange: (e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value),
            placeholder: "Search by keyword, topic, or tag...",
            className: `bg-transparent outline-none text-sm w-64 transition-colors duration-500 ${
              darkMode
                ? "text-gray-100 placeholder-gray-400"
                : "text-gray-800 placeholder-gray-500"
            }`,
          })
        ),

        // Filter buttons
        React.createElement(
          "div",
          { className: "flex gap-2" },
          levels.map((lv) =>
            React.createElement(
              "button",
              {
                key: lv,
                onClick: () => setFilter(lv),
                className: `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-500 ${
                  filter === lv
                    ? darkMode
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-indigo-500 text-white shadow-md"
                    : darkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`,
              },
              lv
            )
          )
        )
      ),
      // Questions list container
      React.createElement(
        "div",
        { className: "space-y-4" },
        filtered.length === 0 &&
          React.createElement(
            "div",
            {
              className: `text-center py-8 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`,
            },
            "No questions found."
          ),
        filtered.map((q) =>
          React.createElement(
            "div",
            {
              key: q.id,
              className:
                "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/80 dark:to-gray-700/80 p-4 rounded-2xl border border-gray-300 dark:border-gray-600 shadow-sm",
            },
            React.createElement(
              "div",
              { className: "flex items-start justify-between gap-3" },
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "div",
                  { className: "flex items-center gap-3 flex-wrap" },
                  // Title
                  React.createElement(
                    "span",
                    {
                      className:
                        "text-lg font-semibold text-indigo-700 dark:text-indigo-200",
                    },
                    q.title
                  ),
                  // Level badge
                  React.createElement(
                    "span",
                    {
                      className: `text-xs font-semibold px-2 py-1 rounded-full ${
                        q.level === "Beginner"
                          ? "bg-green-500 text-white dark:bg-green-600"
                          : q.level === "Intermediate"
                          ? "bg-yellow-500 text-white dark:bg-yellow-600"
                          : "bg-red-500 text-white dark:bg-red-600"
                      }`,
                    },
                    q.level
                  ),
                  // Topic
                  q.topic &&
                    React.createElement(
                      "span",
                      {
                        className:
                          "text-xs text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800/50 px-2 py-0.5 rounded",
                      },
                      q.topic
                    ),
                  // Tags
                  q.tags &&
                    q.tags.length > 0 &&
                    React.createElement(
                      "div",
                      { className: "ml-2 flex flex-wrap gap-2" },
                      q.tags.slice(0, 3).map((t) =>
                        React.createElement(
                          "span",
                          {
                            key: t,
                            className:
                              "text-xs text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800/50 px-2 py-0.5 rounded",
                          },
                          t
                        )
                      )
                    )
                ),
                // Explanation
                React.createElement(
                  "p",
                  {
                    className:
                      "text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2",
                  },
                  q.explanation
                )
              ),

              React.createElement(
                "div",
                { className: "flex flex-col items-end gap-2" },
                React.createElement(
                  "div",
                  { className: "flex items-center gap-2" },
                  React.createElement(
                    "button",
                    {
                      onClick: () => toggleBookmark(q.id),
                      title: bookmarks.includes(q.id)
                        ? "Remove Bookmark"
                        : "Bookmark",
                      className: `p-2 rounded-md ${btnBg} hover:opacity-80 transition-colors`,
                    },
                    React.createElement(FiBookmark, {
                      className: bookmarks.includes(q.id)
                        ? "text-yellow-500"
                        : darkMode
                        ? "text-gray-300"
                        : "text-gray-600",
                    })
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () =>
                        setExpandedId((id) => (id === q.id ? null : q.id)),
                      className: `p-2 rounded-md ${btnBg} hover:opacity-80 transition-colors`,
                    },
                    React.createElement(FiRotateCw, {
                      className: darkMode ? "text-gray-200" : "text-gray-700",
                    })
                  )
                )
              )
            ),

            // Expanded area with editor and buttons
            expandedId === q.id &&
              React.createElement(
                "div",
                { className: "mt-4" },
                React.createElement(
                  "div",
                  {
                    className: `border ${borderGray} rounded-lg overflow-hidden`,
                  },
                  React.createElement(CodeMirror, {
                    value: codeMap[q.id],
                    height: "200px",
                    extensions: [cpp()],
                    theme: darkMode ? "dark" : "light",
                    onChange: (v) =>
                      setCodeMap((prev) => ({ ...prev, [q.id]: v || "" })),
                  })
                ),

                React.createElement(
                  "div",
                  { className: "flex flex-wrap gap-3 items-center mt-3" },
                  // Run Code Button
                  React.createElement(
                    "button",
                    {
                      onClick: () => runCode(q.id),
                      className:
                        "inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 rounded-md text-white font-semibold hover:opacity-90 transition",
                    },
                    React.createElement(FiPlay, null),
                    " Run Code"
                  ),

                  // Reset Button
                  React.createElement(
                    "button",
                    {
                      onClick: () => resetCode(q.id),
                      className: `inline-flex items-center gap-2 ${btnBg} border ${borderGray} px-3 py-2 rounded-md font-medium hover:opacity-80 transition`,
                    },
                    React.createElement(FiRotateCw, null),
                    " Reset"
                  ),

                  // Question ID
                  React.createElement(
                    "div",
                    {
                      className: `ml-auto text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`,
                    },
                    "Question ID: ",
                    q.id
                  )
                ),

                // Output section
                React.createElement(
                  "div",
                  { className: `mt-3 rounded-md p-3 text-sm ${outputBg}` },
                  React.createElement(
                    "div",
                    {
                      className: `font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`,
                    },
                    "Output"
                  ),
                  React.createElement(
                    "pre",
                    { className: "whitespace-pre-wrap text-xs leading-5" },
                    outputs[q.id] || "— No output yet —"
                  )
                ),

                // Explanation
                React.createElement(
                  "div",
                  {
                    className: `mt-3 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`,
                  },
                  React.createElement(
                    "strong",
                    {
                      className: darkMode
                        ? "text-indigo-200"
                        : "text-indigo-600",
                    },
                    "Explanation:"
                  ),
                  React.createElement("p", { className: "mt-1" }, q.explanation)
                )
              )
          )
        )
      )
    )
  );
}
