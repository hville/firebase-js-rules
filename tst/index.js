/*global auth, data, newData*/

/*
TODO: instead of {
	global
	group
	save
}
try:
rule.global()
rule() => rule
rule()
.write('kdkdkd')
.children({
	a: rule(),
	b: rule()
})
.save(filename)

*/


var t = require('cotest'),
		R = require('../src/index') //	global,group,save

//from: https://firebase.google.com/docs/reference/security/database/#variables
t('indexOn - Array', ()=>{
	var ref = JSON.parse(`{
		"dinosaurs": {
			".indexOn": ["height", "length"]
		}
	}`)
	var dino = R.group()
	dino.indexOn(['height', 'length'])
	t('{==}', dino, ref.dinosaures)
})

t('write - Function', ()=>{
	var ref = JSON.parse(`{
		".read": true,
		"$comment": {
			".write": "!data.exists() && newData.child('user_id').val() == auth.uid"
		}
	}`)
	var rules = R.group({
		$comment: R.group().write(function(){
			!data.exists() && newData.child('user_id').val() == auth.uid
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
		$comment: R.group().read(root.child('users').child(auth.uid).child('active').val(), '== true')
	}
	t('{==}', rules, ref)
})

t('chain rule types', ()=>{
	var ref = JSON.parse(`{
		"users": {
			"$user": {
				".read": true,
				".write": true,
				".validate": "newData.hasChildren(['name', 'age'])"
			}
		}
	}`)
	var rules = {
		users: {
			$user: R.group()
				.read(true)
				.write(true)
				.validate(newData.hasChildren(['name', 'age']))
		}
	}
	t('{==}', rules, ref)
})

//arbitrary rules to test
t('blast from the past', ()=>{
	var $dbID = R.group()
	.validate(newData.exists() || newData.hasChildren(['sys']))
	.read(data.hasChild('sys/boss/'+auth.id))
	.write(data.hasChild('sys/boss/'+auth.id))

	var dbOpen = R.group($dbID)
		.write(root.child($dbID+'/sys/boss/'+auth.id).exists())
	var dbAuth = R.group($dbID)
		.read(auth, '!==', null)

	var rules = R.group({
		$dbID: $dbID,
		open: dbOpen,
		auth: dbAuth,
		sys: R.group({
			type: R.group().validate(newData.isString()),
			boss: idList,
			edit: idList,
			read: idList,
			$other: R.group().validate(false)
		}).validate(newData.hasChildren(['type', 'boss', 'edit', 'read'])),
		type: R.group().validate(newData.isString())
	}).write(()=>{
		auth !== null && !data.exists() && newData.exists()
	})
})
