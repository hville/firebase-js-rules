'use strict'
var tape = require('short-tape')
var R = require('./index');


tape('path', function(t) {
	t.equal(
		"root",
		R.root().path,
		'same path with no parameters'
	)

	t.equal(
		"root.child($uid)",
		R.root('$uid').path,
		'same path with variable'
	)

	t.equal(
		"root.child('uid')",
		R.root('uid').path,
		'same path with string'
	)

	t.equal(
		"root.child($uid/'uid')",
		R.root('$uid/uid').path,
		'same path with list of branches'
	)

	t.end()
})


tape('path methods', function(t) {

	t.equal(
		"root.child($uid/'uid').val()",
		R.root('$uid/uid').val(),
		'same path with val'
	)

	t.equal(
		"root.child($uid/'uid').val()===auth.id",
		R.root('$uid/uid').isAuth(),
		'isAuth string'
	)

	t.end()
})
