const express = require('express');
const router = express.Router();
const templates = require('../controllers/templates');

const { isLoggedIn, isAuthor, validateTemplate } = require('../middleware');

router
  .route('/')
  .get(isLoggedIn, templates.showAll)
  .post(validateTemplate, isLoggedIn, templates.createNewTemplate);

router.get('/general', isLoggedIn, templates.showGeneral);
router.get('/factura', isLoggedIn, templates.showFactura);
router.get('/abonamente', isLoggedIn, templates.showAbonamente);
router.get('/roaming', isLoggedIn, templates.showRoaming);
router.get('/myorange', isLoggedIn, templates.showMyOrange);
router.get('/yoxo', isLoggedIn, templates.showYoxo);
router.get('/retea', isLoggedIn, templates.showRetea);
router.get('/new', isLoggedIn, templates.showNewTemplateForm);

router
  .route('/:id')
  .put(validateTemplate, isLoggedIn, isAuthor, templates.editTemplate)
  .delete(isLoggedIn, isAuthor, templates.deleteTemplate);

router.get('/:id/edit', isLoggedIn, isAuthor, templates.showEditTemplateForm);

module.exports = router;
