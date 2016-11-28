var t = require('cotest'),
		R = require('../index') //	global,group,save

function compareKeys(s, r) {
	var keys = new Set(Object.keys(s).concat(Object.keys(r)))
	for (var k of keys) {
		t('===', typeof s[k], typeof r[k], 'key: '+k)
		t('{==}', s[k], r[k], 'key: '+k)
	}
}

t('rule - primitive true/false/array', ()=>{
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

t('rule - string', ()=>{
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

t('rule - function', ()=>{
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

//from: https://firebase.google.com/docs/reference/security/database/#variables
t('rule - indexOn - Array', ()=>{
	var ref = JSON.parse(`{
		"dinosaurs": {
			".indexOn": ["height", "length"]
		}
	}`)
	var dino = R()
			.indexOn(['height', 'length'])
	t('{==}', dino['.indexOn'], ref.dinosaurs['.indexOn'])
	t('{==}', dino, ref.dinosaurs)
})

t('rule - write - Function', ()=>{
	var ref = JSON.parse(`{
		".read": true,
		"$comment": {
			".write": "!data.exists() && newData.child('user_id').val() == auth.uid"
		}
	}`)
	var rules = R({
		$comment: R().write(
			(data, newData, auth) =>
				!data.exists() //some multiline and comment curveballs
				&& newData.child('user_id').val() == auth.uid /* eslint eqeqeq:0 */
		)
	})
	.read(true)

	t('===', rules.$comment['.write'], ref.$comment['.write'])
	t('===', rules.$comment['.write'].replace(/\s+/g, ''), ref.$comment['.write'].replace(/\s+/g, ''))
	t('===', rules['.read'], ref['.read'])
	t('{==}', rules, ref)
})

t('rule - chain methods', ()=>{
	var ref = JSON.parse(`{
		"comments": {
			".read": "root.child('users').child(auth.uid).child('active').val() == true"
		}
	}`)
	var rules = {
		comments: R()
		.read((root, auth) => root.child('users').child(auth.uid).child('active').val() == true)
	}
	t('{==}', rules.comments['.read'], ref.comments['.read'])
	t('{==}', rules, ref)
})

t('rule - chain rule types', function() {
	var ref = JSON.parse(`{
		"users": {
			"$user": {
				".read": true,
				".write": true,
				".validate": "newData.hasChildren(['name','age'])"
			}
		}
	}`)
	var rules = {
		users: {
			$user: R()
				.read(true)
				.write(true)
				.validate(newData => newData.hasChildren(['name','age']))
		}
	}
	t('{==}', rules.users.$user['.read'], ref.users.$user['.read'])
	t('{==}', rules.users.$user['.write'], ref.users.$user['.write'])
	t('{==}', rules.users.$user['.validate'], ref.users.$user['.validate'])
	t('{==}', rules, ref)
})
