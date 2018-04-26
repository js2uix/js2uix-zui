var id = zui('#root');
var test = zui('.test');
/*
var div = ZUI('div');
var div2 = ZUI('<div>');
var div3 = ZUI('<div>123</div>');
var input = ZUI('input');
var input2 = ZUI('<input>');
*/
console.log(id)
console.log(id.hasId('root'))
console.log(test)
test.addId('nonono');
test.removeId('nonono');
id.addClass('zgsg')
id.addAttr('data-id', 'testet')
console.log( id.getAttr('data-id') )
id.removeAttr('data-id')
/*
console.log(div)
console.log(div2)
console.log("a", div3)
console.log(input)
console.log(input2)
*/