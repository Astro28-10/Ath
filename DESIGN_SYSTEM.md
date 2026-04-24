# SkillBond Frontend Design System v2.0

## 🎨 Design Philosophy
**"Reputation Made Visual"** - Every page emphasizes transparency, trust, and the value of reputation in a clean, modern interface.

---

## 📋 Color Palette

### Primary Colors
- **Trust Blue**: `rgb(37, 99, 235)` - Primary actions, trust indicators
- **Purple Accent**: `rgb(147, 51, 234)` - Secondary actions, highlights
- **Success Green**: `rgb(34, 197, 94)` - Positive outcomes, completed states
- **Warning Red**: `rgb(239, 68, 68)` - Disputes, warnings, failures
- **Info Yellow**: `rgb(234, 179, 8)` - Information, highlights

### Background Colors
- **Dark Base**: `rgb(15, 23, 42)` - Darkest backgrounds
- **Dark Secondary**: `rgb(30, 41, 59)` - Secondary backgrounds
- **Dark Tertiary**: `rgb(51, 65, 85)` - Tertiary backgrounds
- **Light Neutral**: `rgb(240, 245, 250)` - Light backgrounds
- **White**: `rgb(255, 255, 255)` - Pure white for contrast

### Text Colors
- **Primary Text**: `rgb(15, 23, 42)` - Dark pages
- **Secondary Text**: `rgb(75, 85, 99)` - Secondary information
- **Light Text**: `rgb(255, 255, 255)` - On dark backgrounds
- **Muted Text**: `rgb(156, 163, 175)` - Disabled/muted states

---

## 🏗️ Layout Structure

### Grid System
- **Max Width**: 7xl (80rem / 1280px)
- **Gutters**: 2rem (32px)
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Spacing Scale
- `xs`: 4px (0.25rem)
- `sm`: 8px (0.5rem)
- `md`: 16px (1rem)
- `lg`: 24px (1.5rem)
- `xl`: 32px (2rem)
- `2xl`: 48px (3rem)
- `3xl`: 64px (4rem)

### Padding & Margins
- **Cards**: Padding `lg` (24px)
- **Sections**: Padding vertical `3xl` (64px), horizontal `lg` (24px)
- **Headers**: Padding `lg` (24px)
- **Buttons**: Padding Y `md` (12px), X `lg` (24px)

---

## 🎯 Typography

### Font Stack
```css
font-family: 'Monaco', 'Courier New', monospace;
```

### Type Hierarchy
- **H1 (Hero)**: 48px-72px, Font Weight 700
- **H2 (Section)**: 32px-48px, Font Weight 700
- **H3 (Subsection)**: 20px-28px, Font Weight 700
- **H4 (Cards)**: 16px-20px, Font Weight 700
- **Body**: 14px-16px, Font Weight 400
- **Small/Label**: 12px, Font Weight 600, Tracking 0.05em
- **Caption**: 11px, Font Weight 400, Tracking 0.03em

### Tracking (Letter Spacing)
- **Extra Tight**: 0.02em - Headings
- **Tight**: 0.03em - Body
- **Normal**: 0.05em - Labels
- **Wide**: 0.1em - Emphasis labels

---

## 🎨 Component Style Guide

### Buttons

#### Primary Button
```css
border: 2px solid rgb(37, 99, 235);
background: rgb(37, 99, 235);
color: white;
padding: 12px 24px;
font-size: 14px;
font-weight: 700;
letter-spacing: 0.05em;
transition: all 0.3s ease;
border-radius: 8px;

&:hover {
  background: rgb(29, 78, 216);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
}
```

#### Secondary Button
```css
border: 2px solid rgb(37, 99, 235);
background: transparent;
color: rgb(37, 99, 235);
padding: 12px 24px;
transition: all 0.3s ease;
border-radius: 8px;

&:hover {
  background: rgba(37, 99, 235, 0.1);
  border-color: rgb(59, 130, 246);
}
```

#### Ghost Button
```css
border: 2px solid rgba(37, 99, 235, 0.3);
background: transparent;
color: rgb(156, 163, 175);
padding: 12px 24px;
transition: all 0.3s ease;
border-radius: 8px;

&:hover {
  border-color: rgb(37, 99, 235);
  color: rgb(37, 99, 235);
  background: rgba(37, 99, 235, 0.05);
}
```

