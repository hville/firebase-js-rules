'use strict'
var $ = '$'
var AUTHID = 'auth.id'
var AUTH = 'auth'
var ROOT = 'root'
var DATA = 'data'
var NEWDATA = 'newData'
var COMMA = "'"
var QUOTE = '"'  // TODO required?


// INTERNAL
function string(str) {
	if (str === undefined) return ''
  if (str[0] === $ || str === 'now' || str[0] === COMMA) return str
  var first = str.split('.')[0]
  if (first===ROOT || first===DATA || first===AUTH || first ===NEWDATA) return str
  return COMMA + str + COMMA
}

function pathString(str) {
	if (str === undefined) return ''
	var arr = str.split('/')
  return arr.map(string).join('/')
}


// PATH METHODS
function Path(base) {
  this.path = base
}
Path.prototype.child = function(str) {
  if (str !== undefined) this.path += '.child(' + pathString(str) + ')'
  return new Path(this.path)
}
Path.prototype.parent = function(str) {
  if (str !== undefined) this.path += '.parent(' + pathString(str) + ')'
  return new Path(this.path)
}
Path.prototype.hasChild = function(str) {
  if (str !== undefined) this.path += '.hasChild(' + pathString(str) + ')'
  return this.path
}
Path.prototype.val = function() {
  this.path += '.val()'
  return this.path
}
Path.prototype.exist = function() {
  this.path += '.exist()'
  return this.path
}
Path.prototype.isNumber = function() {
  this.path += '.isNumber()'
  return this.path
}
Path.prototype.isString = function() {
  this.path += '.isString()'
  return this.path
}
Path.prototype.isBoolean = function() {
  this.path += '.isBoolean()'
  return this.path
}
Path.prototype.getPriority = function() {
  this.path += '.getPriority()'
  return this.path
}
Path.prototype.hasChildren = function(arr) {
  this.path += '.hasChildren([' + String(arr.map(string)) + '])'
  return this.path
}
Path.prototype.isEqual = function(str) {
  this.path += '.val()===' + string(str)
  return this.path
}
Path.prototype.isAuth = function(str) {
  return this.isEqual(AUTHID)
}
function path(typ, pth) {
	var P = new Path(typ)
	return pth === undefined ? P : P.child(pth)
}


// OPERATOR
function comp(op, a, b) {
	return string(a) + op + string(b)
}


//VALUE
function isAuth() { return 'auth.id !== null' }
function isUser(id) { return comp('===', id, AUTHID) }
//function length(str) { return string(str)+'.length' }
//str.contains(), .beginsWith(), endsWith(), .replace(), ...


module.exports = {
	root: path.bind(null, ROOT),
	data: path.bind(null, DATA),
	newData: path.bind(null, NEWDATA),
	isEqual: comp.bind(null, '==='),
	notEqual: comp.bind(null, '!=='),
	isAuth: isAuth,
	isUser: isUser,
	//length: length
}




/*
+ plain:          "root.child($uid).val() === auth.id"
  stringOnly:     isUser(val(root($uid)))
+ chainObj:       root($uid).isAuth()
  prefix:         path.isAuth(root($uid))
*/

/*
  plain:          "root.child('open'/$dbid/'edit').hasChild($usid)"
  mimic:          root.child('open/$dbid/edit').hasChild('$usid')
  stringOnly:     hasChild(root('open', $uid, 'edit'))
+ chainObj:       root('open', $uid, 'edit').hasChild()
  prefix:         path.hasChild(root('open', $uid, 'edit'))
*/

/*
+ plain:          "!data.exist() && newData() !== null"
  stringOnly:     and( exist(data()), notNull(newData()) )
  chainObj:       op( data().exist(), '&&', notNull(newData() )
  prefix:         and( path.exist(data(), notNull(newData()) )
*/

/*
  plain:          $key: { ".validate": "newData().isString", ".write": "true" }
  stringOnly:     $key: { ".validate": isString(newData()), ".write": TRUE }
  chainObj:       $key: prede
  prefix:
*/


