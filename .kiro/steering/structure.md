# Project Structure

```
src/
├── assets/          # Static assets (logos, images, SVGs)
├── components/      # React components (one component per file)
├── schemas/         # Zod validation schemas
├── theme.ts         # MUI theme configuration
├── main.tsx         # App entry point with providers
├── App.tsx          # Root component
└── *.css            # Global styles (prefer MUI sx prop)

public/              # Static public assets
dist/                # Build output (gitignored)
```

## Conventions

### Components
- Functional components with `React.FC` typing
- One component per file, named export matching filename
- Place in `src/components/`

### Schemas
- Zod schemas in `src/schemas/`
- Export inferred TypeScript types alongside schemas
- Include default values for form initialization

### Styling
- MUI theme tokens for colors, typography, spacing
- `sx` prop for component-level styles
- Theme customization in `src/theme.ts`

### Entry Point
- `main.tsx` wraps app with `ThemeProvider` and `CssBaseline`
- Keep `App.tsx` minimal, delegate to feature components
