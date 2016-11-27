var t = require('cotest'),
		R = require('../index') //	global,group,save

//from: https://firebase.google.com/docs/reference/security/database/#variables
t('indexOn - Array', ()=>{
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

t('write - Function', ()=>{
	var ref = JSON.parse(`{
		".read": true,
		"$comment": {
			".write": "!data.exists() && newData.child('user_id').val() == auth.uid"
		}
	}`)
	var rules = R({
		$comment: R().write(
			(data, newData, auth) => !data.exists() && newData.child('user_id').val() == auth.uid
		)
	})
	.read(true)

	t('===', rules.$comment['.write'], ref.$comment['.write'])
	t('===', rules.$comment['.write'].replace(/\s+/g, ''), ref.$comment['.write'].replace(/\s+/g, ''))
	t('===', rules['.read'], ref['.read'])
	t('{==}', rules, ref)
})

t('chain methods', ()=>{
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

t('chain rule types', function() {
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
