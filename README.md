# Book Sharing Service

A modern web application for sharing and managing books built with React, TypeScript, and Material-UI.

## Features

- 🔐 **User Authentication** - Login/Register with JWT tokens
- 📚 **Book Management** - Add, view, and delete your books
- 🔍 **Book Discovery** - Search and browse all books in the system
- 📄 **Pagination** - Efficient browsing with pagination
- 🎨 **Modern UI** - Beautiful Material-UI interface
- 📱 **Responsive** - Works on all devices

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **React Router** - Navigation
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## Project Structure

```
src/
├── api/                 # API client functions
│   └── client.ts
├── components/          # Reusable UI components
│   ├── Layout.tsx
│   └── BookCard.tsx
├── constants/           # Application constants
│   └── index.ts
├── context/            # React context providers
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   ├── useApi.ts
│   └── useBooksSearch.ts
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── BooksList.tsx
│   ├── BookDetails.tsx
│   ├── MyBooks.tsx
│   └── AddBook.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── helpers.ts
├── App.tsx
├── main.tsx
└── index.css

server/
└── index.js           # Express server
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development servers:
   ```bash
   npm run dev:all
   ```

This will start both the frontend (http://localhost:5173) and backend (http://localhost:4000) servers.

### Available Scripts

- `npm run dev` - Start frontend only
- `npm run server` - Start backend only  
- `npm run dev:all` - Start both servers
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/me` - Get current user

### Books
- `GET /api/books` - Get all books (with search, sort, pagination)
- `GET /api/books/:id` - Get book details
- `GET /api/me/books` - Get user's books
- `POST /api/me/books` - Add new book
- `DELETE /api/me/books/:id` - Delete book

## Features in Detail

### Book Search & Discovery
- Search books by name or author
- Sort by name or author
- Pagination for large collections
- Beautiful card-based layout

### User Management
- Secure authentication with JWT
- Password hashing with bcrypt
- Persistent login sessions

### Book Management
- Add books with cover images
- View detailed book information
- Manage personal book collection

## Development

The project uses modern development practices:

- **TypeScript** for type safety
- **ESLint** for code quality
- **Material-UI** for consistent design
- **Custom hooks** for reusable logic
- **Centralized constants** for maintainability
- **Error handling** with user-friendly messages

## Code Architecture

### Key Improvements Made

1. **Type Safety** - Centralized TypeScript interfaces
2. **Constants** - All routes and API endpoints in one place
3. **Custom Hooks** - Reusable logic for API calls and search
4. **Component Reusability** - BookCard component for consistent UI
5. **Error Handling** - Centralized error formatting
6. **Code Organization** - Clear separation of concerns

### File Organization

- `types/` - All TypeScript interfaces and types
- `constants/` - Application constants and configuration
- `hooks/` - Custom React hooks for reusable logic
- `utils/` - Utility functions and helpers
- `components/` - Reusable UI components
- `pages/` - Page-level components
- `api/` - API client functions
- `context/` - React context providers