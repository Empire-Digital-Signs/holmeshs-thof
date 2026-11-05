const selectorParser = require('postcss-selector-parser');
const tailwindcss = require('@tailwindcss/postcss');

const kioskPrefix = 'body.holmes-kiosk-page #holmes-public-site';
const kioskPrefixNodes = selectorParser()
	.astSync(kioskPrefix)
	.first.nodes;

const scopeKioskStyles = {
	postcssPlugin: 'scope-holmes-kiosk-styles',
	Once(root) {
		const sourcePath = root.source?.input?.file || '';
		if (!sourcePath.toLowerCase().includes('holmes-public-site')) {
			return;
		}

		root.walkAtRules('layer', (layer) => {
			if (layer.nodes) {
				layer.replaceWith(layer.nodes);
			} else {
				layer.remove();
			}
		});

		root.walkRules((rule) => {
			let ancestor = rule.parent;
			while (ancestor && ancestor.type !== 'root') {
				if (
					ancestor.type === 'atrule' &&
					/keyframes$/i.test(ancestor.name)
				) {
					return;
				}
				ancestor = ancestor.parent;
			}

			rule.selector = selectorParser((selectors) => {
				selectors.each((selector) => {
					const first = selector.nodes[0];
					const replacesRoot =
						first?.type === 'pseudo' && first.value === ':root';
					const replacesDocument =
						first?.type === 'tag' &&
						[ 'body', 'html' ].includes(first.value.toLowerCase());

					if (replacesRoot || replacesDocument) {
						selector.removeChild(first);
					} else {
						selector.prepend(
							selectorParser.combinator({ value: ' ' })
						);
					}

					[ ...kioskPrefixNodes ]
						.reverse()
						.forEach((node) => selector.prepend(node.clone()));
				});
			}).processSync(rule.selector);
		});
	},
};

module.exports = {
	plugins: [ tailwindcss(), scopeKioskStyles ],
};
