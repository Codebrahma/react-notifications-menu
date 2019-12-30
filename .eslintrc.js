module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["airbnb"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  parser: "babel-eslint",
  plugins: ["react"],

  rules: {
    "react/jsx-filename-extension": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "function-paren-newline": ["error", "consistent"],
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["to", "onClick"]
      }
    ],
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-autofocus": "off",
    "no-underscore-dangle": 0,
    "comma-dangle": ["error", "never"],
    "react/jsx-props-no-spreading": "off",
    "react/jsx-fragments": "off"
  }
};
