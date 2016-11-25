var t = require('cotest'),
		S = require('../src/save'),
		fs = require('fs')

var ruleSet1 = JSON.parse(`{
	"rules": {
		"foo": {
			".read": true,
			".write": false
		}
	}
}`)
var ruleSet2 = JSON.parse(`{
	"rules": {
		"users": {
			"$uid": {
				".write": "$uid === auth.uid"
			}
		}
	}
}`)

t('save with default', ()=>{
	var path = './firebase-rules.json'
	S(ruleSet1.rules)
	var result = fs.readFileSync(path, 'utf8')
	t('{==}', JSON.parse(result), ruleSet1)
	fs.unlinkSync(path)
})
t('save with name', ()=>{
	var path = './firebase-rules.json'
	S(ruleSet2.rules, 'firebase-rules')
	var result = fs.readFileSync('./firebase-rules.json', 'utf8')
	t('{==}', JSON.parse(result), ruleSet2)
	fs.unlinkSync(path)
})
