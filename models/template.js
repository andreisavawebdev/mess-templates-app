const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  title: {
    type: String,
    uppercase: true,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    lowercase: true,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Template', TemplateSchema);
