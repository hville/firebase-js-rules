var auth = new String('auth') /* eslint no-new-wrappers: 0 */
auth.provider = 'auth.provider'
auth.uid = 'auth.uid'
auth.token = 'auth.token'
//TODO auth.token...

var variables = {
	auth: auth,
	now: 'now',
	$: function(str) { return '$' + str },
	get root() { return new Rule('root') },
	get data() { return new Rule('data') },
	get newData() { return new Rule('newData') }
}

module.exports = variables


function Rule(prefix) {
	this.$rule = prefix || ''
}
Rule.prototype = {
	constructor: Rule,
	val: stringMethod('val'),
	child: child,
	parent: parent,
	hasChild: stringMethod('hasChild'),
	hasChildren: stringMethod('hasChildren'),
	exists: stringMethod('exists'),
	isBoolean: stringMethod('isBoolean'),
	isAuth: stringMethod('isAuth'),
	isEqual: stringMethod('isEqual'),
	isNumber: stringMethod('isNumber'),
	isString: stringMethod('isString'),
	getPriority: stringMethod('getPriority')
	//TODO str.contains(), .beginsWith(), endsWith(), .replace(), ...
}
function stringMethod(functionName) {
	return function(arg) {
		var str = arg === undefined ? ''
			: typeof arg === 'string' ? pathString(arg)
			: JSON.stringify(arg).replace(/"/g,'\'')
		return (this.$rule + '.' + functionName + '(' + str + ')')
	}
}
function child() {
	for (var i=0; i<arguments.length; ++i) {
		if (arguments[i] !== undefined) {
			this.$rule += '.child(' + pathString(arguments[i]) + ')'
		}
	}
	return new Rule(this.$rule)
}
function parent(str) {
	if (str !== undefined) this.path += '.parent(' + pathString(str) + ')'
	return new Rule(this.$rule)
}

/**
 * parse string including path items
 * leave code as-is and wrap strings in single quotes
 * @param {string} str - path string
 * @returns {string} - path string with internal quotations
 */
function pathString(str) {
	if (str === undefined) return ''
	if (typeof str !== 'string') return str //.toString()
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
	var QUOTE = '\'',
			QUOTED = /^['"].*['"]/
	if (str === undefined) return ''
	if (variables[str]) return str
	if (str[0] === '$' || QUOTED.test(str)) return str
	var first = str.split('.')[0]
	if (variables[first]) return str
	return QUOTE + str + QUOTE
}
