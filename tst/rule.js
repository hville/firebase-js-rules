var t = require('cotest'),
		R = require('../src/rule')

t('type, primitive true/false/array', ()=>{
	var tgt = JSON.parse(`{
		"rules": {
			"foo": {
				".read": true,
				".write": false,
				".indexOn": ["height", "length"]
			}
		}
	}`)
	var foo = R()
			.read(true)
			.write(false)
			.indexOn(['height', 'length'])
	t('===', foo['.write'], tgt.rules.foo['.write'])
	t('===', foo['.read'], tgt.rules.foo['.read'])
	t('{==}', foo['.indexOn'], tgt.rules.foo['.indexOn'])
	t('{==}', foo, tgt.rules.foo)
}, true)

t('type, concat rules', ()=>{
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
			.write('$uid', '===', 'auth.uid')
	t('===', $uid['.write'], tgt.rules.users.$uid['.write'])
	t('{==}', $uid, tgt.rules.users.$uid)
})

t('type, concat longer rules rules', ()=>{
	var tgt = JSON.parse(`{
		"rules": {
			".write": "!data.exists() && newData.child('user_id').val() == auth.uid"
		}
	}`)
	var $uid = R()
			.write('!data.exists()', '&&', 'newData.child(\'user_id\').val()', '==', 'auth.uid')
	t('===', $uid['.write'], tgt.rules['.write'])
	t('{==}', $uid, tgt.rules)
})

t('type, function', ()=>{
	var tgt = JSON.parse(`{
		"rules": {
			".write": "!data.exists() && newData.child('user_id').val() == auth.uid"
		}
	}`)
	var $uid = R().write(function check() {
		return !data.exists() && newData.child('user_id').val() == auth.uid
	})
	t('===', $uid['.write'], tgt.rules['.write'])
	t('{==}', $uid, tgt.rules)
})
