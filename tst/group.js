var t = require('cotest'),
		R = require('../src/group')

t('type, primitive true/false', ()=>{
	var tgt = JSON.parse(`{
		"rules": {
			"foo": {
				".read": true,
				".write": false
			}
		}
	}`)
	var foo = R()
	foo.read(foo, true)
	foo.write(foo, false)
	t('===', foo['.write'], tgt.rules.foo['.write'])
	t('{==}', foo, tgt.rules.foo)
})
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
	$uid.write($uid, '$uid', '===', 'auth.uid')
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
	$uid.write($uid, '!data.exists()', '&&', 'newData.child(\'user_id\').val()', '==', 'auth.uid')
	t('===', $uid['.write'], tgt.rules['.write'])
	t('{==}', $uid, tgt.rules)
})
