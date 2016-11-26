var variables = require('./variables')

/*
optionally sets global firebase rule variables (auth, root, newData...)
the alternative is to use them as R.auth, R.root...
*/

module.exports = setGlobal

function setGlobal() {
	for (var k of Object.keys(variables)) {
		if (global.hasOwnProperty[k]) console.log('can\'t assign', k, 'to global')
		else global[k] = variables[k]
	}
}

