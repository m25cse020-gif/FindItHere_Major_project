const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  itemType: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Claimed', 'Rejected'],
    default: 'Pending'
  },
  
  // --- THIS IS THE MISSING PIECE ---
  // This line tells Mongoose to save an 'image' field
  image: {
    type: String,
    default: '' 
  },
  // ----------------------------------

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', ItemSchema);