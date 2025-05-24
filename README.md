# 🎓 MCQgram

> A competitive exam preparation platform built with **React**, **Vite**, and **Tailwind CSS**

This project helps students prepare for competitive exams by providing a structured UI with features like test pages, result tracking, and responsive layouts.

---
## Instruction 


- ✅ Installation instructions for all OS (Linux, Windows, macOS)
- 📁 Project structure explanation
- 🧪 How to run the app locally
- ☁️ How to deploy on GitHub Pages
- 📝 Contributing & license notes

---

## 📦 Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (>= 18.x recommended)
- npm (comes with Node.js)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aspirant-ai/mcqgram.git
cd mcqgram
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 4. Build for production

```bash
npm run build
```

Builds the app into the `dist/` folder.

---

### 5. Preview the production build

```bash
npm run preview
```

Runs a local static server to test the production build.

---

## 📁 Project Structure

```
mcqgram/
├── public/                     # Static assets (not processed by Vite)
│   └── .htaccess               # Apache config for Hostinger hosting
├── src/
│   ├── components/
│   │   ├── test/               # Components specific to test-taking flow
│   │   │   ├── NavigationPanel.jsx    # Side navigation during test
│   │   │   ├── QuestionPanel.jsx      # Displays current question
│   │   │   ├── SubmitDialog.jsx       # Confirmation dialog before submitting
│   │   │   ├── TestFooter.jsx         # Footer with actions during test
│   │   │   ├── TestHeader.jsx         # Header with timer, title
│   │   │   └── TimeUpDialog.jsx       # Dialog when time runs out
│   │   └── ui/                 # Reusable UI components using Radix UI
│   │       ├── avatar.jsx
│   │       ├── button.jsx
│   │       ├── checkbox.jsx
│   │       ├── dialog.jsx
│   │       ├── label.jsx
│   │       ├── progress.jsx
│   │       ├── radio-group.jsx
│   │       ├── select.jsx
│   │       ├── tabs.jsx
│   │       ├── textarea.jsx
│   │       ├── toast.jsx
│   │       ├── toaster.jsx
│   │       └── use-toast.js    # Custom hook for displaying toast messages
│   ├── layouts/                # Layout wrappers used across pages
│   │   ├── MainLayout.jsx      # Layout with header/sidebar (default layout)
│   │   ├── MinimalLayout.jsx   # Simple layout (e.g., login/signup pages)
│   │   └── TestLayout.jsx      # Special layout for full-screen test view
│   ├── lib/
│   │   ├── data/               # Mock or API data files
│   │   │   ├── examData.js     # Contains categories, exams, questions
│   │   │   └── userAttempts.js # Stores user's previous test attempts
│   │   ├── data.js             # Common exports from all data files
│   │   └── utils.js            # Utility functions (formatting dates, etc.)
│   ├── pages/                  # Page-level components
│   │   ├── ClassesPage.jsx
│   │   ├── CurrentAffairsPage.jsx
│   │   ├── DoubtForumPage.jsx
│   │   ├── EditProfilePage.jsx
│   │   ├── ExamCategoriesPage.jsx
│   │   ├── ExamListPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LiveTestsPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFoundPage.jsx    # 404 page
│   │   ├── ProfilePage.jsx
│   │   ├── ResultPage.jsx
│   │   ├── SolutionPage.jsx
│   │   ├── StudyMaterialPage.jsx
│   │   ├── SubscriptionPage.jsx
│   │   ├── TestInstructionsPage.jsx
│   │   └── TestPage.jsx        # Main test-taking page
│   ├── App.jsx                 # Main routing component using react-router-dom
│   ├── index.css               # Tailwind base styles
│   └── main.jsx                # Entry point of the app (renders <App />)
├── .nvmrc                      # Specifies Node version for nvm (Node Version Manager)
├── index.html                  # Vite root HTML file
├── package.json
├── package-lock.json
├── postcss.config.js           # PostCSS config for Tailwind
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

---

## 💡 Key Libraries Used

| Package | Purpose |
|--------|---------|
| `react`, `react-dom` | Core React libraries |
| `vite` | Lightning-fast build tool |
| `react-router-dom` | Client-side routing |
| `tailwindcss` | Utility-first CSS framework |
| `radix-ui/react-*` | Accessible UI primitives |
| `lucide-react` | Beautiful icons |
| `framer-motion` | Animations |
| `clsx`, `tailwind-merge`, `class-variance-authority` | Conditional class utilities |

---

## 🌐 Deploying to GitHub Pages

### 1. Install `gh-pages` package

```bash
npm install gh-pages --save-dev
```

### 2. Add these scripts to `package.json`

```json
"scripts": {
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "vite build && gh-pages -d dist"
}
```

### 3. Set `homepage` field in `package.json`

```json
"homepage": "https://Aspirant-ai.github.io/mcqgram"
```

### 4. Deploy to GitHub Pages

```bash
npm run deploy
```

After deployment, your site will be live at:
```
https://Aspirant-ai.github.io/mcqgram
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guide](CONTRIBUTING.md) before opening a pull request.

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

If you have any questions or suggestions, feel free to open an issue or reach out via email.

---
