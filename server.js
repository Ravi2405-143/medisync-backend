const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let medications = [];

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MediSync Backend API is running!' });
});

// Get all medications
app.get('/api/medications', (req, res) => {
  res.json(medications);
});

// Add new medication
app.post('/api/medications', (req, res) => {
  const medication = {
    id: Date.now(),
    name: req.body.name,
    dosage: req.body.dosage,
    frequency: req.body.frequency,
    time: req.body.time
  };
  medications.push(medication);
  res.json(medication);
});

// Delete medication
app.delete('/api/medications/:id', (req, res) => {
  medications = medications.filter(m => m.id !== parseInt(req.params.id));
  res.json({ message: 'Medication deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MediSync backend running on port ${PORT}`);
});
