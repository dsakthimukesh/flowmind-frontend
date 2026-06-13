# FlowMind AI Deployment Guide

This document outlines deployment rules and env variables configs.

## Environment Variables

Ensure the following variables are defined in `.env.production` or configuration environments:

```env
# Backend API service URL target
VITE_API_BASE_URL=https://api.flowmind.ai/api

# WebSocket realtime logs streaming URL target
VITE_SOCKET_URL=https://api.flowmind.ai
```

## Build Script Pipeline

To compile and package the application for production, execute the following script:

```bash
# Clean install dependencies
npm ci

# Compile typescript checks and run vite build
npm run build
```

This generates static HTML/JS/CSS assets inside the `dist/` directory.

## Web Server Requirements

Because we use React Router with client-side history API routing, ensure your production web server (Nginx, Vercel, Netlify, Cloudflare, etc.) is configured to redirect all fallbacks back to `index.html`.

### Nginx Example configuration
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
