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
	var rules = R()
	.read(true)
	.nest({
		$comment: R().write(function() {
			return !this.data.exists() && this.newData.child('user_id').val() == this.auth.uid
		})
	})
	t('===', rules.$comment['.write'], ref.$comment['.write'])
	t('===', rules.$comment['.write'].replace(/\s+/g, ''), ref.$comment['.write'].replace(/\s+/g, ''))
	t('===', rules['.read'], ref['.read'])
	t('{==}', rules, ref)
})

t('chain methods', function() {
	var ref = JSON.parse(`{
		"comments": {
			".read": "root.child('users').child(auth.uid).child('active').val() == true"
		}
	}`)
	var rules = {
		comments: R().read(R.root.child('users').child(R.auth.uid).child('active').val(), '== true')
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
				.validate(R.newData.hasChildren(['name', 'age']))
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
	.validate(R.newData.exists() || R.newData.hasChildren(['sys']))
	.read(R.data.hasChild('sys/boss/'+R.auth.id))
	.write(R.data.hasChild('sys/boss/'+R.auth.id))

	var dbOpen = R($dbID)
		.write(R.root.child($dbID+'/sys/bossX/'+R.auth.id).exists())

	var dbAuth = R($dbID)
		.read(R.auth, '!==', null)

	var idList = R()

	var rules = R({
		$dbID: $dbID,
		open: dbOpen,
		auth: dbAuth,
		sys: R({
			type: R().validate(R.newData.isString()),
			boss: idList,
			edit: idList,
			read: idList,
			$other: R().validate(false)
		}).validate(R.newData.hasChildren(['type', 'boss', 'edit', 'read'])),
		type: R().validate(R.newData.isString())
	}).write(function() {
		return this.auth !== null && !this.data.exists() && this.newData.exists()
	})
	t('===', typeof rules, 'object') //TODO expand
})
