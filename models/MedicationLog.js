const mongoose = require('mongoose');

const medicationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  takenTime: Date,
  status: {
    type: String,
    enum: ['pending', 'taken', 'missed', 'snoozed'],
    default: 'pending'
  },
  notes: String
}, {
  timestamps: true
});

// Index for efficient queries
medicationLogSchema.index({ userId: 1, scheduledTime: 1 });
medicationLogSchema.index({ medicationId: 1, scheduledTime: 1 });

module.exports = mongoose.model('MedicationLog', medicationLogSchema);