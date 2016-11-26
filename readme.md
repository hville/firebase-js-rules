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
      .write(true)
      .validate(newData.hasChildren(['name', 'age']))
  }
}

//write to file
JS.save('./firebase-rules.json')
```

## Features

* friendly with other javascript tools (linters, highlighers, autosuggest)
* variables to individually define and re-use rule-sets or rule-templates
* commonJS module to individually prepare and test sets of rules and group them last

To other tools already exist:

* [firebase-bolt](https://github.com/firebase/bolt) a YAML format that requires learning another API and format
* [firebase-blaze](https://github.com/firebase/bolt) another YAML format - DEPRECATED

## API

`R([template])` => `ruleObject` with the following methods
* `.read(logic)` => `ruleObject` with added property
* `.write(logic)` => `ruleObject` with added property
* `.indexOn(logic)` => `ruleObject` with added property
* `.child([template])` => assigns template object or `ruleObject` to the current `ruleObject`
* `.save([fileName])` nest in `{rules: ruleObject}` and saves to a JSON file

`ruleLogic`
* a string or strings to be concatenated: `R().write('$uid', '===', 'auth.uid')`
* `firebase` variable methods: `R().write(newData.child('user_id').val())`
* a function: `R().write(function() {return !this.data.exists() && this.newData.child('user_id').val() == this.auth.uid}`
  * the function style is to cover cases with many operators (eg. `!`, `&&`, `==`). No arrow function since the function is binded to the variables for validation

## Not yet implemented

* string variable methods (`.contains()`, `.beginsWith()`, `endsWith()`, `.replace()`, ...)
* sugar for common operators (`=== null`, ...)

# License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)
