var variables = require('./variables')

module.exports = setGlobal

function setGlobal() {
	for (var k of Object.keys(variables)) {
		if (global.hasOwnProperty[k]) console.log('can\'t assign', k, 'to global')
		else global[k] = variables[k]
	}
}

