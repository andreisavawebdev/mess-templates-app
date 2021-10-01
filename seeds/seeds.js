const mongoose = require('mongoose');
const Template = require('../models/template');
const templates = require('./seedsTemplates');

console.log(templates);

mongoose.connect('mongodb://localhost:27017/mess-templates', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const seedDB = async () => {
  await Template.deleteMany({});
  for (let template of templates) {
    const newTemplate = new Template({
      author: '61570354d38fa7781b8e02b2',
      title: `${template.title}`,
      text: `${template.text}`,
      category: `${template.category}`,
    });
    await newTemplate.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
