var variables = require('./variables')
/*
utility to create ruleset. eg.
var myrule = rule()
		.write(true)
		.validate(()=>{return auth === true})
		.nest({
			//more rules
		})
*/
module.exports = rule

function rule(obj) {
	return new Rule(obj)
}
function Rule(obj) {
	if (obj) Object.assign(this, obj)
}
Rule.prototype = {
	constructor: Rule,
	read: makeType('read'),
	write: makeType('write'),
	validate: makeType('validate'),
	indexOn: makeType('indexOn')
}
function cType(t) {
	return t === undefined ? undefined : t === null ? null : t.constructor || Object
}

// either concat inputs, or stringify function or leave single arg as-is
function makeType(type) {
	var prop = '.' + type
	return function(logic) {
		switch (cType(logic)) {
			case undefined:
				return this
			case Function:
				this[prop] = toString(logic)
				return this
			default:
				this[prop] = logic
				return this
		}
	}
}
// to ensure expression only, only allow arrow function () => result
// test by passing argument, return the function body
function toString(fcn) {
	var parts = fcn.toString().split('=>')
	if (parts.length !== 2) throw Error('Rule logic function must be in Arrow format (i.e "...=>..." )')

	var args = parts[0].replace(/[\(\)\s]+/g, '').split(','),
			body = parts[1].replace(/\s+/g, ' ').trim()
	if (body[0] === '{') throw Error('Rule logic function body must be an expression without curly braces')

	args.forEach((a)=>{
		if (variables[a] === undefined && a[0] !== '$') throw Error('argument "'+a+'" is not a valid firebase variable')
	})

	fcn.apply(null, args.map(a => a[0] === '$' ? a : variables[a]))
	return body
}
