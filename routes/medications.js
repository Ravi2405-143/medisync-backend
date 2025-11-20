const express = require('express');
const Medication = require('../models/Medication');
const MedicationLog = require('../models/MedicationLog');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all medications for user
router.get('/', auth, async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.userId, isActive: true });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medications', error: error.message });
  }
});

// Add new medication
router.post('/', auth, async (req, res) => {
  try {
    const medication = new Medication({
      userId: req.userId,
      ...req.body
    });
    
    await medication.save();
    res.status(201).json({ message: 'Medication added successfully', medication });
  } catch (error) {
    res.status(500).json({ message: 'Error adding medication', error: error.message });
  }
});

// Update medication
router.put('/:id', auth, async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    res.json({ message: 'Medication updated successfully', medication });
  } catch (error) {
    res.status(500).json({ message: 'Error updating medication', error: error.message });
  }
});

// Delete medication (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive: false },
      { new: true }
    );
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medication', error: error.message });
  }
});

// Log medication taken
router.post('/:id/log', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const medication = await Medication.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    const log = new MedicationLog({
      userId: req.userId,
      medicationId: req.params.id,
      scheduledTime: new Date(),
      takenTime: status === 'taken' ? new Date() : null,
      status,
      notes
    });

    await log.save();

    // Update inventory if medication was taken
    if (status === 'taken' && medication.inventory.currentQuantity > 0) {
      medication.inventory.currentQuantity -= 1;
      await medication.save();
    }

    res.json({ message: 'Medication logged successfully', log });
  } catch (error) {
    res.status(500).json({ message: 'Error logging medication', error: error.message });
  }
});

module.exports = router;