### Cards

#### Standard Card
```css
border: 2px solid rgb(37, 99, 235);
background: linear-gradient(
  135deg,
  rgba(37, 99, 235, 0.05) 0%,
  rgba(147, 51, 234, 0.05) 100%
);
padding: 24px;
border-radius: 12px;
transition: all 0.3s ease;

&:hover {
  border-color: rgb(59, 130, 246);
  box-shadow: 0 0 30px rgba(37, 99, 235, 0.1);
  transform: translateY(-2px);
}
```

#### Stat Card
```css
border: 2px solid rgba(37, 99, 235, 0.2);
background: rgba(37, 99, 235, 0.05);
padding: 20px;
border-radius: 8px;

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: rgb(37, 99, 235);
}

.stat-label {
  font-size: 12px;
  letter-spacing: 0.05em;
  color: rgb(156, 163, 175);
  margin-top: 8px;
}
```

### Inputs

#### Text Input / Select
```css
border: 2px solid rgb(37, 99, 235);
background: rgb(255, 255, 255);
padding: 12px 16px;
border-radius: 8px;
font-family: monospace;
transition: all 0.3s ease;

&:focus {
  outline: none;
  border-color: rgb(59, 130, 246);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

&::placeholder {
  color: rgb(156, 163, 175);
}
```

#### Range Slider
```css
-webkit-appearance: none;
width: 100%;
height: 8px;
background: linear-gradient(90deg, rgb(37, 99, 235), rgb(147, 51, 234));
border-radius: 4px;
outline: none;

&::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: rgb(37, 99, 235);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
}
```

---

## 🎭 Sections & Layouts

### Header
- **Height**: 72px (with padding)
- **Border**: Bottom border 2px, color `rgba(37, 99, 235, 0.3)`
- **Background**: Gradient from dark to slightly lighter
- **Sticky**: Position sticky, z-index 50
- **Navigation Gap**: 8px between buttons

### Hero Section
- **Padding**: Vertical 80px, Horizontal 32px
- **Background**: Gradient (light to purple)
- **Max Width**: 7xl
- **Grid**: 2 columns on desktop, 1 on mobile
- **Gap**: 48px

### Feature Grid
- **Columns**: 4 on desktop, 2 on tablet, 1 on mobile
- **Gap**: 16px-24px
- **Card Style**: Standard card with hover effect

### Stats Grid
- **Columns**: 4 on desktop, 2 on tablet, 1 on mobile
- **Gap**: 16px
- **Card Style**: Stat card

### Timeline
- **Orientation**: Vertical
- **Line Color**: `rgba(37, 99, 235, 0.3)`
- **Line Width**: 2px
- **Dot Size**: 12px
- **Gap Between Items**: 24px

---

## 🌈 Page Templates

### Landing Page (Dashboard)
1. **Hero** - Large headline + value prop + CTA
2. **Stats** - 4-column stat grid
3. **How It Works** - 4-step visual flow
4. **Features** - 2x2 or 4-column cards
5. **CTA Section** - Call to action + secondary link
6. **Footer** - Copyright + social links

### Learn/Info Pages
1. **Hero** - Title + subtitle
2. **Tab Navigation** - Horizontal tabs or vertical sidebar
3. **Content Section** - Rich text + code blocks
4. **Code Examples** - Dark background, monospace font
5. **CTA Section** - Link to next page
6. **Footer**

### Simulator Pages
1. **Header** - Logo + navigation + progress
2. **Left Sidebar** - Controls (sticky on desktop)
3. **Main Content** - Large visualization area
4. **Results Tabs** - Multiple visualization tabs
5. **Action Buttons** - Primary CTA at bottom

### Modal/Overlay
- **Backdrop**: `bg-black/60 backdrop-blur-sm`
- **Modal**: `border-2 border-blue-400/50 rounded-lg`
- **Max Width**: `max-w-4xl`
- **Padding**: `32px (2xl)`
- **Header**: Sticky with close button
- **Close Button**: Top right, `font-size: 24px`

