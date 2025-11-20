#!/bin/bash
echo "🚀 Setting up backend and pushing to GitHub..."

cd /home/lenovo/projects/medisync/backend

echo "1. Checking backend contents..."
ls -la

echo "2. If empty, creating basic backend..."
if [ ! -f "package.json" ]; then
  npm init -y
  cat > server.js << 'SERVER'
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let medications = [];

app.get('/api/medications', (req, res) => {
  res.json(medications);
});

app.post('/api/medications', (req, res) => {
  const medication = {
    id: Date.now(),
    ...req.body
  };
  medications.push(medication);
  res.json(medication);
});

app.delete('/api/medications/:id', (req, res) => {
  medications = medications.filter(m => m.id !== parseInt(req.params.id));
  res.json({ message: 'Medication deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MediSync backend running on port ${PORT}`);
});
SERVER

  npm install express cors
fi

echo "3. Creating .gitignore..."
cat > .gitignore << 'GITIGNORE'
node_modules/
.env
*.log
.DS_Store
GITIGNORE

echo "4. Pushing to GitHub..."
git init
git config user.name "Ravi2405-143"
git config user.email "kravitejasaisatyam@gmail.com"
git add .
git commit -m "feat: Add MediSync backend with medication API"
git remote add origin https://github.com/Ravi2405-143/medisync-backend.git
git branch -M main
git push -f origin main

echo ""
echo "✅ Backend pushed to: https://github.com/Ravi2405-143/medisync-backend"
