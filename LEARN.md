# 📘 LEARN.md- PrepBuddy

Welcome to the **Learning Hub** for this project! Whether you're a beginner or looking to contribute more effectively, this document will help you understand the technologies used and guide you through helpful resources.

## 📑 Table of Contents

- [📌 Project Overview](#-project-overview)
- [📂 Folder Structure](#-folder-structure)
- [🔧 Overview of Technologies Used](#-overview-of-technologies-used)
- [📚 Beginner-Friendly Resources](#-beginner-friendly-resources)
  - [React + Vite + TypeScript](#react--vite--typescript)
  - [Tailwind CSS](#tailwind-css)
  - [ShadCN/UI & Lucide Icons](#shadcnui--lucide-icons)
  - [Axios](#axios)
  - [Node.js + Express](#nodejs--express)
  - [MongoDB + Mongoose](#mongodb--mongoose)
  - [Firebase Auth](#firebase-auth)
  - [Cloudinary + Multer](#cloudinary--multer)
- [💡 Tips or Guides Related to Using the Project](#-tips-or-guides-related-to-using-the-project)
- [🛠️ Troubleshooting Tips](#️-troubleshooting-tips)
- [🌸 GSSoC Notes](#-gssoc-notes)
- [🙌 Contributors](#-contributors)

## 📌 Project Overview

**PrepBuddy** is an educational web platform designed to help students and learners prepare for interviews, placements, and technical assessments. It combines a sleek and accessible frontend with a robust backend to deliver a seamless experience for users.

## 📂 Folder Structure

```
PrepBuddy/
├── .github/ # GitHub issue templates
│ └── ISSUE_TEMPLATE/
├── Client/ # Frontend (React + Vite + TypeScript)
│ ├── public/ # Static assets and PDFs (notes, icons)
│ ├── lib/ # Utility functions
│ ├── src/ # Main source code
│ │ ├── assets/ # Static images like logos
│ │ ├── components/ # React components
│ │ │ ├── Custom/ # Main pages and UI logic
│ │ │ └── ui/ # Reusable UI elements (cards, buttons, effects)
│ │ ├── firebase/ # Firebase configuration
│ │ └── gemini/ # Gemini AI logic and prompt files
│ └── index.html, tsconfig*, etc.
├── Server/ # Backend (Node.js + Express)
│ ├── cloudinary/ # Image upload logic (Multer + Cloudinary)
│ ├── config/ # Database configuration (MongoDB)
│ ├── middleware/ # JWT authentication middleware
│ ├── models/ # Mongoose models for DB
│ └── routes/ # Express route handlers
├── CODE_OF_CONDUCT.md
├── LEARN.md
├── LICENSE
├── readme.md
├── package.json
└── package-lock.json
```

## 🔧 Overview of Technologies Used

Here’s a list of the main technologies and tools used in this project:

### 💻 Frontend
- **React + Vite (TypeScript)**: Fast and modern frontend framework with type safety.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **ShadCN/UI & Lucide Icons**: Prebuilt accessible UI components and icon set.
- **Axios**: For making HTTP requests from the frontend.

### 🖥️ Backend
- **Node.js + Express.js**: JavaScript runtime and web framework for building APIs.
- **MongoDB + Mongoose**: NoSQL database and ODM for schema modeling.
- **Firebase Auth**: Authentication service for secure user login.
- **Cloudinary + Multer**: For image uploads and storage.

## 📚 Beginner-Friendly Resources

Below are some helpful resources to get you started with the technologies used in this project:

### 🔹 React + Vite + TypeScript
- [React Docs](https://react.dev/learn)
- [TypeScript for Beginners](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Vite Docs](https://vitejs.dev/guide/)

### 🔹 Tailwind CSS
- [Tailwind CSS Docs](https://tailwindcss.com/docs/installation)
- [Tailwind Crash Course – YouTube](https://www.youtube.com/watch?v=UBOj6rqRUME)

### 🔹 ShadCN/UI & Lucide Icons
- [shadcn/ui Docs](https://ui.shadcn.dev/)
- [Lucide Icons](https://lucide.dev/)

### 🔹 Axios
- [Axios Docs](https://axios-http.com/docs/intro)

### 🔹 Node.js + Express
- [Node.js Docs](https://nodejs.org/en/docs)
- [Express Guide](https://expressjs.com/en/starter/installing.html)

### 🔹 MongoDB + Mongoose
- [MongoDB University](https://university.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)

### 🔹 Firebase Auth
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)

### 🔹 Cloudinary + Multer
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Multer GitHub](https://github.com/expressjs/multer)

## 💡 Tips or Guides Related to Using the Project

- Clone the repository and install dependencies using `npm install`.
- Make sure to configure `.env` file as per `.env.example` (if available).
- Run the frontend and backend in separate terminals.
- Use TypeScript properly; avoid using `any` when possible.
- Follow Tailwind CSS conventions for consistent design.
- When working with APIs, check for proper request/response structure.
- Always pull the latest changes from `main` before starting new work.

## 🛠️ Troubleshooting Tips

- ❗ If you face issues with package installations, try deleting `node_modules` and `package-lock.json`, then run `npm install` again.
- 🔥 Backend errors? Check your `.env` file and MongoDB URI configuration.
- 🌐 For frontend issues, make sure the backend is running and correct API endpoints are set.
- ⚙️ If Firebase throws an error, ensure your API keys and project config are correct.

## 🌸 GSSoC Notes

This project is part of **GirlScript Summer of Code 2025 (GSSoC'25)**.  
Whether you're a beginner or experienced contributor, this repo welcomes and encourages learning-by-doing.

- ✨ If you're contributing via GSSoC, make sure to:
- Comment on issues before starting work.
- Add meaningful commits and link your PR with the issue.

## 🙌 Contributors

Thanks to all the amazing contributors who help make this project better!

Ethical Reminder: This system is designed for responsible use. Do not deploy in real-world environments without proper legal permissions and privacy compliance.

🚫 Never store or share real user images or credentials publicly.