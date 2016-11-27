<!-- markdownlint-disable MD004 MD007 MD010 MD041 MD022 MD024 MD032 -->
# firebase-js-rules

*firebase rules, javascript style* -
***EXPERIMENTAL, tested but not used in production***

The current way to create security rules for [firebase](https://firebase.google.com)
is to edit a JSON file and then validate.
Single file, no variables, no comments, no syntax highlighting, lots of repetitions.

• [Example](#example) • [Features](#features) • [API](#api) • [License](#license)

## Example

```javascript
var R = require('../index')

var rulesJSON = JSON.parse(`{
  "users": {
    "$user": {
      ".read": true,
      ".write": true,
      ".validate": "newData.hasChildren(['name','age'])"
    }
  }
}`)

//produces the same result (rJSON deep equal rJS)
var rulesJS = {
  users: {
    $user: R()
      .read(true)
      .write((auth, $user) => $user === auth.uid)
      .validate(newData => newData.hasChildren(['name', 'age']))
  }
}

//write to file
JS.save('./firebase-rules.json')
```

## Features

* friendly with other javascript tools: *linters*, *highlighers*, *autosuggest*, ...
* variables to individually define, re-use or augment rule-sets or rule-templates
* commonJS module to individually prepare and test sets of rules and group them last

Two other tools already exist:

* [firebase-bolt](https://github.com/firebase/bolt) a YAML format that requires learning another syntax
* [firebase-blaze](https://github.com/firebase/bolt) another YAML format - DEPRECATED

## API

`R([template])` => `ruleObject` with the following methods
* `.read(logic)` => `ruleObject` with added property
* `.write(logic)` => `ruleObject` with added property
* `.indexOn(logic)` => `ruleObject` with added property
* `.save([fileName])` nest in `{rules: ruleObject}` and saves to a JSON file

rule `logic` is either
* a JSON primitive to be used as-is: `string`, `boolean`
* an arrow-function expression: `(auth, data, newData) => !data.exists() && newData.child('user_id').val() == auth.uid`
  * Only arrow functions and no curly braces to only allow expressions
  * Function is run before extrating the body string to make sure that the variables methods are allowed

# License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)
