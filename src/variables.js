var auth = new String('auth') /* eslint no-new-wrappers: 0 */
auth.provider = 'auth.provider'
auth.uid = 'auth.uid'
auth.token = 'auth.token'
//TODO auth.token...

var variables = {
	auth: auth,
	now: 'now',
	get root() { return new Rule('root') },
	get data() { return new Rule('data') },
	get newData() { return new Rule('newData') }
}

module.exports = variables

function Rule(prefix) {
	this.rule = prefix || ''
}
Rule.prototype = {
	constructor: Rule,
	val: stringFunction('val'),
	child: child,
	parent: parent,
	hasChild: stringFunction('hasChild'),
	hasChildren: stringFunction('hasChildren'),
	exists: stringFunction('exists'),
	isBoolean: stringFunction('isBoolean'),
	isAuth: stringFunction('isAuth'),
	isEqual: stringFunction('isEqual'),
	isNumber: stringFunction('isNumber'),
	isString: stringFunction('isString'),
	getPriority: stringFunction('getPriority')
	//TODO str.contains(), .beginsWith(), endsWith(), .replace(), ...
}
function child() {
	for (var i=0; i<arguments.length; ++i) {
		if (arguments[i] !== undefined) {
			this.rule += '.child(' + pathString(arguments[i]) + ')'
		}
	}
	return new Rule(this.rule)
}
function parent(str) {
	if (str !== undefined) this.path += '.parent(' + pathString(str) + ')'
	return new Rule(this.rule)
}
function stringFunction(functionName) {
	return function(str) {
		return (this.rule += '.' + functionName + '(' + (str ? pathString(str) : '') + ')')
	}
}
/**
 * parse string including path items
 * leave code as-is and wrap strings in single quotes
 * @param {string} str - path string
 * @returns {string} - path string with internal quotations
 */
function pathString(str) {
	if (str === undefined) return ''
	var arr = str.split('/')
	return arr.map(string).join('/')
}
/**
 * parse single key
 * leave code as-is and wrap strings in single quotes
 * @param {string} str - key string
 * @returns {string} - path string with internal quotations
 */
function string(str) {
	var QUOTE = '\''
	if (str === undefined) return ''
	if (variables[str]) return str
	if (str[0] === '$' || str[0] === QUOTE) return str
	var first = str.split('.')[0]
	if (variables[first]) return str
	return QUOTE + str + QUOTE
}
