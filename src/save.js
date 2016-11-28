var fs = require('fs')

var defaultName = 'firebase-rules.json',
		extension = '.json'

module.exports = save

function save(fileName) {
	var json = JSON.stringify({rules: this}, null, 2),
			name = !fileName ? defaultName
				: fileName.slice(-extension.length) === extension ? fileName
				: fileName + extension
	fs.writeFileSync(name, json)
}
