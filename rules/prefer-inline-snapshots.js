'use strict';

const getDocsUrl = require('./util').getDocsUrl;

module.exports = {
  meta: {
    docs: {
      url: getDocsUrl(__filename),
    },
    fixable: 'code',
  },
  create(context) {
    // TODO what's a better name for this
    function reportWithFixer(node, name) {
      context.report({
        fix(fixer) {
          return [fixer.replaceText(node.callee.property, name)];
        },
        message: 'Use {{ name }}() instead',
        data: { name },
        node: node.callee.property,
      });
    }
    return {
      'CallExpression[callee.property.name="toMatchSnapshot"]'(node) {
        reportWithFixer(node, 'toMatchInlineSnapshot');
      },
      'CallExpression[callee.property.name="toThrowErrorMatchingSnapshot"]'(
        node
      ) {
        reportWithFixer(node, 'toThrowErrorMatchingInlineSnapshot');
      },
    };
  },
};
