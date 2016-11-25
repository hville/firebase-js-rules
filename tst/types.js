var t = require('cotest'),
		T = require('../src/types')

t('type, primitive true/false', ()=>{
	var tgt = JSON.parse(`{
		"rules": {
			"foo": {
				".read": true,
				".write": false
			}
		}
	}`)
	var foo = {}
	T.read(foo, true)
	T.write(foo, false)
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
	var $uid = {}
	T.write($uid, '$uid', '===', 'auth.uid')
	t('===', $uid['.write'], tgt.rules.users.$uid['.write'])
	t('{==}', $uid, tgt.rules.users.$uid)
})
t('type, concat longer rules rules', ()=>{
	var tgt = JSON.parse(`{
		"rules": {
			".write": "!data.exists() && newData.child('user_id').val() == auth.uid"
		}
	}`)
	var $uid = {}
	T.write($uid, '!data.exists()', '&&', 'newData.child(\'user_id\').val()', '==', 'auth.uid')
	t('===', $uid['.write'], tgt.rules['.write'])
	t('{==}', $uid, tgt.rules)
})
t('type, function', ()=>{
	var tgt = JSON.parse(`{
		"rules": {
			".write": "!data.exists() && newData.child('user_id').val() == auth.uid"
		}
	}`)
	var $uid = {}
	function check() {
		return !data.exists() && newData.child('user_id').val() == auth.uid
	}
	T.write($uid, check)
	t('===', $uid['.write'], tgt.rules['.write'])
	t('{==}', $uid, tgt.rules)
})
