/*global auth, data, newData*/
var t = require('cotest'),
		R = require('../index') //	global,group,save

R.globals() //sets root, auth, data, newData and $ as globals

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
		$comment: R().write(function(){
			return !data.exists() && newData.child('user_id').val() == auth.uid
		})
	}).read(true)
	t('{==}', rules, ref)
})

t('chain methods', ()=>{
	var ref = JSON.parse(`{
		"comments": {
			".read": "root.child('users').child(auth.uid).child('active').val() == true"
		}
	}`)
	var rules = {
		comments: R().read(root.child('users').child(auth.uid).child('active').val(), '== true')
	}
	t('{==}', rules.comments['.read'], ref.comments['.read'])
	t('{==}', rules, ref)
})

t('chain rule types', ()=>{
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
				.validate(newData.hasChildren(['name', 'age']))
		}
	}
	t('{==}', rules.users.$user['.read'], ref.users.$user['.read'])
	t('{==}', rules.users.$user['.write'], ref.users.$user['.write'])
	t('{==}', rules.users.$user['.validate'], ref.users.$user['.validate'])
	t('{==}', rules, ref)
})

//arbitrary rules to test
t('blast from the past', ()=>{
	var $dbID = R()
	.validate(newData.exists() || newData.hasChildren(['sys']))
	.read(data.hasChild('sys/boss/'+auth.id))
	.write(data.hasChild('sys/boss/'+auth.id))

	var dbOpen = R($dbID)
		.write(root.child($dbID+'/sys/boss/'+auth.id).exists())

	var dbAuth = R($dbID)
		.read(auth, '!==', null)

	var idList = R()

	var rules = R({
		$dbID: $dbID,
		open: dbOpen,
		auth: dbAuth,
		sys: R({
			type: R().validate(newData.isString()),
			boss: idList,
			edit: idList,
			read: idList,
			$other: R().validate(false)
		}).validate(newData.hasChildren(['type', 'boss', 'edit', 'read'])),
		type: R().validate(newData.isString())
	}).write(()=>{
		return auth !== null && !data.exists() && newData.exists()
	})
	t('===', typeof rules, 'object') //TODO expand
})
