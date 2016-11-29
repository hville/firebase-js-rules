var variables = require('./variables')

var RE_COMMENTS = /\/\/.*\n|\/\*[^*]*(?!\/)\*\//g,
		RE_ARROW = /=>/,
		RE_NOTINBODY = /[^A-Za-z0-9_$]*(Object|Array|function|delete|for|new)[^A-Za-z0-9_$]/g,
		RE_MULTISPACES = /\s+/g

module.exports = fbody

/**
 * Extracts the body of an arrow function after testing it's validity
 * @param {any} fcn - arrow function expression () => result
 * @returns {string} - function body
 */
function fbody(fcn) {
	var parts = fcn.toString().replace(RE_COMMENTS,'').split(RE_ARROW)
	if (parts.length < 2) throw Error('Rule logic function must be in Arrow format (i.e "...=>..." )')

	var args = parts[0].replace(/[\(\)\s]+/g, '').split(',').filter(a => a !== ''),
			body = parts[1].replace(RE_MULTISPACES, ' ').trim()
	if (body[0] === '{') throw Error('Rule logic function body must be an expression without curly braces')
	if (body.search(RE_NOTINBODY) !== -1 || parts.length > 2) throw Error('Expression must conform to Firebase language subset')
	args.forEach((a)=>{
		if (variables[a] === undefined && a[0] !== '$') throw Error('argument "'+a+'" is not a valid firebase variable')
	})
	// test that the function runs outside of it's closure

	var noClosureFunction = new Function(args, body)
	noClosureFunction.apply(null, args.map(a => a[0] === '$' ? a : variables[a]))
	return body
}
