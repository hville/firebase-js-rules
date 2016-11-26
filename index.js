var globals = require('./src/global'),
		variables = require('./src/variables'),
		rule = require('./src/rule'),
		save = require('./src/save')

//add main utilities
rule.globals = globals
rule.save = save

//add variable names in case globals won't be used
for (var k of Object.keys(variables)) rule[k] = variables[k]

module.exports = rule
