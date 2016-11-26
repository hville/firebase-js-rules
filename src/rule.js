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
	indexOn: makeType('indexOn'),
	nest: Object.assign.bind(this)
}

// either concat inputs, or stringify function or leave single arg as-is
function makeType(type) {
	return function(...rules) {
		if (rules.length > 1) this['.'+type] = rules.join(' ')
		//leave primitives as-is if no other rules
		this['.'+type] = rules.length > 1 ? rules.join(' ')
			: typeof rules[0] === 'function' ? toString(rules[0])
			: rules[0]
		return this
	}
}
function toString(fcn) {
	return fcn.toString().replace(/(^.*?\{(\s*return\s*)*|\}$)/g, '').replace(/\s+/, ' ').trim()
}
