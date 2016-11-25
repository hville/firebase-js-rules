/*
  T.read(users, myRule) => users['.read'] = myRule
	T.read(users, true) => users['.read'] = true
*/


module.exports = {
	read: makeType('read'),
	write: makeType('write'),
	validate: makeType('validate'),
	indexOn: makeType('indexOn')
}

function makeType(type) {
	return function(obj, ...rules) {
		if (rules.length > 1) obj['.'+type] = rules.join(' ')
		//leave primitives as-is if no other rules
		obj['.'+type] = rules.length > 1 ? rules.join(' ')
			: rules[0].constructor === Function ? toString(rules[0])
			: rules[0]
		return obj
	}
}
function toString(fcn) {
	return fcn.toString().replace(/(^.*?\{(\s*return\s*)*|\}$)/g, '').replace(/\s+/, ' ').trim()
}
