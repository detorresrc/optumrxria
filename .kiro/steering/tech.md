# Tech Stack

## Core Technologies
- React 19 with TypeScript
- Vite 7 (build tool and dev server)
- MUI (Material-UI) v7 for components
- Emotion for CSS-in-JS styling

## Form Handling
- react-hook-form for form state management
- Zod for schema validation
- @hookform/resolvers for Zod integration

## Code Quality
- ESLint 9 with TypeScript support
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh

## Common Commands

```bash
# Development server
npm run dev

# Production build (TypeScript compile + Vite build)
npm run build

# Lint check
npm run lint

# Preview production build
npm run preview
```

## TypeScript Configuration
- Project uses composite TypeScript config with separate configs for app (`tsconfig.app.json`) and node (`tsconfig.node.json`)
- ES modules (`"type": "module"` in package.json)

## Styling Approach
- Use MUI's `sx` prop for component styling
- Custom theme defined in `src/theme.ts` with Optum brand colors
- Avoid inline styles; prefer theme tokens and sx prop
