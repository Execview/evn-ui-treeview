module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "rules": {
  		"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  		"react/jsx-one-expression-per-line": [0, { "allow": "literal"}],
  		"linebreak-style": 0,
  		"react/destructuring-assignment": 0,
  		'max-len': 0,
  		"comma-dangle": 0,
  		"react/prefer-stateless-function": 0,
  		"arrow-body-style": 0,
      "react/prop-types": [0],
      "object-curly-newline": 0,
      "prefer-template":0,
			"indent":0,
      "prefer-destructuring": 0,
      "react/jsx-boolean-value":0,
      "class-methods-use-this":0,
      "no-nested-ternary":0,
      "no-trailing-spaces":0,
      "no-autofocus":0,
      "react/no-access-state-in-setstate": 0,
      "jsx-a11y/no-autofocus": 0,
      "jsx-a11y/click-events-have-key-events":0,
      "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
      "jsx-a11y/no-static-element-interactions": 0,
      "no-tabs": 0,
      "no-restricted-syntax": 0,
      'jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        {
          handlers: [
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
          ],
        },
      ],
	},
  "globals": {
    "document": true,
    "window": true
  }
};
