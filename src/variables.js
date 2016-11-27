var dataSnap = { /* eslint no-unused-vars: 0 */
	val: ()=>'val',
	child: path => Object.assign({}, dataSnap),
	parent: () => Object.assign({}, dataSnap),
	hasChild: childPath => true,
	hasChildren: children => true,
	exists: () => true,
	getPriority: () => 'getPriority',
	isNumber: () => true,
	isString: () => true,
	isBoolean: () => true,
	length: 0,
	contains: substring => true,
	beginsWith: substring => true,
	endsWith: substring => true,
	replace: (substring, replacement) => 'replace',
	toLowerCase: () => 'tolowercase',
	toUpperCase: () => 'TOUPPERCASE',
	matches: regex => true
}
var mockVars = {
	now: Date.now(),
	root: Object.assign({}, dataSnap),
	newData: Object.assign({}, dataSnap),
	data: Object.assign({}, dataSnap),
	auth: {
		provider: 'provider',
		uid: 'uid',
		token: {
			email: 'email',
			email_verified: true,
			name: 'name',
			sub: 'sub',
			firebase: {
				identities: {
					email: [],
					'google.com': [],
					'facebook.com': [],
					'github.com': [],
					'twitter.com': []
				},
				sign_in_provider: 'sign_in_provider'
			}
		}
	}
}

module.exports = mockVars
