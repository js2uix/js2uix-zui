js2uix
===
js2uix is a Javascript Module that combines Dom Control function and Component production function.
Simple implementation of the existing Dom Control function, and additional component production is possible.

## js2uix (js2uix-dom-control)
<pre>
 * Name        : js2uix
 * Developer   : JH.Yu
 * Email       : deshineplus@icloud.com
 * Language    : Javascript(ES5)
 * Copyright   : 2018 JH.Yu (js2uix)
 * GitHub      : https://github.com/js2uix/js2uix
 * License     : https://github.com/js2uix/js2uix/blob/master/LICENSE
 
 * Create Dom Control Module (html dom control, component, ui creation tool)
 1. js2uix()
 2. js2uix.Component()
 3. js2uix.UI
 
 [Notice] Does not support IE 8 and lower versions!!
</pre>


## 1. Features
### 1. js2uix('selector'): default selector
**js2uix(param): The value of the parameter is'string','object','function'**
<pre>Example of use:<code>
import js2uix from 'js2uix';
or
const js2uix = require('js2uix');


js2uix('div') : Select the entire div tag.
js2uix('.class') : Select Node with class name.
js2uix('#id') : Select Npde with id name.
js2uix('&lt;div&gt;&lt;/div&gt;') : Create a new div tag.
js2uix(callback) : In case of callback function, callback can be executed after html load is completed.
</code></pre>

### 2. js2uix('selector).method().method() : Method chaining
**js2uix selector basically uses built-in functions through method chaining.**
<pre>Example of use:<code>
js2uix('div').addClass('test1').removeClass('test1')
</code></pre>

### 3. js2uix.Component(): Create a component object
**Independent component object can be created through the js2uix module.**

**Component objects for each function can be created/managed, and screens can be rendered by combining each object.**
<pre>Example of use:<code>
[Content.js]
    var Content = js2uix.Component({
        super : function(){
            this.state = {
                name : 'js2uix'
            }
        },
        onClick : function(){
            this.setState({
                name : 'js2uix-component'
            })
        },
        render : function(){
            var onClick = this.onClick.bind(this);
            var test = js2uix(
                '&lt;section class="content"&gt;' +
                '&lt;div class="text '+this.state.name+'"&gt;'+this.props.content+'!&lt;/div&gt;' +
                '&lt;/section&gt;'
            );
            test.addEvent('click', onClick);
            return (test);
        }
    });
    js2uix.Export('Content', Content);
</code></pre>
<pre>Example of use:<code>
[index.js]
    var content = js2uix.Import('Content');
    js2uix.Render(test.props({'content' : 'js2uix'}), '#root');
</code></pre>


## 2. Function (Dom Control)

**addClass: Set the class name of the selected Dom.**
<pre>Example of use:<code>
js2uix('div').addClass('test');
js2uix('div').addClass('test1 test2 test3');
</code></pre>

**addEvent: Set event on selected Dom**
<pre>Example of use:<code>
js2uix('div#test').addEvent('click', function(){ ... });
js2uix('div#test').addEvent({
    'click' : function(){...},
    'mouseover' : function(){...}
});
</code></pre>

**addId: Set id name of selected Dom.**
<pre>Example of use:<code>
js2uix('div').addId('test');
</code></pre>

**after: Insert Dom after selected Dom.**
<pre>Example of use:<code>
js2uix('div').after(js2uix('.test1'));
js2uix('div').after('&lt;div&gt;test&lt;/div&gt;');
js2uix('div').after('test');
</code></pre>

**ajaxForm: ajax communication using Dom of selected form type.**
<pre>Example of use:<code>
js2uix('form').ajaxForm({
    url : '/ajax/api',
    method : 'POST',
    data : {title : 'title'},
    success : function(){},
    error : function(){}
});
</code></pre>

**animate: Dynamic processing effect using the selected Dom.**
<pre>Example of use:<code>
js2uix('div').animate({
    width : 100,
    height : 200
}, 250, function(){
    console.log('animate end!')
});
</code></pre>

**append: Insert Dom at the end of the selected Dom.**
<pre>Example of use:<code>
js2uix('div').append(js2uix('.test1'));
js2uix('div').append('&lt;div&gt;test&lt;/div&gt;');
</code></pre>

