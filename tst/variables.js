var t = require('cotest'),
		V = require('../src/variables')

t('variable', ()=>{
	t('===', V.data.exists(), true)
	t('===', V.newData.child('user_id').val(), 'val')
	t('===', V.auth.uid, 'uid')
	var longChain = V.root
	.child('users')
	.child(V.auth.uid)
	.parent()
	.child('active')
	.hasChildren()
	t('===', longChain, true)
})
