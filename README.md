
📊 DataGrid Component – Virtualized, Sortable, Editable

A fully customizable and performant DataGrid component built with:

⚛️ React

🟦 TypeScript

⚡ Vite

🎨 Tailwind CSS

📚 Storybook (for UI testing & Chromatic)

Supports:

Column sorting (single & multi-sort)

Inline editing

Virtualized rendering (large datasets)

Custom column definitions

Type-safe generics

datagrid-project/
│
├── frontend/          # React + TS DataGrid
│   ├── src/
│   ├── stories/
│   └── package.json
│
├── backend/           # Optional API (Node/Express)
│   ├── server.ts
│   └── package.json
│
└── README.md


🖥️ FRONTEND SETUP (React + Vite)
1️⃣ Navigate to frontend
cd frontend
2️⃣ Install dependencies
npm install
3️⃣ Run development server
npm run dev




📚 Run Storybook (Required for Chromatic)
Start Storybook
npm run storybook



🏗️ Features Implemented
Feature	Status
Virtual Scrolling	
Column Sorting	
Multi-Sorting	
Inline Editing	
Type-safe Generics	
Custom Cell Renderer	

🧠 Performance Notes

Uses virtualization to render only visible rows.

Sorting is memoized to avoid unnecessary re-renders.

Generic types ensure full type safety.

Optimized for large datasets (50,000+ rows).
