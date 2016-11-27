var t = require('cotest'),
		R = require('../src/rule')

function compareKeys(s, r) {
	var keys = new Set(Object.keys(s).concat(Object.keys(r)))
	for (var k of keys) {
		t('===', typeof s[k], typeof r[k], 'key: '+k)
		t('{==}', s[k], r[k], 'key: '+k)
	}
}

t('rule: primitive true/false/array', ()=>{
	var tgt = JSON.parse(`{
		".read": true,
		".write": false,
		".indexOn": ["height", "length"]
	}`)
	var foo = R()
			.read(true)
			.write(false)
			.indexOn(['height', 'length'])

	compareKeys(foo, tgt)
})

t('rule: string', ()=>{
	var tgt = JSON.parse(`{
		"rules": {
			"users": {
				"$uid": {
					".write": "$uid === auth.uid"
				}
			}
		}
	}`)
	var $uid = R()
			.write('$uid === auth.uid')
	compareKeys($uid, tgt.rules.users.$uid)
})

t('rule: function', ()=>{
	var tgt = JSON.parse(`{
		"rules": {
			".write": "!data.exists() && newData.child('user_id').val() == auth.uid"
		}
	}`)
	var $uid = R()
	.write((data, auth, newData) =>
		!data.exists()
		&& newData.child('user_id').val() == auth.uid /* eslint eqeqeq:0 */
	)
	t('===', $uid['.write'], tgt.rules['.write'])
	t('{==}', $uid, tgt.rules)
	compareKeys($uid, tgt.rules)
})