---

## ✨ Visual Effects & Transitions

### Hover Effects
- **Buttons**: Background color shift + subtle shadow
- **Cards**: Border color shift + box-shadow + slight lift (translateY(-2px))
- **Links**: Color shift + underline

### Transitions
```css
transition: all 0.3s ease;
```

### Shadows
- **Light Shadow**: `0 2px 8px rgba(0, 0, 0, 0.1)`
- **Medium Shadow**: `0 4px 16px rgba(0, 0, 0, 0.15)`
- **Glow Shadow**: `0 0 20px rgba(37, 99, 235, 0.5)`

### Borders
- **Thin**: 1px
- **Normal**: 2px (default for components)
- **Thick**: 4px (for primary CTAs)
- **Radius**: 8px-12px for cards, 4px for buttons

---

## 📱 Responsive Design

### Mobile (< 640px)
- Single column layouts
- Full-width buttons
- Reduced padding: `lg` instead of `2xl`
- Stack navigation vertically
- Reduce font sizes by 2px

### Tablet (640px - 1024px)
- 2-column grids
- Medium padding: `xl` instead of `2xl`
- Side-by-side navigation
- Medium font sizes

### Desktop (> 1024px)
- Full grid layouts (4 columns)
- Full padding: `2xl`
- Horizontal navigation
- Standard font sizes

---

## 🎯 Accessibility

### Color Contrast
- **Minimum Ratio**: 4.5:1 for normal text
- **Enhanced**: 7:1 for critical text
- **Blue on white**: ✓ Pass (6.5:1)

### Interactive Elements
- **Focus State**: 3px outline, color `rgb(37, 99, 235)`
- **Disabled State**: `opacity-50`, `cursor-not-allowed`
- **Loading State**: Animated spinner or text update

### Typography
- **Line Height**: 1.5-1.6 for body text
- **Letter Spacing**: Increased for better readability
- **Font Size Min**: 14px for body text
- **Font Size Max**: No restriction (scale with design)

---

## 🔧 Implementation Checklist

For each page/component:
- [ ] Use monospace font family
- [ ] Apply color palette (blues, purples)
- [ ] Use 2px borders on cards/buttons
- [ ] Add hover transitions (0.3s ease)
- [ ] Include proper spacing scale
- [ ] Add responsive breakpoints
- [ ] Test color contrast
- [ ] Ensure keyboard navigation
- [ ] Add focus states to inputs
- [ ] Use gradients for depth

---

## 📦 Component Reusables

### Common Imports (in all pages)
```typescript
import Link from 'next/link';
import { useState } from 'react';
```

### Common Classes
- Header wrapper: `max-w-7xl mx-auto px-8`
- Section wrapper: `max-w-7xl mx-auto`
- Button primary: `border-2 border-blue-400 px-8 py-3 bg-blue-500 hover:bg-blue-600`
- Button secondary: `border-2 border-blue-400/50 px-8 py-3 hover:border-blue-400`
- Card: `border-2 border-blue-400/20 p-6 bg-blue-400/5 rounded-lg hover:border-blue-400/50`
- Stat card: `border-2 border-blue-400/20 p-6 bg-blue-400/5 text-center`
- Gradient text: `bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent`

---

## 🚀 Pages to Update

1. **Home Page** (`/`) - Clean hero, stats, how it works
2. **Dashboard** (`/dashboard`) - Already updated ✓
3. **Learn** (`/learn`) - Already updated ✓
4. **Simulate** (`/simulate`) - Add darker theme, polish
5. **Leaderboard** (`/leaderboard`) - Rankings with consistent styling
6. **Search** (`/search`) - Search interface with card results
7. **Certificates** (`/certificates`) - Gallery of credentials
8. **Freelancer Profile** (`/freelancer/[address]`) - Profile card + stats
9. **Certificate Detail** (`/certificate/[id]`) - Full certificate view
10. **Portfolio** (`/portfolio`) - User's project showcase

---

## 🎨 Future Enhancements

- Dark mode toggle (system preference)
- Animation library (Framer Motion)
- Data visualization improvements (Recharts upgrades)
- Progressive image loading
- Web font optimization (Monospace font subsetting)