**before: Insert Dom before the selected Dom.**
<pre>Example of use:<code>
js2uix('div').before(js2uix('.test1'));
js2uix('div').before('&lt;div&gt;test&lt;/div&gt;');
js2uix('div').before('test');
</code></pre>

**children: Check the child Dom in the selected Dom.**
<pre>Example of use:<code>
js2uix('div').children();
js2uix('div').children('.child');
</code></pre>

**clone: Copy selected Dom.**
<pre>Example of use:<code>
var newDiv = js2uix('div').clone();
var deepDiv = js2uix('div').clone(true);
</code></pre>

**createDom: Create new Dom.**
<pre>Example of use:<code>
var newNode = js2uix.createDom('div', {
    className : 'test',
    idName : 'ids',
    attributes : {
        'data-id' : 'test11',
        'data-name' : 'testName'
    },
    styles : {
        'width' : 100,
        'height' : 200,
        'backgroundColor' : 'red'
    },
    content : 'hello world'
});
console.log( newNode ); //div node
</code></pre>

**css: Set style of selected Dom**
<pre>Example of use:<code>
js2uix('div').css('color', 'red');
js2uix('div').css({
    'color' : 'red',
    'z-index' : 1
});
</code></pre>

**empty: Delete all child elements of the selected Dom.**
<pre>Example of use:<code>
js2uix('div').empty();
</code></pre>

**extend: merge/inherit objects**
<pre>Example of use:<code>
var object1 = {test1:1, test2:2}
var object2 = {test1:1, test2:2}
js2uix.extend({}, object1);
js2uix.extend(object1, object2);
</code></pre>

**fadeIn: Flashing of selected Dom.**
<pre>Example of use:<code>
js2uix('div').fadeIn();
js2uix('div').fadeIn(250);
</code></pre>

**fadeOut: Flashing of selected Dom.**
<pre>Example of use:<code>
js2uix('div').fadeOut();
js2uix('div').fadeOut(250);
</code></pre>

**find: Find a specific Dom within the selected Dom**
<pre>Example of use:<code>
js2uix('div').find('.test1');
js2uix('div.name').find('div');
</code></pre>

**firstNode: Select the first Dom from the selected Dom**
<pre>Example of use:<code>
var first = js2uix('div').firstNode();
</code></pre>

**getAttr: Check the attribute of the selected Dom**
<pre>Example of use:<code>
js2uix('div').getAttr('data-name');
js2uix('div').getAttr();
</code></pre>

**hasChild: Check if the selected Dom has a specific child**
<pre>Example of use:<code>
js2uix('div').hasChild( '.test1' );
</code></pre>

**hasClass: Check if the selected Dom has a specific class name**
<pre>Example of use:<code>
js2uix('div').hasClass( 'test1' );
</code></pre>

**hasId: Check if the selected Dom has a specific id name**
<pre>Example of use:<code>
js2uix('div').hasId( 'test1' );
</code></pre>

**hasParents: Identify parents with a specific name among the parents of the selected Dom**
<pre>Example of use:<code>
js2uix('div').hasParents( '.parent' );
</code></pre>

**height: Set and check the height value of the selected Dom**
<pre>Example of use:<code>
js2uix('div').height( 200 );
var height = js2uix('div').height();
console.log(height) //200
</code></pre>

**hide: Display property of selected Dom none**
<pre>Example of use:<code>
js2uix('div').hide();
</code></pre>

**html: Set and return child elements of the selected Dom**
<pre>Example of use:<code>
var html = js2uix('div').html();
js2uix('div').html('test');
js2uix('div').html('<div>test</div>');
</code></pre>

**index: Check the index information of the selected Dom**
<pre>Example of use:<code>
js2uix('li').index();
</code></pre>

**lastINode: Select the last Dom among the selected Dom**
<pre>Example of use:<code>
var last = js2uix('div').lastINode();
</code></pre>

**left: Set and check the left value of the selected Dom**
<pre>Example of use:<code>
js2uix('div').left( 200 );
var height = js2uix('div').left();
console.log(left) //200
</code></pre>

