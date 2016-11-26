var variables = require('./src/variables'),
		rule = require('./src/rule'),
		save = require('./src/save')

rule.save = save
for (var k of Object.keys(variables)) rule[k] = variables[k]

module.exports = rule
