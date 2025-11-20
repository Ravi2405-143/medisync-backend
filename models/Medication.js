const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily'
    },
    timesPerDay: Number,
    specificDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    times: [String]
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  instructions: String,
  inventory: {
    totalQuantity: Number,
    currentQuantity: Number,
    refillThreshold: Number,
    lastRefillDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate next reminder time
medicationSchema.methods.getNextReminderTime = function() {
  const now = new Date();
  const today = now.toDateString();
  
  for (const timeStr of this.frequency.times) {
    const [hours, minutes] = timeStr.split(':');
    const reminderTime = new Date(`${today} ${hours}:${minutes}:00`);
    
    if (reminderTime > now) {
      return reminderTime;
    }
  }
  
  // If all reminders passed today, return first reminder tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [hours, minutes] = this.frequency.times[0].split(':');
  return new Date(`${tomorrow.toDateString()} ${hours}:${minutes}:00`);
};

// Auto-complete medication if end date passed
medicationSchema.methods.checkCompletion = function() {
  const now = new Date();
  if (this.endDate && new Date(this.endDate) < now && !this.isCompleted) {
    this.isCompleted = true;
    return true;
  }
  return false;
};

module.exports = mongoose.model('Medication', medicationSchema);