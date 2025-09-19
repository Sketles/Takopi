# Copilot Instructions for Takopi

## Project Architecture

This is a **Next.js 15** project named "Takopi" using the **App Router** pattern with TypeScript, TailwindCSS v4, and modern React 19.

### Key Technical Stack

- **Next.js 15.5.3** with App Router (`src/app/` directory structure)
- **React 19.1.0** with TypeScript 5
- **TailwindCSS v4** with PostCSS integration
- **ESLint 9** with Next.js TypeScript configuration
- **Geist fonts** (sans and mono variants) from Google Fonts

### Directory Structure

```
src/app/
├── layout.tsx      # Root layout with font setup and metadata
├── page.tsx        # Homepage component
├── globals.css     # TailwindCSS imports and CSS custom properties
└── favicon.ico
```

### Development Patterns

#### Styling & CSS
- Uses **TailwindCSS v4** with `@import "tailwindcss"` in `globals.css`
- CSS custom properties for theming: `--background`, `--foreground`, `--font-geist-sans`, `--font-geist-mono`
- Dark mode support via `prefers-color-scheme: dark` media query
- **Geist fonts** configured as CSS variables in layout.tsx

#### TypeScript Configuration
- Path aliases: `@/*` maps to `./src/*`
- Strict mode enabled with bundler module resolution
- Next.js plugin for TypeScript integration

#### Component Patterns
- **Server Components** by default (App Router)
- Metadata exported from layout.tsx using `Metadata` type
- Image optimization with `next/image` component
- Responsive design with Tailwind breakpoints (`sm:`, mobile-first)

### Build & Development

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint checking
```

### Code Conventions

1. **Font Loading**: Use `next/font/google` with CSS variables pattern as shown in `layout.tsx`
2. **Styling**: Prefer Tailwind classes over custom CSS, use CSS custom properties for theming
3. **Images**: Always use `next/image` with proper `alt`, `width`, `height` props
4. **Responsive**: Mobile-first approach with `sm:` prefix for larger screens
5. **ESLint**: Follows `next/core-web-vitals` and `next/typescript` presets

### Project-Specific Notes

- This appears to be a fresh Next.js starter project with minimal customization
- Uses the default Next.js welcome page structure in `page.tsx`
- Ready for TailwindCSS v4 inline theme configuration via `@theme inline`
- No custom API routes, components, or business logic yet implemented