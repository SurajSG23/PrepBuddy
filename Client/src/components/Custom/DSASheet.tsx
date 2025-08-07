import React, { useState } from 'react';
import { Star, Link2 } from 'lucide-react';

const dsaQuestions = [
  { topic: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum', title: 'Two Sum' },
  { topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters' },
  { topic: 'Linked List', difficulty: 'Hard', link: 'https://leetcode.com/problems/merge-k-sorted-lists', title: 'Merge K Sorted Lists' },
  { topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal', title: 'Binary Tree Level Order Traversal' },
  { topic: 'Stacks', difficulty: 'Medium', link: 'https://leetcode.com/problems/valid-parentheses', title: 'Valid Parentheses' },
  { topic: 'Graphs', difficulty: 'Hard', link: 'https://leetcode.com/problems/course-schedule', title: 'Course Schedule' },
  { topic: 'Recursion', difficulty: 'Easy', link: 'https://leetcode.com/problems/fibonacci-number', title: 'Fibonacci Number' },
  { topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber', title: 'House Robber' },
  { topic: 'Greedy', difficulty: 'Medium', link: 'https://leetcode.com/problems/jump-game', title: 'Jump Game' },
  { topic: 'Binary Search', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-search', title: 'Binary Search' },
];

const DSASheet = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const toggleBookmark = (title: string) => {
    setBookmarks((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const topics = ['All', ...Array.from(new Set(dsaQuestions.map(q => q.topic)))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredQuestions = dsaQuestions.filter(q =>
    (selectedTopic === 'All' || q.topic === selectedTopic) &&
    (selectedDifficulty === 'All' || q.difficulty === selectedDifficulty)
  );

  return (
    <div className="w-full min-h-screen px-4 py-10 bg-gradient-to-b from-gray-900 to-black text-white">
      <h2 className="text-4xl font-bold text-center text-indigo-400 mb-10 drop-shadow-md">
        📘 DSA Prep Sheet
      </h2>

      {/* Filters */}
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 mb-8">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {topics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {difficulties.map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto grid gap-6">
        {filteredQuestions.map((q, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-md border border-gray-600 rounded-xl p-6 hover:shadow-indigo-500/20 transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-indigo-300">{q.title}</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  q.difficulty === 'Easy'
                    ? 'bg-green-200 text-green-800'
                    : q.difficulty === 'Medium'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {q.difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">Topic: {q.topic}</p>
            <div className="flex items-center justify-between">
              <a
                href={q.link}
                target="_blank"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 underline"
                rel="noopener noreferrer"
              >
                <Link2 size={16} /> View on LeetCode
              </a>
              <button
                onClick={() => toggleBookmark(q.title)}
                className="text-yellow-400 hover:text-yellow-300 transition"
                title="Bookmark"
              >
                <Star
                  size={20}
                  className={bookmarks.includes(q.title) ? 'fill-yellow-400' : 'fill-none'}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSASheet;
