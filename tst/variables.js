var t = require('cotest'),
		V = require('../src/variables')

t('variable', ()=>{
	t('===', V.data.exists(), 'data.exists()')
	t('===', V.newData.child('user_id').val(), 'newData.child(\'user_id\').val()')
	t('===', V.auth.uid, 'auth.uid')
	t('==', V.auth, 'auth')
	var long = 'root.child(\'users\').child(auth.uid).child(\'active\').val()'
	t('===', V.root.child('users').child(V.auth.uid).child('active').val(), long)
})
