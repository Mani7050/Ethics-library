const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    duration: { type: String, default: 'Monthly' },
    type: { type: String, default: 'Standard' },
    desc: { type: String, required: true },
    iconName: { type: String, default: 'Award' },
    color: { type: String, default: 'border-zinc-200 dark:border-zinc-800' }
  },
  {
    timestamps: true,
    collection: 'plans'
  }
);

module.exports = mongoose.model('Plan', planSchema);
