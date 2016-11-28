var body = require('./src/body'),
		save = require('./src/save')
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
	save: save
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
				this[prop] = body(logic)
				return this
			default:
				this[prop] = logic
				return this
		}
	}
}

