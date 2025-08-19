const questionsData = [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswer: "O(log n)",
    },
    {
      id: 2,
      question: "Which data structure uses LIFO (Last In First Out)?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      correctAnswer: "Stack",
    },
    {
      id: 3,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Machine Learning",
        "Home Tool Markup Language",
        "Hyperlink Text Management Logic",
      ],
      correctAnswer: "Hyper Text Markup Language",
    },
    {
      id: 4,
      question:
        "Which sorting algorithm has the worst-case time complexity of O(n²)?",
      options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
      correctAnswer: "Bubble Sort",
    },
    {
      id: 5,
      question: "What is the output of: console.log(typeof NaN)?",
      options: ["NaN", "undefined", "number", "object"],
      correctAnswer: "number",
    },
    {
      id: 6,
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["string", "boolean", "character", "object"],
      correctAnswer: "character",
    },
    {
      id: 7,
      question: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Sequential Question Language",
        "Standard Query Logic",
        "System Quality Link",
      ],
      correctAnswer: "Structured Query Language",
    },
    {
      id: 8,
      question: "Which HTTP status code represents 'Not Found'?",
      options: ["200", "404", "500", "301"],
      correctAnswer: "404",
    },
    {
      id: 9,
      question: "What is the correct way to declare a JavaScript variable?",
      options: ["v myVar;", "variable myVar;", "var myVar;", "int myVar;"],
      correctAnswer: "var myVar;",
    },
    {
      id: 10,
      question:
        "Which of these is NOT a valid way to create a function in JavaScript?",
      options: [
        "function myFunc() {}",
        "const myFunc = function() {}",
        "const myFunc = () => {}",
        "function = myFunc() {}",
      ],
      correctAnswer: "function = myFunc() {}",
    },
  ];

  export default questionsData;