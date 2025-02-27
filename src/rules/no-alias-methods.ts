import {
  createRule,
  isExpectCall,
  parseExpectCall,
  replaceAccessorFixer,
} from './utils';

export default createRule({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow alias methods',
      recommended: false,
    },
    messages: {
      replaceAlias: `Replace {{ alias }}() with its canonical name of {{ canonical }}()`,
    },
    fixable: 'code',
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // map of jest matcher aliases & their canonical names
    const methodNames: Record<string, string> = {
      toBeCalled: 'toHaveBeenCalled',
      toBeCalledTimes: 'toHaveBeenCalledTimes',
      toBeCalledWith: 'toHaveBeenCalledWith',
      lastCalledWith: 'toHaveBeenLastCalledWith',
      nthCalledWith: 'toHaveBeenNthCalledWith',
      toReturn: 'toHaveReturned',
      toReturnTimes: 'toHaveReturnedTimes',
      toReturnWith: 'toHaveReturnedWith',
      lastReturnedWith: 'toHaveLastReturnedWith',
      nthReturnedWith: 'toHaveNthReturnedWith',
      toThrowError: 'toThrow',
    };

    return {
      CallExpression(node) {
        if (!isExpectCall(node)) {
          return;
        }

        const { matcher } = parseExpectCall(node);

        if (!matcher) {
          return;
        }

        const alias = matcher.name;

        if (alias in methodNames) {
          const canonical = methodNames[alias];

          context.report({
            messageId: 'replaceAlias',
            data: {
              alias,
              canonical,
            },
            node: matcher.node.property,
            fix: fixer => [
              replaceAccessorFixer(fixer, matcher.node.property, canonical),
            ],
          });
        }
      },
    };
  },
});
