# Win95 Express App

A TypeScript Express application with a Windows 95 themed frontend.

![Win95 Theme](https://img.shields.io/badge/Theme-Windows%2095-blue)

## Features

- 📦 **Orders Management** - Create, view, and delete orders
- 👤 **Users Management** - Create, view, and delete users  
- 💚 **Health Check** - Monitor system status
- 🖥️ **Win95 UI** - Classic Windows 95 themed interface

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Development

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Deployment

### GitHub Pages (Static Demo)

The app automatically deploys to GitHub Pages via GitHub Actions on push to `main`.

When running on GitHub Pages, the app operates in demo mode with mock data stored in memory.

## Project Structure

```
├── src/
│   └── server.ts      # Express server with API endpoints
├── public/
│   ├── index.html     # Win95 themed frontend
│   ├── styles.css     # Win95 CSS styles
│   └── app.js         # Frontend JavaScript
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Pages deployment
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
