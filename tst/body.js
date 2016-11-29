var t = require('cotest'),
		B = require('../src/body')

function throws(f, a, m) {
	try {
		f(a)
		t('==', true, false, m) //fails
	}
	catch(e) {
		t('!!', e) //pass
	}
}

t('body - reject non arrow functions', ()=>{
	throws(B, function(){}, 'arrow functions only')
	throws(B, function(a){return a}, 'arrow functions only')
})
t('body - reject arrow function statements', ()=>{
	throws(B, ()=>{}, 'arrow functions statements not permitted')
	throws(B, (a)=>{a}, 'arrow functions statements not permitted') /* eslint no-unused-expressions: 0 */
	throws(B, (a)=>{return a}, 'arrow functions statements not permitted')
})
t('body - reject external closure variables', ()=>{
	var closure = 'closure'
	throws(B, ()=>closure, 'all variables must be declared')
	throws(B, auth => auth + closure, 'all variables must be declared')
})
t('body - reject internal functions', ()=>{
	throws(B, $v=>()=>$v, 'no internal functions')
	throws(B, auth => function(){return auth}, 'all variables must be declared')
})
t('body - reject global variables and reserved words', ()=>{
	throws(B, $v => Object.assign($v), 'no internal functions')
	throws(B, auth => delete auth.id, 'all variables must be declared')
})

t('body - handles inline and multiline comments', ()=>{
	var fcn = ( /* inline comment1 */ auth,
		// inline comments2
		now /*
		multiline comment
		*/, $var ) => /*
		multiline comment
		*/
		auth /* inline comment1 */ + now // inline comments2
		+ $var /*
		multiline comment
		*/
		/*
		multiline comment
		*/
		+ 'x' /* inline comment1 */ // inline comments2
		/* inline comment1 */
	t('===', B(fcn), 'auth + now + $var + \'x\'')
})
