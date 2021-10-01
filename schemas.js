const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// THESE ARE VALIDATION SCHEMAS FOR JOI
module.exports.templateSchema = Joi.object({
  template: Joi.object({
    title: Joi.string().required().escapeHTML(),
    text: Joi.string().required().escapeHTML(),
    category: Joi.string().required(),
  }).required(),
});
