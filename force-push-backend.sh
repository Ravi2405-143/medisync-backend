#!/bin/bash
echo "🚀 Force pushing backend to GitHub..."

cd /home/lenovo/projects/medisync/backend

echo "1. Checking current files..."
ls -la

echo "2. Setting up git..."
git init
git config user.name "Ravi2405-143"
git config user.email "kravitejasaisatyam@gmail.com"

echo "3. Adding files..."
git add .

echo "4. Committing..."
git commit -m "feat: Add MediSync backend with Express API"

echo "5. Force pushing to GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Ravi2405-143/medisync-backend.git
git branch -M main
git push -f origin main

echo ""
echo "✅ Backend successfully pushed to GitHub!"
echo "🌐 Repository: https://github.com/Ravi2405-143/medisync-backend"
