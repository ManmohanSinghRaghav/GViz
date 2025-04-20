# SynqTech

A visual data visualization application built with React and Tailwind CSS.

## Features

- Modern React (v19) application
- Styling with Tailwind CSS v4
- Built with Vite for fast development and optimized production builds

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Navigate to the Frontend directory
3. Install dependencies:

```bash
npm install
# or
yarn
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the application at [http://localhost:5173](http://localhost:5173)

### Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

Preview the production build:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
Frontend/
├── public/            # Static assets
├── src/               # Source files
│   ├── assets/        # Project assets
│   ├── App.jsx        # Main application component
│   ├── App.css        # Component-specific styles
│   ├── index.css      # Global styles with Tailwind imports
│   └── main.jsx       # Application entry point
├── index.html         # HTML template
└── vite.config.js     # Vite configuration
```

## Technologies

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [SWC](https://swc.rs/) (via plugin-react-swc)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build