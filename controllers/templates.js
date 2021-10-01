const Template = require('../models/template');
const catchAsync = require('../utils/catchAsync');

module.exports.showAll = catchAsync(async (req, res) => {
  const templates = await Template.find({ author: req.user._id });
  res.render('templates/index', { templates });
});

module.exports.showGeneral = catchAsync(async (req, res, next) => {
  const templates = await Template.find({
    category: 'general',
    author: req.user._id,
  });
  res.render('templates/general', { templates });
});

module.exports.showFactura = catchAsync(async (req, res, next) => {
  const templates = await Template.find({
    category: 'factura',
    author: req.user._id,
  });
  res.render('templates/factura', { templates });
});

module.exports.showAbonamente = catchAsync(async (req, res, next) => {
  const templates = await Template.find({
    category: 'abonamente',
    author: req.user._id,
  });
  res.render('templates/abonamente', { templates });
});

module.exports.showRoaming = catchAsync(async (req, res, next) => {
  const templates = await Template.find({
    category: 'roaming',
    author: req.user._id,
  });
  res.render('templates/roaming', { templates });
});

module.exports.showMyOrange = catchAsync(async (req, res, next) => {
  const templates = await Template.find({
    category: 'my orange',
    author: req.user._id,
  });
  res.render('templates/myorange', { templates });
});

module.exports.showYoxo = catchAsync(async (req, res, next) => {
  const templates = await Template.find({
    category: 'yoxo',
    author: req.user._id,
  });
  res.render('templates/yoxo', { templates });
});

module.exports.showRetea = catchAsync(async (req, res, next) => {
  const templates = await Template.find({
    category: 'retea',
    author: req.user._id,
  });
  res.render('templates/retea', { templates });
});

module.exports.showNewTemplateForm = (req, res) => {
  console.log(req.originalUrl);
  res.render('templates/new');
};

module.exports.createNewTemplate = catchAsync(async (req, res) => {
  const template = new Template(req.body.template);
  template.author = req.user._id;
  await template.save();
  req.flash('success', 'Successfully made a new template!');
  res.redirect(`/templates/${template.category}`);
});

module.exports.showEditTemplateForm = catchAsync(async (req, res, next) => {
  const template = await Template.findById(req.params.id);
  res.render('templates/edit', { template });
});

module.exports.editTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const template = await Template.findByIdAndUpdate(id, {
    ...req.body.template,
  });
  req.flash('success', 'Successfully updated template!');
  res.redirect(`/templates/${req.body.template.category}`);
});

module.exports.deleteTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const template = await Template.findById(id);
  await Template.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted template!');
  res.redirect(`/templates/${template.category}`);
});
