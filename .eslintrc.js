module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "no-unused-vars": "warn" // <-- ДОБАВЛЕНА ЭТА СТРОКА
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
};
