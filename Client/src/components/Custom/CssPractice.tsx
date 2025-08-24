import React, { useState } from "react";
import { FiRefreshCw, FiBookmark } from "react-icons/fi";
const cssQuestions = [
  {
    id: 1,
    title: "Change Background Color",
    difficulty: "Beginner",
    tags: ["background", "color"],
    description: "Set the background color of the page to lightblue.",
    css: `body {
  background-color: lightblue;
}`
  },
  {
    id: 2,
    title: "Center Text",
    difficulty: "Beginner",
    tags: ["text", "align"],
    description: "Center-align all text inside a div.",
    css: `div {
  text-align: center;
}`
  },
  {
    id: 3,
    title: "Rounded Corners",
    difficulty: "Beginner",
    tags: ["border", "radius"],
    description: "Give all images rounded corners with 15px radius.",
    css: `img {
  border-radius: 15px;
}`
  },
  {
    id: 4,
    title: "Text Color",
    difficulty: "Beginner",
    tags: ["color", "text"],
    description: "Make all paragraphs red.",
    css: `p {
  color: red;
}`
  },
  {
    id: 5,
    title: "Hover Effect",
    difficulty: "Beginner",
    tags: ["hover", "button"],
    description: "Change button background to green when hovered.",
    css: `button:hover {
  background-color: green;
  color: white;
}`
  },
  {
    id: 6,
    title: "Font Styling",
    difficulty: "Beginner",
    tags: ["font", "typography"],
    description: "Apply Arial font and bold text to all headings.",
    css: `h1, h2, h3 {
  font-family: Arial, sans-serif;
  font-weight: bold;
}`
  },
  {
    id: 7,
    title: "Box Shadow",
    difficulty: "Intermediate",
    tags: ["shadow", "box"],
    description: "Add shadow to all divs.",
    css: `div {
  box-shadow: 4px 4px 10px rgba(0,0,0,0.5);
}`
  },
  {
    id: 8,
    title: "Flexbox Centering",
    difficulty: "Intermediate",
    tags: ["flexbox", "layout"],
    description: "Use flexbox to center items inside a container.",
    css: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`
  },
  {
    id: 9,
    title: "CSS Grid Layout",
    difficulty: "Intermediate",
    tags: ["grid", "layout"],
    description: "Make a 2-column grid layout with equal width.",
    css: `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}`
  },
  {
    id: 10,
    title: "Underline Links",
    difficulty: "Beginner",
    tags: ["links", "text"],
    description: "Underline all anchor tags when hovered.",
    css: `a:hover {
  text-decoration: underline;
}`
  },
  {
    id: 11,
    title: "Fixed Navbar",
    difficulty: "Intermediate",
    tags: ["navbar", "position"],
    description: "Fix a navbar at the top of the page.",
    css: `.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: #333;
  color: white;
  padding: 10px;
}`
  },
  {
    id: 12,
    title: "Circle Shape",
    difficulty: "Intermediate",
    tags: ["circle", "shape"],
    description: "Make a div a perfect circle.",
    css: `.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: blue;
}`
  },
  {
    id: 13,
    title: "Gradient Background",
    difficulty: "Intermediate",
    tags: ["gradient", "background"],
    description: "Apply a linear gradient from red to yellow.",
    css: `body {
  background: linear-gradient(to right, red, yellow);
}`
  },
  {
    id: 14,
    title: "Responsive Image",
    difficulty: "Beginner",
    tags: ["responsive", "image"],
    description: "Make images scale responsively inside parent.",
    css: `img {
  max-width: 100%;
  height: auto;
}`
  },
  {
    id: 15,
    title: "Sticky Footer",
    difficulty: "Advanced",
    tags: ["footer", "sticky"],
    description: "Keep footer at bottom of viewport.",
    css: `footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #222;
  color: white;
  text-align: center;
}`
  },
  {
    id: 16,
    title: "CSS Transitions",
    difficulty: "Intermediate",
    tags: ["transition", "hover"],
    description: "Smoothly change button color on hover.",
    css: `button {
  background: blue;
  color: white;
  transition: background 0.3s;
}
button:hover {
  background: darkblue;
}`
  },
  {
    id: 17,
    title: "CSS Animation",
    difficulty: "Advanced",
    tags: ["animation", "keyframes"],
    description: "Animate a box moving left to right.",
    css: `.box {
  width: 50px;
  height: 50px;
  background: red;
  animation: move 2s infinite alternate;
}

