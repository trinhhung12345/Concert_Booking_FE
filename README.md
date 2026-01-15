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

## 🚀 Getting Started

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
├── assets/                 # Static assets (images, icons)
│   ├── images/            # Concert images and backgrounds
│   └── react.svg          # React logo
├── components/
│   ├── layout/            # Layout components (Header, MainLayout, etc.)
│   │   ├── Header.tsx     # Main navigation header
│   │   ├── MainLayout.tsx # Main app layout wrapper
│   │   └── CategoryNav.tsx # Category navigation
│   └── ui/                # Reusable UI components (shadcn/ui)
│       ├── button.tsx     # Button component
│       ├── card.tsx       # Card component
│       ├── input.tsx      # Input component
│       └── ...           # Other UI components
├── features/              # Feature-based modules (Isolated functionality)
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Auth-specific components
│   │   ├── services/      # Auth API services
│   │   └── schemas/       # Auth validation schemas
│   ├── booking/           # Booking feature
│   │   ├── components/    # SeatMap, booking forms
│   │   ├── services/      # Booking API services
│   │   └── types/         # Booking TypeScript types
│   └── concerts/          # Concerts feature
│       ├── components/    # EventCard, EventSchedule
│       ├── services/      # Event and category services
│       └── ...
├── lib/                   # Shared utilities and configurations
│   ├── axios.ts           # Axios instance with interceptors
│   └── utils.ts           # Utility functions (cn, etc.)
├── pages/                 # Page components (Route handlers)
│   ├── HomePage.tsx       # Landing page
│   ├── BookingPage.tsx    # Seat selection and booking
│   ├── ProfilePage.tsx    # User profile
│   ├── TicketsPage.tsx    # User's tickets
│   ├── EventDetailPage.tsx # Event details
│   ├── LoginPage.tsx      # Login page
│   ├── RegisterPage.tsx   # Registration page
│   └── admin/             # Admin pages
│       └── AdminDashboard.tsx # Admin dashboard
├── store/                 # Global state management (Zustand)
│   ├── useAuthStore.ts    # Authentication state
│   └── useModalStore.ts   # Modal state management
├── App.tsx                # Main application component
├── index.css              # Global styles and Tailwind imports
└── main.tsx               # Application entry point
```

### 🏗️ Architecture Principles

- **Feature-based**: Each feature (`auth`, `booking`, `concerts`) is self-contained
- **Component isolation**: Shared UI components in `components/ui/`
- **Centralized state**: Global state in `store/` using Zustand
- **Service layer**: API calls abstracted in feature services
- **Type safety**: Full TypeScript coverage with feature-specific types

## 🤝 Contributing & Team Collaboration

### 🚨 Important: Avoiding Merge Conflicts

#### Files/Folders Prone to Conflicts:
- **`components/ui/` & `components/layout/`**: Shared components used across features
- **`src/lib/`**: Utility functions and shared configurations
- **`src/store/`**: Global state stores
- **`package.json`**: Dependencies and scripts
- **`src/App.tsx`**: Main routing configuration
- **`.env`**: Environment variables
- **`tailwind.config.js`**: Styling configuration
- **`src/index.css`**: Global styles

#### Safe Areas (Low Conflict Risk):
- **`src/features/*/components/`**: Feature-specific components
- **`src/features/*/services/`**: Feature-specific API services
- **`src/features/*/types/`**: Feature-specific TypeScript definitions
- **`src/pages/`**: Individual page components
- **`src/assets/`**: Static assets

### 🔄 Development Workflow

#### 1. Branching Strategy
```bash
# Feature branch
git checkout -b feature/your-feature-name

# Bug fix branch
git checkout -b fix/bug-description

# Never work directly on main branch
```

#### 2. Before Making Changes

**For Shared Files (High Risk):**
- Check with team: "Planning to modify `components/ui/button.tsx`"
- Create a separate branch for shared component changes
- Test thoroughly across all features that use the component

**For Feature Development:**
- Work within your feature folder (`src/features/your-feature/`)
- Avoid touching shared files unless absolutely necessary
- Use feature-specific types and services

#### 3. Code Changes Guidelines

```typescript
// ✅ Good: Feature-specific component
// src/features/booking/components/BookingForm.tsx
export const BookingForm = () => { /* ... */ };

// ❌ Bad: Adding to shared folder without coordination
// src/components/BookingForm.tsx (Don't do this!)
```

#### 4. Pull Request Process
- **Title**: `feat: add seat selection feature` or `fix: resolve booking validation bug`
- **Description**: Include screenshots, testing notes, and affected areas
- **Reviewers**: Tag team members for shared file changes
- **Testing**: Ensure no regressions in other features

### 📋 Feature Development Checklist

**When adding a new feature:**
- [ ] Create feature folder under `src/features/`
- [ ] Implement components in `your-feature/components/`
- [ ] Add services in `your-feature/services/`
- [ ] Define types in `your-feature/types/`
- [ ] Update routing in `App.tsx` (coordinate with team)
- [ ] Test integration with existing features
- [ ] Update this README if adding new patterns

**When modifying shared components:**
- [ ] Notify team via Slack/discussion
- [ ] Test across all features that use the component
- [ ] Consider backward compatibility
- [ ] Document changes in PR

## 🎨 Design System

### Color Palette
- **Background**: Dark gradient (slate-900 to slate-800)
- **Cards**: Semi-transparent white with backdrop blur
- **Text**: White primary, slate-300 secondary
- **Accent**: White borders with opacity variations

### Components
The app uses shadcn/ui components with custom styling:
- **Button**: Multiple variants (default, outline) with dark mode support
- **Card**: Glassmorphism effect with semi-transparent backgrounds
- **Input**: Custom styled form inputs with focus states

## 🔧 Development Guidelines

### Code Style
- Follow TypeScript strict mode
- Use ESLint for code quality
- Follow React best practices and hooks guidelines
- Use meaningful component and variable names

### Adding New Components

#### For Feature Components:
1. Create in `src/features/your-feature/components/`
2. Export from feature's index file
3. Use feature-specific styling

#### For Shared UI Components:
1. Use shadcn/ui CLI to add new components:
```bash
npx shadcn@latest add [component-name]
```

2. Customize the component styles in the component file
3. Update the design system documentation
4. Notify team about new shared component

### Styling Guidelines
- Use Tailwind CSS classes primarily
- Leverage CSS custom properties for theming
- Maintain consistent spacing using Tailwind's space scale
- Use responsive prefixes (sm:, md:, lg:) for mobile-first design

### State Management
- Use Zustand stores for global state (`src/store/`)
- Use local component state for component-specific state
- Keep stores focused on specific domains (auth, modals, etc.)

### API Integration
- All API calls go through feature services
- Use the shared axios instance from `src/lib/axios.ts`
- Handle errors consistently across features

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
VITE_API_URL=https://api.concertbooking.com
VITE_APP_NAME=Concert Booking
```

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

**Trinh Hung** - [GitHub](https://github.com/trinhhung12345)

---

*Built with ❤️ using modern web technologies*
