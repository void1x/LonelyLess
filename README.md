<div align="center">
  <br />
  <img src="https://raw.githubusercontent.com/antigravity/wellbeing-checker/main/public/logo.png" alt="LonelyLess" width="60" />
  <h1>LonelyLess</h1>
  <p><strong>A premium mental health & loneliness risk checker.</strong></p>
  <p><em>Built with React 18, Vite, and the modern View Transitions API.</em></p>
  <br />
</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Storage-Local-brightgreen" alt="Local Storage" />
  <img src="https://img.shields.io/badge/Styling-Custom_CSS-yellow" alt="Custom CSS" />
</p>

---

## 🌊 The Aesthetic

LonelyLess is designed with an editorial, **premium wellness aesthetic**. The interface is intentionally sparse, modern, and clinical—featuring subtle noise grain, glassmorphism blur effects, and smooth native animations. 

### 🎨 Matugen-style Theme Engine
Built directly into the core architecture is a zero-dependency **Theme Engine**. 

Choose between three distinct wellness palettes:
1. **Mental Health (MIT)**: A clinical teal and slate aesthetic (`#f4f7f6`).
2. **Deep Ocean**: A rich navy and sky-blue twilight (`#0b1120`).
3. **Tangerine**: An energetic, high-contrast citrus (`#fff7ed`).

> **Drop in the Ocean.** 
> The UI leverages the modern `View Transitions API` to create a sweeping, circular "water droplet" effect that bursts dynamically from the position of your cursor when you switch themes.

---

## 🧠 The Science

The algorithm powering the score utilizes non-personal, open-source models based on current research from:
- The **UCLA Loneliness Scale**
- The **World Health Organization (WHO)** Digital Wellness & Activity guidelines
- The **NIH** Sleep research database

Four inputs are required: **Screen Time**, **Social Interactions**, **Sleep**, and **Exercise**. The engine calculates a weighted 0–100 risk score and provides tailored actions.

---

## 🏗️ Architecture

LonelyLess is heavily componentized yet extremely minimalistic. 
No Tailwind. No UI Libraries. No Chart.js.

- **`App.jsx`**: A lightweight router driving the architecture.
- **`LonelyLessLanding.jsx`**: The sleek, scrolling marketing page.
- **`LonelyLess.jsx`**: The core application, built with pure inline SVG score rings.
- **`ThemeProvider.jsx`**: Context provider handling LocalStorage persistence and the View Transitions CSS injection.

---

## 🚀 Getting Started

To launch the development server locally:

```bash
# 1. Clone & Enter the directory
cd wellbeing-checker

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Visit the provided localhost port (usually `http://localhost:5173`).

### Local History

All check-ins are recorded directly in your browser using `localStorage`. You can securely view your historical progression at the top of the checker interface. **LonelyLess never tracks or transmits your personal data.**

<br />

---
<div align="center">
  <p><em>Designed for connection, privacy, and mindful introspection.</em></p>
</div>
