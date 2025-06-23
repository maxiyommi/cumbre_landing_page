# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page HTML website for "Cumbre IA" - an AI consulting company that provides AI solutions, chatbots, and technology consulting for small and medium businesses (PyMEs) in Argentina.

## Architecture

- **Single HTML file**: `main.html` contains the complete website
- **Embedded CSS**: All styles are contained within `<style>` tags in the HTML head
- **Embedded JavaScript**: All functionality is contained within `<script>` tags at the end of the HTML body
- **Static assets**: Images (cumbre.png, cumbre.svg, robot.png, path30.png) for visual elements

## Key Components

### HTML Structure
- Semantic HTML5 sections: header, hero, features, services, FAQ, contact, footer
- Responsive navigation with mobile menu toggle
- Contact form with validation
- FAQ section with collapsible items

### CSS Architecture
- CSS custom properties (variables) for consistent theming
- Glassmorphism design with backdrop filters
- AI-themed gradient color palette
- Responsive design with mobile-first approach
- Custom animations and transitions

### JavaScript Features
- `AILandingPage` class manages all site interactions
- Intersection Observer for scroll-based animations and navigation
- Form validation and submission handling
- Mobile menu functionality
- FAQ toggle functionality
- Scroll-based header styling
- Parallax and animation effects

## Development Commands

Since this is a static HTML website, there are no build commands. To work with this project:

- **View locally**: Open `main.html` in a web browser
- **Live server**: Use any static file server (e.g., Python's `python -m http.server` or Node's `npx serve`)
- **Edit**: Modify the HTML file directly - all code is contained within it

## Key Features to Maintain

- Responsive design that works on mobile, tablet, and desktop
- AI-themed visual design with mountain/summit metaphors
- Spanish language content targeting Argentine PyME market
- Smooth scroll navigation and intersection observer animations
- Form validation with AI-themed success messaging
- FAQ functionality with smooth expand/collapse
- Mobile menu with proper accessibility attributes

## Content Strategy

The site uses mountaineering metaphors ("cumbre" means summit) to represent the journey of digital transformation with AI. Key messaging focuses on:
- Guiding businesses from "digital valley" to "digital summit"
- AI as a 24/7 digital guide
- Automation that frees business owners to focus on growth
- Step-by-step implementation approach