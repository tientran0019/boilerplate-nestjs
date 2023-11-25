module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		"@typescript-eslint/naming-convention": [
			"error",
			{
				"selector": "class",
				"format": [
					"PascalCase"
				]
			},
			{
				"selector": "typeParameter",
				"format": [
					"PascalCase"
				]
			},
			{
				"selector": "enum",
				"format": [
					"PascalCase"
				]
			},
			// {
			// 	"selector": "enumMember",
			// 	"format": [
			// 		"PascalCase"
			// 	]
			// },
			{
				"selector": "typeAlias",
				"format": [
					"PascalCase"
				]
			},
			{
				"selector": "interface",
				"format": [
					"PascalCase"
				]
				// "prefix": [
				// 	"I"
				// ]
			}
		],
		"@typescript-eslint/no-misused-promises": [
			"error",
			{
				"checksVoidReturn": false
			}
		],
		"@typescript-eslint/ban-ts-comment": "off",
		"quotes": [
			"error",
			"single",
			{
				"allowTemplateLiterals": true
			}
		],
		"max-len": "off",
		"comma-dangle": [
			"error",
			"always-multiline"
		],
		"indent": [
			2,
			"tab",
			{
				"SwitchCase": 1,
				// "FunctionExpression": {
				// 	"body": 1,
				// 	"parameters": 0
				// },
				"MemberExpression": 1,
				"ignoredNodes": [
					"PropertyDefinition",
					"FunctionExpression > .params[decorators.length > 0]",
					"FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
					"ClassBody.body > PropertyDefinition[decorators.length > 0] > .key"
				]
			}
		],
		"array-bracket-spacing": [
			"error",
			"never"
		],
		"object-curly-spacing": [
			"error",
			"always"
		],
		"no-unused-private-class-members": "error",
		"no-unused-vars": [
			"error",
			{
				"vars": "all",
				"args": "none",
				"ignoreRestSiblings": true
			}
		],
		"semi": [
			"error",
			"always"
		],
		"no-empty": "warn",
		"no-cond-assign": [
			"error",
			"always"
		]
	},
	"globals": {
		"fetch": true,
		"__DEV__": true,
		"FormData": true
	}
};
