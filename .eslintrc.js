/**
 * ESLINT rules
 * @author Félix Brunet
 * @name nodeDevelopment
 * @version 1.0.0
 *
 * A mettre dans le root
 */
module.exports = {
    "env": {
        "node": true,
        "es6": true,
    },
    "sourceType": "module",
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        //"linebreak-style": false,
        "quotes": [
            "error",
            "double",
            "avoid-escape"
        ],
        "semi": [
            "error",
            "always"
        ],
        "dot-location": ["error", "property"],
        "no-unused-vars": ["error", {"argsIgnorePattern": "req|res|next"}],
        "no-console": "off",
        "no-inner-declarations": "off",
        "consistent-return": "error",
        "no-eval": "error",
        "no-eq-null": "error", //=== null only
        "no-new": "error", //only in assign
        "no-proto": "error",
        "no-return-assign": "error",
        "no-return-await": "error",
        "no-with": "error",
        "no-use-before-define": ["error", "nofunc"],
        //style,
        "comma-spacing": "error",
        "func-call-spacing": "error",
        "key-spacing": "error",
        "max-len": ["error", {
            "code": 110,
            "ignoreComments": true,
            "ignoreUrls": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true,
            "ignoreRegExpLiterals": true
        }],
        "max-lines": ["error", {
            "max": 300,
            "skipComments": true
        }],
        "max-nested-callbacks": ["error", 5],
        "no-array-constructor": "error",
        "no-bitwise": ["error", {"allow": ["~"]}],
        "no-continue": "error",
        "no-lonely-if": "error",
        "no-mixed-operators": "error",
        "no-multi-assign": "error",
        "no-multiple-empty-lines": "error",
        "no-new-object": "error",
        "no-restricted-syntax": ["error",
            "WithStatement", //with
            "ForOfStatement", //remove for loop.
            "ForInStatement", //remove for in, for of -> use Array.forEach
            "ForStatement",
            "SwitchStatement", //remove switch -> use object/Map instead.
            "SwitchCase",
            "ClassDeclaration[id.name!=/^.*Error$/]", //remove class expect Error class
        ],
        "no-trailing-spaces": "error",
        "no-unneeded-ternary": ["error", {"defaultAssignment": false}],
        "no-whitespace-before-property": "error",
        "nonblock-statement-body-position": "error",
        "object-curly-newline": "error",
        "object-curly-spacing": "error",
        "one-var": ["error", "never"],
        "operator-linebreak": ["error", "after"],
        "space-before-blocks": "error",
        "template-tag-spacing": "error",
        "no-duplicate-imports": "error",
        "no-useless-computed-key": "error",
        "no-useless-rename": "error",
        "no-var": "error",
        "prefer-const": ["error", {"ignoreReadBeforeAssign": false}],
        "prefer-template": "error",
        "template-curly-spacing": "error"
    }
};