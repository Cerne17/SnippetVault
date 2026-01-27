# 🚀 SnippetVault

**SnippetVault** is a modern, full-stack code snippet management application designed to help developers store, organize, and quickly access their most used code blocks. Built with a focus on speed, security, and developer experience.

![Project Banner](https://img.shields.io/badge/Tech-MERN_Stack-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge)

---

## ✨ Features

-   **🔐 Secure Authentication**: Full JWT-based login and registration system.
-   **📝 Code Management**: Create, view, update, and (soft) delete code snippets.
-   **🎨 Syntax Highlighting**: Automatic highlighting for numerous programming languages.
-   **🏷️ Smart Tagging**: Organize snippets with custom tags for better categorization.
-   **🔍 Powerful Search**: Filter and search through your vault by title, language, or tags.
-   **⭐ Favorites**: Bookmark your most important snippets for instant access.
-   **📱 Modern UI/UX**: Responsive design built with React 19, Tailwind CSS 4, and Lucide Icons.
-   **☁️ Cloud Ready**: Optimized for Vercel Serverless deployment with MongoDB Atlas integration.

---

## 🏗️ Project Structure

The project is structured as a monorepo with separate directories for the backend and frontend:

-   [**`snippet-vault-backend/`**](file:///Users/miguelcerne/Documents/projects/SnippetVault/snippet-vault-backend): NestJS API powered by MongoDB & Mongoose.
-   [**`snippet-vault-frontend/`**](file:///Users/miguelcerne/Documents/projects/SnippetVault/snippet-vault-frontend): React 19 SPA built with Vite and Tailwind CSS.

---

## 🛠️ Technology Stack

### Backend
-   **Framework**: [NestJS](https://nestjs.com/)
-   **Language**: TypeScript
-   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
-   **Security**: Passport.js with JWT Strategy & Bcrypt
-   **Deployment**: Vercel Serverless Functions

### Frontend
-   **Library**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
-   **Navigation**: React Router 6
-   **Icons**: Lucide React

---

## 🚀 Getting Started

To get the project running locally, follow these steps:

### Prerequisites
-   Node.js (v18 or higher)
-   npm or yarn
-   A MongoDB instance (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/SnippetVault.git
cd SnippetVault
```

### 2. Setup Backend
```bash
cd snippet-vault-backend
npm install
# Configure .env (see backend README)
npm run start:dev
```

### 3. Setup Frontend
```bash
cd ../snippet-vault-frontend
npm install
# Configure .env (see frontend README)
npm run dev
```

---

## 📄 Documentation

For more detailed information, please refer to the individual package READMEs:

-   📖 [Backend Documentation](file:///Users/miguelcerne/Documents/projects/SnippetVault/snippet-vault-backend/README.md)
-   📖 [Frontend Documentation](file:///Users/miguelcerne/Documents/projects/SnippetVault/snippet-vault-frontend/README.md)

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [Miguel Cerne](https://github.com/Cerne17)
