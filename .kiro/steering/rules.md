---
inclusion: always
---

# Development Guidelines

## Code Quality Standards
- Write production-ready, maintainable code following SOLID principles
- Use TypeScript strictly with proper typing (no `any` types)
- Follow React best practices: functional components, hooks, proper dependency arrays
- Keep components focused and single-responsibility

## UI Component Rules
- Use MUI (Material-UI) exclusively for all UI components
- Target MUI v7 with backward compatibility to v5.x when possible
- Reference the `mcp_mui_mcp_useMuiDocs` and `mcp_mui_mcp_fetchDocs` tools for MUI documentation
- Use the `sx` prop for styling; avoid inline styles
- Apply theme tokens from `src/theme.ts` for colors, spacing, and typography

## Design Implementation Workflow
1. **Fetch Figma specs first**: Use `mcp_figma_get_figma_data` to retrieve design specifications before implementing any UI
2. **Request visual reference**: Ask for screenshots when design details are unclear
3. **Plan component structure**: Create detailed component trees with all properties (size, color, padding, margin, spacing) extracted from Figma
4. **Match designs exactly**: Implement components to precisely match Figma specifications
5. **No custom designs**: If Figma data is unavailable or incomplete, request clarification from the user rather than improvising

## Component Development
- One component per file in `src/components/`
- Use `React.FC` typing with explicit prop interfaces
- Extract reusable logic into custom hooks
- Co-locate component-specific types with the component

## Form Handling
- Use `react-hook-form` for form state management
- Define Zod schemas in `src/schemas/` for validation
- Use `@hookform/resolvers/zod` for schema integration
- Include sensible default values in schemas