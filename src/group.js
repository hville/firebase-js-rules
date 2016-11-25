var types = require('./types')

module.exports = group

function group(obj) {
	return new Group(obj)
}
function Group(obj) {
	if (obj) Object.assign(this, obj)
}
Group.prototype = Object.assign({constructor: Group}, types)