@keyframes move {
  from { transform: translateX(0); }
  to { transform: translateX(200px); }
}`
  },
  {
    id: 18,
    title: "Z-Index Practice",
    difficulty: "Intermediate",
    tags: ["z-index", "layer"],
    description: "Make a div appear above others.",
    css: `.top {
  position: absolute;
  z-index: 10;
  background: yellow;
}`
  },
  {
    id: 19,
    title: "Custom Scrollbar",
    difficulty: "Advanced",
    tags: ["scrollbar", "custom"],
    description: "Style the scrollbar with custom colors.",
    css: `::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #222;
}
::-webkit-scrollbar-thumb {
  background: purple;
  border-radius: 5px;
}`
  },
  {
    id: 20,
    title: "Media Query",
    difficulty: "Advanced",
    tags: ["media", "responsive"],
    description: "Change background to pink on small screens.",
    css: `@media (max-width: 600px) {
  body {
    background: pink;
  }
}`
  }
];

const CssPractice: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [codeState, setCodeState] = useState<{ [key: number]: string }>(() =>
    cssQuestions.reduce((acc, q) => ({ ...acc, [q.id]: q.css }), {})
  );
  const [showOutput, setShowOutput] = useState<{ [key: number]: boolean }>({});

  const filteredQuestions = cssQuestions.filter((q) => {
    const matchesFilter = filter === "All" || q.difficulty === filter;
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-center text-3xl font-bold mb-6 text-purple-300">
        CSS Practice Hub
      </h1>

      {/* Search & Filters */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        <input
          type="text"
          placeholder="Search by keyword, topic..."
          className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-4 py-2 rounded-lg ${
              filter === level
                ? "bg-purple-600"
                : "bg-gray-700 hover:bg-gray-600"
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
            className="bg-gray-800 p-4 rounded-xl shadow-lg transition-all"
          >
            {/* Title Row */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg">{q.title}</h2>
                <span
                  className={`${
                    q.difficulty === "Beginner"
                      ? "bg-green-600"
                      : q.difficulty === "Intermediate"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  } text-xs px-2 py-1 rounded-full`}
                >
                  {q.difficulty}
                </span>
                <div className="text-gray-400 text-sm mt-1">
                  {q.tags.join(", ")}
                </div>
              </div>
              <div className="flex gap-3 text-gray-400">
                <FiBookmark className="cursor-pointer hover:text-white" />
                <FiRefreshCw
                  className="cursor-pointer hover:text-white"
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
                  <div className="mb-4 border border-gray-600 rounded-lg overflow-hidden bg-white">
                    <iframe
                      title={`output-${q.id}`}
                      srcDoc={`<html>
<head>
<style>
${codeState[q.id]}
</style>
</head>
<body>
  <h1>CSS Preview</h1>
  <p>This is a paragraph to test your CSS.</p>
  <img src="https://via.placeholder.com/150" alt="Sample" />
  <div style="padding: 10px; background: #eee;">Sample Box</div>
</body>
</html>`}
                      sandbox="allow-scripts allow-same-origin"
                      style={{ width: "100%", height: "200px" }}
                    />
                  </div>
                )}

                {/* Code Editor */}
                <textarea
                  className="w-full h-40 p-3 rounded-lg bg-gray-900 text-green-400 font-mono text-sm"
                  value={codeState[q.id]}
                  onChange={(e) =>
                    setCodeState((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                />

                {/* Buttons */}
                <div className="flex gap-3 mt-3">
                  <button
                    className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700"
                    onClick={() =>
                      setShowOutput((prev) => ({ ...prev, [q.id]: true }))
                    }
                  >
                    ▶ Run Code
                  </button>
                  <button
                    className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
                    onClick={() => {
                      setCodeState((prev) => ({
                        ...prev,
                        [q.id]: cssQuestions.find((item) => item.id === q.id)
                          ?.css || ""
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
};

export default CssPractice;
