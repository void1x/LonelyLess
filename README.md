# LonelyLess (formerly MindPulse)

A mental health and loneliness risk checker. Originally built in Vanilla JS, the project has now been migrated to a modern **Vite + React** architecture.

## Features

- **Four Key Inputs**: Track your screen time, social interactions, sleep, and physical activity via custom sliders.
- **Instant Risk Analysis**: Calculates a comprehensive loneliness risk score based on UCLA, WHO, and NIH research.
- **Actionable Suggestions**: Provides tailored, evidence-based recommendations based on your unique risk factors.
- **Local Storage**: Capable of saving check-in results locally to your browser (`lonelyless_history`).
- **Dark Wellness Aesthetic**: A premium, calming UI built entirely with custom CSS and a noise texture overlay.
- **Single-File Component Architecture**: The entire UI and scoring logic is encapsulated within a robust React component.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Custom plain CSS-in-JS injected dynamically (No Tailwind or UI component libraries)
- **Charts:** Pure inline SVG (No Chart.js or Recharts)
- **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`)
- **Fonts:** Google Fonts (DM Serif Display, DM Sans)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your system.

### Installation

1. Navigate to the project directory:
   ```bash
   cd wellbeing-checker
   ```
2. Install the necessary dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).

### Building for Production

To create an optimized production build:
```bash
npm run build
```
The compiled static files will be located in the `dist` directory.

## App History Feature
*Note: The LonelyLess application saves your check-in results to your browser's local storage (under the key `lonelyless_history`). In the current highly-focused, single-page UI spec, a visual history listing is not displayed directly in the UI, but the data is safely recorded locally.*
