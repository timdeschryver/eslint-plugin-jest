'use strict';

const expectCase = require('./util').expectCase;
const getDocsUrl = require('./util').getDocsUrl;
const method = require('./util').method;

// A map of `{ nameToReplace: canonicalName }`.
const methodNames = new Map([
  ['toBeCalled', 'toHaveBeenCalled'],
  ['toBeCalledTimes', 'toHaveBeenCalledTimes'],
  ['toBeCalledWith', 'toHaveBeenCalledWith'],
  ['lastCalledWith', 'toHaveBeenLastCalledWith'],
  ['nthCalledWith', 'toHaveBeenNthCalledWith'],
  ['toReturn', 'toHaveReturned'],
  ['toReturnTimes', 'toHaveReturnedTimes'],
  ['toReturnWith', 'toHaveReturnedWith'],
  ['lastReturnedWith', 'toHaveLastReturnedWith'],
  ['nthReturnedWith', 'toHaveNthReturnedWith'],
  ['toThrowError', 'toThrow'],
]);

module.exports = {
  meta: {
    docs: {
      url: getDocsUrl(__filename),
    },
    fixable: 'code',
  },
  create(context) {
    return {
      CallExpression(node) {
        if (!expectCase(node)) {
          return;
        }

        // Check if the method used matches any of ours.
        const methodNode = method(node);
        const propertyName = methodNode && methodNode.name;
        const methodName = methodNames.get(propertyName);

        if (methodName) {
          context.report({
            message: `Replace {{ replace }}() with its canonical name of {{ canonical }}()`,
            data: {
              replace: propertyName,
              canonical: methodName,
            },
            node: methodNode,
            fix(fixer) {
              return [fixer.replaceText(methodNode, methodName)];
            },
          });
        }
      },
    };
  },
};
