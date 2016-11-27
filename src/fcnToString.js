// to ensure expression only, only allow arrow function () => result
// test by passing argument, return the function body
function toString(fcn) {
	var parts = fcn.toString().split('=>'),
			args = parts[0].replace(/[\(\)\s]+/g, '').split(','),
			body = parts[1].replace(/\s+/, ' ').trim()
	// run the function to test that methods exist
	fcn.apply(variables, args.map(a => a[0] === '$' ? a : variables[a]))
	return body
}
