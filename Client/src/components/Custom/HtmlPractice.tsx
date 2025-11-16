import React, { useState } from "react";
import { FiRefreshCw, FiBookmark } from "react-icons/fi";
import { useDarkMode } from "../Custom/DarkModeContext"; 
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface Question {
  id: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  code: string;
}

const htmlQuestions: Question[] = [
  {
    id: 1,
    title: "Basic HTML Structure",
    difficulty: "Beginner",
    tags: ["basics", "html"],
    description: "Write the basic HTML5 structure.",
    code: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>`
  },
  {
    id: 2,
    title: "HTML Paragraph",
    difficulty: "Beginner",
    tags: ["text", "paragraph"],
    description: "Create a paragraph with some text.",
    code: `<p>This is a paragraph of text.</p>`
  },
  {
    id: 3,
    title: "Image Tag",
    difficulty: "Beginner",
    tags: ["image", "media"],
    description: "Display an image from a URL.",
    code: `<img src="https://via.placeholder.com/150" alt="Placeholder">`
  },
  {
    id: 4,
    title: "Link Tag",
    difficulty: "Beginner",
    tags: ["link", "anchor"],
    description: "Create a clickable link to example.com.",
    code: `<a href="https://example.com" target="_blank">Visit Example</a>`
  },
  {
    id: 5,
    title: "Unordered List",
    difficulty: "Beginner",
    tags: ["list", "ul"],
    description: "Create an unordered list of 3 items.",
    code: `<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>`
  },
  {
    id: 6,
    title: "Ordered List",
    difficulty: "Beginner",
    tags: ["list", "ol"],
    description: "Create an ordered list of 3 items.",
    code: `<ol>
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ol>`
  },
  {
    id: 7,
    title: "HTML Table",
    difficulty: "Intermediate",
    tags: ["table", "data"],
    description: "Create a table with 2 rows and 2 columns.",
    code: `<table border="1">
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
  </tr>
  <tr>
    <td>Row 1 Col 1</td>
    <td>Row 1 Col 2</td>
  </tr>
</table>`
  },
  {
    id: 8,
    title: "HTML Form",
    difficulty: "Intermediate",
    tags: ["form", "input"],
    description: "Create a form with a text input and submit button.",
    code: `<form>
  <input type="text" placeholder="Enter name">
  <button type="submit">Submit</button>
</form>`
  },
  {
    id: 9,
    title: "HTML Button",
    difficulty: "Beginner",
    tags: ["button", "click"],
    description: "Create a clickable button.",
    code: `<button>Click Me</button>`
  },
  {
    id: 10,
    title: "HTML Video",
    difficulty: "Intermediate",
    tags: ["video", "media"],
    description: "Embed a video from a URL.",
    code: `<video controls width="300">
  <source src="video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>`
  },
  {
    id: 11,
    title: "HTML Audio",
    difficulty: "Intermediate",
    tags: ["audio", "media"],
    description: "Embed an audio file.",
    code: `<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  Your browser does not support the audio tag.
</audio>`
  },
  {
    id: 12,
    title: "HTML Iframe",
    difficulty: "Intermediate",
    tags: ["iframe", "embed"],
    description: "Embed an external website using an iframe.",
    code: `<iframe src="https://example.com" width="300" height="200"></iframe>`
  },
  {
    id: 13,
    title: "HTML Span",
    difficulty: "Beginner",
    tags: ["span", "inline"],
    description: "Use span to style part of text.",
    code: `<p>This is <span style="color:red;">red text</span>.</p>`
  },
  {
    id: 14,
    title: "HTML Div",
    difficulty: "Beginner",
    tags: ["div", "block"],
    description: "Use a div container with background color.",
    code: `<div style="background:lightblue; padding:10px;">
  This is a div.
</div>`
  },
  {
    id: 15,
    title: "HTML Input Types",
    difficulty: "Intermediate",
    tags: ["form", "input"],
    description: "Show different types of input fields.",
    code: `<input type="text" placeholder="Text"><br>
<input type="number" placeholder="Number"><br>
<input type="email" placeholder="Email">`
  },
  {
    id: 16,
    title: "HTML Select Dropdown",
    difficulty: "Intermediate",
    tags: ["select", "dropdown"],
    description: "Create a dropdown list.",
    code: `<select>
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
</select>`
  },
  {
    id: 17,
    title: "HTML Checkbox",
    difficulty: "Beginner",
    tags: ["checkbox", "form"],
    description: "Add a checkbox input.",
    code: `<input type="checkbox" id="check1">
<label for="check1">Check me</label>`
  },
  {
    id: 18,
    title: "HTML Radio Buttons",
    difficulty: "Beginner",
    tags: ["radio", "form"],
    description: "Create two radio buttons.",
    code: `<input type="radio" name="choice" value="1"> Option 1<br>
<input type="radio" name="choice" value="2"> Option 2`
  },
  {
    id: 19,
    title: "HTML Progress Bar",
    difficulty: "Advanced",
    tags: ["progress", "form"],
    description: "Add a progress bar.",
    code: `<progress value="70" max="100"></progress>`
  },
  {
    id: 20,
    title: "HTML Semantic Tags",
    difficulty: "Advanced",
    tags: ["semantic", "html5"],
    description: "Use header, main, and footer tags.",
    code: `<header><h1>Title</h1></header>
<main><p>Main content here</p></main>
<footer><p>Footer text</p></footer>`
  }
];

