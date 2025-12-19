const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['transactions', 'user-activity'],
      required: true,
    },
    data: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
