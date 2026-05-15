# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Colorcopy is a single-page web application for a Buenos Aires-based print shop and signage business. It showcases three core services: **Gráfica** (printing), **CNC** (precision cutting), and **Cartelería** (signage and installation). The site is a static client-side React application served from a single HTML entry point.

## Tech Stack

- **Runtime**: Browser (no Node.js/build step required)
- **UI Framework**: React 18.3.1 (via CDN, Babel transpilation in-browser)
- **Language**: JSX (transpiled by Babel Standalone 7.29.0)
- **Styling**: Plain CSS (single stylesheet, ~984 lines)
- **Architecture**: Hash-based SPA routing with local component state

## Project Structure

```
colorcopy/
├── Colorcopy.html          # Entry point; loads React, Babel, and JSX modules
├── app.jsx                 # App shell (routing, layout)
├── components.jsx          # Shared UI components (Header, Footer, Hero, etc.)
├── chatbot.jsx            # Floating chatbot widget (Tinta assistant)
├── pages.jsx              # Page components (HomePage, CategoryPage, ProductCard)
├── styles.css             # All styling (design system + component styles)
├── assets/                # Images (logo, banner)
└── uploads/               # Product uploads directory
```

## Architecture & Key Patterns

### Routing & Page Structure
- **Hash-based SPA**: Routes defined in `app.jsx` using `window.location.hash`
- Valid routes: `#/home` (default), `#/grafica`, `#/cnc`, `#/carteleria`
- `parseHash()` validates routes; invalid hashes fallback to home
- `useEffect` syncs hash changes to component state; page scrolls to top on route change

### Component Model
- **Global state via `window` object**: All major components exported to `window` (e.g., `window.Header`, `window.Chatbot`) for cross-module access
- Babel transpiles JSX in-browser; modules are loaded sequentially in `Colorcopy.html`
- **Local component state**: Each component manages its own state with `useState`; no global state manager

### Data Model
- **Products**: Static product catalog in `PRODUCTS` object (pages.jsx) keyed by category
- **Categories**: Fixed three-category system in `CATEGORIES` array (components.jsx)
- **No backend**: All data is hardcoded; no API calls

### UI Components
- **Icon system**: Inline SVG icons in `Icon` object (components.jsx), monoline style
- **Button variants**: `btn-primary` (yellow, filled), `btn-ghost` (outline)
- **Filter chips**: Reusable chip buttons for product filtering
- **Chatbot widget**: Floating FAB with panel interface; mock responses with simulated typing delay

### Styling Conventions
- **CSS variables**: Design system in `:root` (colors, fonts, spacing)
- **Color palette**: Navy (`--navy`), paper (`--paper`), red, yellow, paint-blue (brand colors)
- **Typography**: Four font families (display, serif, body, monospace) loaded via Google Fonts
- **Layout**: Grid/flexbox; mobile-responsive (`clamp()` for fluid typography)
- **Editorial aesthetic**: Bold, color-block design with monoline icons; heavy use of uppercase and letter-spacing

## Development Workflow

### No Build Step Required
This project runs directly in the browser with **no build process, no npm install, no dev server**. Simply open `Colorcopy.html` in a browser.

### Adding Features
1. **New pages**: Create a component in `pages.jsx`, add route in `app.jsx`, export to `window`
2. **New UI components**: Add to `components.jsx`, export to `window`
3. **New styles**: Add selectors to `styles.css` (organize by component section, comment boundaries)
4. **New data**: Update `CATEGORIES` or `PRODUCTS` objects
5. **Icons**: Add SVG to the `Icon` object in `components.jsx`

### Modifying Existing Components
- **Pages are re-renders**: `HomePage` and `CategoryPage` re-render on hash change; component state is reset
- **Chatbot is persistent**: Rendered at app root level, survives route changes
- **Navigation**: Use `navigate(id)` callback to trigger route changes (passed to all components)

### Testing
No testing framework is present. Manual testing in a browser is the standard approach.

## Design System

### Colors
- `--navy`, `--navy-deep`, `--navy-ink`: Background gradations
- `--paper`: Off-white text and accents
- `--red`, `--yellow`, `--paint-blue`: Category and brand colors
- `--line`, `--line-strong`, `--muted`: Borders and subtle text

### Typography
- **Display (headers)**: Archivo Black
- **Serif (eyebrows)**: Instrument Serif italic
- **Body (copy)**: Inter
- **Monospace (labels, metadata)**: JetBrains Mono

### Spacing & Layout
- Base padding: 40px (main container width max 1600px)
- Section padding: 120px vertical, 40px horizontal
- Gaps: 14px–40px depending on context
- Breakpoints: Implicit via `clamp()`; no explicit media queries (content scales fluidly)

### Interaction Patterns
- **Transitions**: 0.2s–0.4s easing with cubic-bezier curves
- **Hover effects**: Lift (`translateY(-2px)`), color shift, shadow glow
- **Active states**: Yellow underline for nav, highlight for buttons/chips
- **Animations**: Letter spin-up on hero title, drip paint-blobs on hero entrance

## Common Tasks

### Updating Product Catalog
Edit the `PRODUCTS` object in `pages.jsx`. Each category has:
- `color`: Brand color variable for the section
- `intro`: Intro text
- `filters`: Filter chip labels
- `items`: Array of product objects with `name`, `meta`, `price`, `unit`, optional `tag`, `tagClass`

### Adding a New Category
1. Add entry to `CATEGORIES` array (components.jsx) with `id`, `name`, `num`, `color`, `desc`, `tag`
2. Add validation to `VALID` Set (app.jsx)
3. Add product data to `PRODUCTS` (pages.jsx)

### Updating Chatbot Responses
Edit the `send()` function in `chatbot.jsx`. Currently mocks a delayed response; wiring to a real backend would replace the `setTimeout` block.

### Styling a New Component
1. Add `.component-name` block to `styles.css` (organize by section)
2. Use CSS variables for colors/fonts
3. Use consistent padding/gap values
4. Add hover/active states and transitions

## Notes for Future Development

- **No transpilation**: JSX is transpiled in-browser by Babel. Large apps may see performance issues; consider a build step if the codebase grows significantly.
- **No package manager**: Dependencies (React, Babel) are loaded via CDN. Updates require manual URL changes in `Colorcopy.html`.
- **SEO limitations**: SPA with hash routing has poor SEO; no server-side rendering.
- **Accessibility**: aria-labels are present on interactive elements; ensure new components maintain this pattern.
- **Analytics/tracking**: Not currently implemented; consider adding if required.
