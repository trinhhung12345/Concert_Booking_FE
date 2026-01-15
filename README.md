# Concert Booking Frontend

A modern, responsive concert booking application built with React 19, TypeScript, and Tailwind CSS v4. Features a sleek dark theme with glassmorphism design elements and interactive UI components.

## ✨ Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS v4
- **Dark Theme**: Professional dark gradient background with glassmorphism effects
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **TypeScript**: Full type safety throughout the application
- **Form Handling**: React Hook Form with Zod validation
- **Interactive Components**: Hover effects, animations, and smooth transitions
- **State Management**: Zustand for global state management
- **Authentication**: JWT-based auth with protected routes
- **Admin Dashboard**: Separate admin interface for event management

## 🛠 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Form Management**: React Hook Form + Zod validation
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router DOM v7
- **Icons**: Lucide React + FontAwesome
- **Media**: React Player, React YouTube, React Zoom Pan Pinch
- **Development**: ESLint, TypeScript compiler

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/trinhhung12345/Concert_Booking_FE.git
cd Concert_Booking_FE
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/
│   ├── layout/      # Layout components (Header, MainLayout)
│   └── ui/          # Shared UI components (shadcn/ui)
├── features/        # Feature-based modules (auth, booking, concerts)
│                   # └── Isolated business logic per feature
├── lib/             # Shared utilities and configurations
├── pages/           # 📍 Page components - Route handlers for URLs
│   ├── HomePage.tsx        # Landing page (/)
│   ├── BookingPage.tsx     # Seat booking (/booking/:eventId)
│   ├── LoginPage.tsx       # Authentication (/login)
│   └── ...                 # Each page = one URL route
├── store/           # Global state management (Zustand)
├── App.tsx          # Main application component + routing
├── index.css        # Global styles
└── main.tsx         # Application entry point
```

### 🏗️ Architecture Overview

- **Feature-based**: Each feature (`auth`, `booking`, `concerts`) is self-contained
- **Component isolation**: Shared UI components in `components/ui/`
- **Centralized state**: Global state in `store/` using Zustand
- **Service layer**: API calls abstracted in feature services

## 🤝 Contributing

### 🚨 Important: Avoiding Merge Conflicts

**High Risk Files (Coordinate with team):**
- `components/ui/` - Shared UI components
- `src/lib/` - Utility functions
- `src/store/` - Global state stores
- `src/App.tsx` - Main routing
- `package.json` - Dependencies

**Safe Areas (Low Risk):**
- `src/features/*/components/` - Feature-specific components
- `src/features/*/services/` - Feature-specific API services
- `src/features/*/types/` - Feature-specific TypeScript types
- `src/pages/` - Page components (route handlers)
- `src/assets/` - Static assets

### 🔄 Development Workflow

1. **Create feature branch**: `git checkout -b feature/your-feature-name`
2. **Work in isolation**: Develop within `src/features/your-feature/`
3. **Coordinate shared changes**: Notify team before modifying shared files
4. **Test thoroughly**: Ensure no regressions in existing features
5. **Pull request**: Include testing notes and tag reviewers for shared changes

### 📋 Quick Checklist

**Adding a new feature:**
- [ ] Create feature folder under `src/features/`
- [ ] Implement in feature's components/services/types
- [ ] Update routing in `App.tsx` (coordinate!)
- [ ] Test integration with existing features

**Modifying shared components:**
- [ ] Notify team before changes
- [ ] Test across all features
- [ ] Consider backward compatibility

## 📚 Documentation

- **[Detailed Documentation](docs/details.md)** - Complete guides, architecture details, and best practices
- **Communication**: Use Slack/Discord for coordination on shared changes
- **Code Review**: Required for shared file modifications

## 🎨 Design System

### Color Palette
- **Background**: Dark gradient (slate-900 to slate-800)
- **Cards**: Semi-transparent white with backdrop blur
- **Text**: White primary, slate-300 secondary
- **Accent**: White borders with opacity variations

### Components
Uses shadcn/ui components with custom dark theme styling.

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
VITE_API_URL=https://api.concertbooking.com
VITE_APP_NAME=Concert Booking
```

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

**Trinh Hung** - [GitHub](https://github.com/trinhhung12345/Concert_Booking_FE.git)

---

*Built with ❤️ using modern web technologies*

**📖 For detailed documentation, see [docs/details.md](docs/details.md)**