**loaded: executed after all html is loaded**
<pre>Example of use:<code>
js2uix.loaded(function(){
    console.log('load complete');
});
js2uix(function(){
    console.log('load complete');
});
</code></pre>

**loop: Apply the loop of the selected Dom or specific object**
<pre>Example of use:<code>
js2uix('div').loop(function(num, node){
    console.log(num, node);
});

var doms = js2uix('div');
js2uix.loop(doms, function(num, node){
    console.log(num, node);
});

var array = [1,2,3,4];
js2uix.loop(array, function(num, value){
    console.log(num, value);
})
</code></pre>

**nextNode: Next selection of the selected Dom**
<pre>Example of use:<code>
var next = js2uix('div.test').nextNode();
console.log(next);
</code></pre>

**not: not select of selected Dom**
<pre>Example of use:<code>
var item = js2uix('div.test').not('.test2');
console.log(item);
</code></pre>

**Offset: Check the offset of the selected Dom**
<pre>Example of use:<code>
var offset = js2uix('div.test').offset();
console.log(offset);
</code></pre>

**parent: Check the parent directly above the selected Dom**
<pre>Example of use:<code>
var parent1 = js2uix('div.test').parent();
var parent2 = js2uix('div.test').parent('.parent');
console.log(parent1);
console.log(parent2);
</code></pre>

**parents: Confirm a specific parent among selected Dom parents**
<pre>Example of use:<code>
var parent = js2uix('div.test').parents('.parent');
console.log(parent);
</code></pre>

**prepend: Insert Dom at the beginning of the selected Dom**
<pre>Example of use:<code>
js2uix('div.target').prepend(js2uix('div.test'));
js2uix('div.target').prepend('&lt;div&gt;test&lt;/div&gt;');
</code></pre>

**prevNode: Previous selection of the selected Dom**
<pre>Example of use:<code>
var prev = js2uix('div.test').prevNode();
console.log(prev);
</code></pre>

**remove: Delete selected Dom**
<pre>Example of use:<code>
js2uix('div.test').remove();
</code></pre>

**removeAttr: Delete the specific attribute value of the selected Dom**
<pre>Example of use:<code>
js2uix('div.test').removeAttr('data-id');
</code></pre>

**removeClass: Delete specific class value of selected Dom**
<pre>Example of use:<code>
js2uix('div.test').removeClass('test');
</code></pre>

**removeEvent: Remove selected Dom event**
<pre>Example of use:<code>
var addEventHandler = function(){...};
js2uix('div#test').removeEvent();
js2uix('div#test').removeEvent('click');
js2uix('div#test').removeEvent('click.eventName');
js2uix('div#test').removeEvent('click', addEventHandler);
</code></pre>

**removeId: Delete the specific id value of the selected Dom**
<pre>Example of use:<code>
js2uix('div#test').removeId('test');
</code></pre>

**replace: Replace the selected Dom with a specific Dom or a generated Dom**
<pre>Example of use:<code>
js2uix('div#test').replace(js2uix('div.new'));
</code></pre>

**setAttr: Set attribute of selected Dom.**
<pre>Example of use:<code>
js2uix(select).addAttr('data-name', test);
js2uix(select).addAttr({
    'data-name' : test,
    'data-value' : 100
});
</code></pre>

**show: display property block of the selected Dom**
<pre>Example of use:<code>
js2uix('div#test').show();
</code></pre>

**siblingNodes: Check for adjacent sibling elements except for the selected Dom**
<pre>Example of use:<code>
js2uix('div#test').siblingNodes();
</code></pre>

**text: Set and check the text of the selected Dom**
<pre>Example of use:<code>
js2uix('div#test').text('test');
var textValue = js2uix('div#test').text();
console.log(textValue) 
</code></pre>

**top: Set and check the top of the selected Dom**
<pre>Example of use:<code>
var top = js2uix('div#test').top();
console.log(top);
js2uix('div#test').top(200);
</code></pre>

**value: Set and check the value of Dom of the selected form**
<pre>Example of use:<code>
var value = js2uix('input').value();
js2uix('input').value('test');
</code></pre>

**width: Set and check the width of the selected Dom**
<pre>Example of use:<code>
var width = js2uix('div#test').width();
console.log(width);
js2uix('div#test').width(200);
</code></pre>


