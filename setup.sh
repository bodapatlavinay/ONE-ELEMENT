#!/bin/bash
echo "⬡ ONE ELEMENT STORE — Setup Script"
echo "===================================="

# Kill any stale cache
echo "→ Clearing stale caches..."
rm -rf .angular node_modules package-lock.json

# Install fresh
echo "→ Installing dependencies (this takes ~2 min)..."
npm install

echo ""
echo "✅ Done! Starting dev server..."
echo "→ Open: http://localhost:4200"
echo ""
npm start
