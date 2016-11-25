/*global auth, data, newData*/


var t = require('cotest'),
		setG = require('../src/global')

setG()

t('variable', ()=>{
	t('===', data.exists(), 'data.exists()')
	t('===', newData.child('user_id').val(), 'newData.child(\'user_id\').val()')
	t('===', auth.uid, 'auth.uid')
	t('==', auth, 'auth')
	var long = 'root.child(\'users\').child(auth.uid).child(\'active\').val()'
	t('===', root.child('users').child(auth.uid).child('active').val(), long)
})
