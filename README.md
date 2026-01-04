# Concert Booking Frontend

A modern, responsive concert booking application built with React 19, TypeScript, and Tailwind CSS v4. Features a sleek dark theme with glassmorphism design elements and interactive UI components.

## ✨ Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS v4
- **Dark Theme**: Professional dark gradient background with glassmorphism effects
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **TypeScript**: Full type safety throughout the application
- **Form Handling**: React Hook Form with Zod validation
- **Interactive Components**: Hover effects, animations, and smooth transitions

## 🛠 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Form Management**: React Hook Form + Zod validation
- **Icons**: Lucide React
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
├── assets/          # Static assets (images, icons)
├── components/
│   ├── ui/         # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
├── lib/
│   └── utils.ts    # Utility functions
├── App.tsx         # Main application component
├── index.css       # Global styles and Tailwind imports
└── main.tsx        # Application entry point
```

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

## 🔧 Development

### Code Style
- Follow TypeScript strict mode
- Use ESLint for code quality
- Follow React best practices and hooks guidelines
- Use meaningful component and variable names

### Adding New Components
1. Use shadcn/ui CLI to add new components:
```bash
npx shadcn@latest add [component-name]
```

2. Customize the component styles in the component file
3. Update the design system if needed

### Styling Guidelines
- Use Tailwind CSS classes primarily
- Leverage CSS custom properties for theming
- Maintain consistent spacing using Tailwind's space scale
- Use responsive prefixes (sm:, md:, lg:) for mobile-first design

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Open a pull request

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

**Trinh Hung** - [GitHub](https://github.com/trinhhung12345)

---

*Built with ❤️ using modern web technologies*