const HtmlPractice: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [codeState, setCodeState] = useState<{ [key: number]: string }>(() =>
    htmlQuestions.reduce((acc, q) => ({ ...acc, [q.id]: q.code }), {})
  );
  const [showOutput, setShowOutput] = useState<{ [key: number]: boolean }>({});

  const filteredQuestions = htmlQuestions.filter((q) => {
    const matchesFilter = filter === "All" || q.difficulty === filter;
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

    
  const bgPage = darkMode ? "bg-gradient-to-b from-gray-900 to-black text-white" : "bg-white text-gray-900";
  const inputBg = darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900";
  const btnBg = darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-900";
  const codeBg = darkMode ? "bg-gray-900 text-green-400" : "bg-gray-100 text-green-700";
  const cardBg = darkMode ? "bg-gray-800" : "bg-gray-100";
  const borderGray = darkMode ? "border-gray-600" : "border-gray-300";

  return (
    <div className={`max-w-4xl mx-auto p-6 transition-colors duration-500 ${bgPage}`}>
      <h1 className={`text-center text-3xl font-bold mb-6 transition-colors duration-500 ${darkMode ? "text-purple-300" : "text-purple-600"}`}>
        HTML Practice Hub
      </h1>

      {/* Search & Filters */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        <input
          type="text"
          placeholder="Search by keyword, topic..."
          className={`px-4 py-2 rounded-lg focus:outline-none transition-colors duration-500 ${inputBg}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-4 py-2 rounded-lg transition-colors duration-500 ${
              filter === level ? "bg-purple-600 text-white" : btnBg
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className={`p-4 rounded-xl shadow-lg transition-colors duration-500 ${cardBg}`}
          >
            {/* Title Row */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className={`font-semibold text-lg transition-colors duration-500 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {q.title}
                </h2>
                <span className={`px-2 py-1 rounded-full text-xs ${q.difficulty === "Beginner" ? "bg-green-600" : q.difficulty === "Intermediate" ? "bg-yellow-600" : "bg-red-600"}`}>
                  {q.difficulty}
                </span>
                <div className={`text-sm mt-1 transition-colors duration-500 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                  {q.tags.join(", ")}
                </div>
              </div>

              <div className="flex gap-3 text-gray-400">
                <FiBookmark className="cursor-pointer hover:text-white transition-colors duration-300" />
                <FiRefreshCw
                  className="cursor-pointer hover:text-white transition-colors duration-300"
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [q.id]: !prev[q.id]
                    }))
                  }
                />
              </div>
            </div>

            {/* Expanded View */}
            {expanded[q.id] && (
              <div className="mt-4">
                {/* Show Output */}
                {showOutput[q.id] && (
                  <div className={`mb-4 border rounded-lg overflow-hidden transition-colors duration-500 ${borderGray} ${darkMode ? "bg-black" : "bg-white"}`}>
                    <iframe
                      title={`output-${q.id}`}
                      srcDoc={codeState[q.id]}
                      sandbox="allow-scripts allow-same-origin"
                      style={{ width: "100%", height: "200px" }}
                    />
                  </div>
                )}

                {/* Code Editor */}
                <textarea
                  className={`w-full h-40 p-3 rounded-lg font-mono text-sm transition-colors duration-500 ${codeBg}`}
                  value={codeState[q.id]}
                  onChange={(e) =>
                    setCodeState((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                />

                {/* Buttons */}
                <div className="flex gap-3 mt-3">
                  <button
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
                    onClick={() =>
                      setShowOutput((prev) => ({ ...prev, [q.id]: true }))
                    }
                  >
                    ▶ Run Code
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors duration-300 ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-900"}`}
                    onClick={() => {
                      setCodeState((prev) => ({
                        ...prev,
                        [q.id]: htmlQuestions.find((item) => item.id === q.id)?.code || ""
                      }));
                      setShowOutput((prev) => ({ ...prev, [q.id]: false }));
                    }}
                  >
                    ✖ Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default HtmlPractice;