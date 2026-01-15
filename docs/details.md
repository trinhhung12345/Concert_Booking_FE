# Concert Booking Frontend - Detailed Documentation

This document contains detailed information about the project structure, architecture, and development guidelines for the Concert Booking Frontend application.

## 📁 Detailed Project Structure

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

## 🏗️ Architecture Principles

- **Feature-based**: Each feature (`auth`, `booking`, `concerts`) is self-contained
- **Component isolation**: Shared UI components in `components/ui/`
- **Centralized state**: Global state in `store/` using Zustand
- **Service layer**: API calls abstracted in feature services
- **Page routing**: Dedicated page components for URL handling
- **Type safety**: Full TypeScript coverage with feature-specific types

## 📄 Pages Architecture

### What are Pages?

**Pages** are the top-level components that handle URL routing and compose features into complete user experiences. Each page corresponds to a specific URL route and orchestrates the UI, data fetching, and user interactions for that route.

### Current Pages Structure

```
src/pages/
├── HomePage.tsx           # Landing page (/)
├── BookingPage.tsx        # Seat booking (/booking/:eventId)
├── EventDetailPage.tsx    # Event details (/event/:id)
├── ProfilePage.tsx        # User profile (/profile)
├── TicketsPage.tsx        # User's tickets (/tickets)
├── LoginPage.tsx          # Authentication (/login)
├── RegisterPage.tsx       # Registration (/register)
└── admin/
    └── AdminDashboard.tsx # Admin dashboard (/admin)
```

### Page Responsibilities

Each page component typically handles:

1. **URL Parameters**: Extract route params (e.g., `useParams()` for `:eventId`)
2. **Data Fetching**: Call services to load page data
3. **State Management**: Manage page-level state (loading, errors)
4. **Feature Composition**: Combine multiple feature components
5. **Layout Selection**: Choose appropriate layout wrapper
6. **Navigation**: Handle programmatic navigation

### Example: BookingPage

```typescript
// src/pages/BookingPage.tsx
export const BookingPage = () => {
  const { eventId } = useParams(); // URL parameter

  // Page-level state
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data fetching (page concern)
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await eventService.getEvent(eventId);
        setEventData(event);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="booking-page">
      {/* Compose features into page */}
      <EventHeader event={eventData} />
      <SeatMap eventId={eventId} />
      <BookingSummary event={eventData} />
    </div>
  );
};
```

### Page vs Feature Components

| Aspect | Pages | Feature Components |
|--------|-------|-------------------|
| **Purpose** | URL routing & page composition | Reusable business logic |
| **Scope** | Page-level concerns | Feature-specific logic |
| **Reusability** | One per route | Used across pages |
| **State** | Page state + URL params | Component state |
| **Dependencies** | Multiple features | Single feature focus |

### When to Create a New Page

Create a new page when you need:

- **New URL route**: `/new-feature`
- **Different layout**: Auth pages vs main app pages
- **Unique composition**: Custom arrangement of features
- **Route-specific logic**: URL params, query strings

### Best Practices

1. **Keep pages focused**: Each page handles one primary user flow
2. **Extract shared logic**: Move reusable logic to services or custom hooks
3. **Use layouts consistently**: Choose appropriate layout wrapper
4. **Handle loading/error states**: Provide good UX during data fetching
5. **Test navigation**: Ensure proper routing and param handling

## 🤝 Detailed Contributing & Team Collaboration

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

### 🔄 Complete Development Workflow

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
- [ ] Create feature folder under `src/features/your-feature/`
- [ ] Implement feature components in `your-feature/components/`
- [ ] Add API services in `your-feature/services/`
- [ ] Define TypeScript types in `your-feature/types/`
- [ ] Create page component in `src/pages/YourFeaturePage.tsx`
- [ ] Update routing in `App.tsx` (coordinate with team!)
- [ ] Test page navigation and URL handling
- [ ] Test integration with existing features
- [ ] Update documentation if new patterns introduced

**When creating a new page:**
- [ ] Create page component in `src/pages/`
- [ ] Handle URL parameters with `useParams()`
- [ ] Implement page-level data fetching
- [ ] Add appropriate layout wrapper
- [ ] Handle loading and error states
- [ ] Update routing in `App.tsx`
- [ ] Test navigation and user flows

**When modifying shared components:**
- [ ] Notify team via Slack/discussion
- [ ] Test across all features that use the component
- [ ] Consider backward compatibility
- [ ] Document changes in PR

## 🎨 Detailed Design System

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

## 🔧 Detailed Development Guidelines

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

## 🚀 Adding New Features - Complete Guide

### Step-by-Step Process

1. **Planning Phase**
   - Discuss feature requirements with team
   - Identify shared files that need modification
   - Plan routing and state management needs

2. **Development Phase**
   - Create feature folder structure
   - Implement components, services, and types
   - Test feature in isolation

3. **Integration Phase**
   - Add routing in `App.tsx`
   - Integrate with existing features
   - Update shared components if needed

4. **Testing & Review**
   - Test across different devices/browsers
   - Ensure no regressions
   - Code review and team approval

### Example: Adding a Reviews Feature

```typescript
// 1. Create feature structure
// src/features/reviews/
// ├── components/ReviewForm.tsx
// ├── components/ReviewList.tsx
// ├── services/reviewService.ts
// └── types/review.ts

// 2. Create page component
// src/pages/EventReviewsPage.tsx

// 3. Update routing in App.tsx
<Route path="/event/:id/reviews" element={<EventReviewsPage />} />

// 4. Test and integrate
```

## 📋 Communication Guidelines

### Slack/Discord Communication
- **Planning**: "Planning to add [feature] - will need routing changes"
- **Progress**: "Working on [feature] - ETA: [time]"
- **Blockers**: "Stuck on [issue] - need help with [specific problem]"
- **Review**: "[Feature] ready for review - includes [shared changes]"

### Code Review Guidelines
- **Shared Files**: Require 2+ approvals for changes to `components/ui/`, `App.tsx`, etc.
- **Feature Files**: 1 approval sufficient
- **Testing**: Always include testing notes
- **Documentation**: Update docs/details.md for new patterns

## 🔄 Conflict Resolution

### When Merge Conflicts Occur
1. **Communicate immediately**: "Conflict in [file]!"
2. **Coordinate resolution**: "I'll handle the merge, you review?"
3. **Test thoroughly**: Ensure functionality isn't broken
4. **Document changes**: Update team about resolved conflicts

### Prevention Strategies
- Pull main branch frequently
- Use feature flags for experimental features
- Keep shared file changes minimal and focused
- Communicate before making breaking changes

## 📚 Additional Resources

- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [React Router](https://reactrouter.com/)

---

*For quick overview, see [README.md](../README.md)*
